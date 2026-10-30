/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFSignatureWidget;
import com.compdfkit.core.signature.CPDFSignature;
import com.compdfkit.core.signature.CPDFSigner;
import com.compdfkit.core.signature.CPDFX509;
import com.compdfkit.core.signature.CPDFDigitalSigConfig;
import com.compdfkit.core.document.CPDFDocument.PDFDocMdpP;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.io.File;

/** Signature queries and writes for one reader. Call expensive operations on an IO worker. */
final class RnDigitalSignatureOps {
  private final ReactApplicationContext reactContext;
  RnDigitalSignatureOps(ReactApplicationContext context) { reactContext = context; }
  private boolean isDocumentAvailable(RnPdfViewContext context) { return context != null && context.document != null; }
  private static boolean sameFile(String first, String second) {
    try { return new File(first).getCanonicalFile().equals(new File(second).getCanonicalFile()); }
    catch (java.io.IOException error) { throw new IllegalArgumentException("invalid_output_path"); }
  }
  /** Enumerates native indices; invalid entries are omitted without renumbering the rest. */
  WritableArray getDigitalSignatures(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) throw new IllegalStateException("invalid_document");
    WritableArray values = Arguments.createArray();
    for (int index = 0; index < context.document.getSignatureCount(); index++) {
      CPDFSignature signature = context.document.getPdfSignature(index);
      if (signature != null && signature.isValid()) {
        values.pushMap(RnDigitalSignatureMapper.toMap(signature, context.document, index, reactContext));
      }
    }
    return values;
  }

  /** Verifies the selected native signature index, independently of filtered list order. */
  WritableMap verifyDigitalSignature(RnPdfViewContext context, int index) {
    if (!isDocumentAvailable(context)) throw new IllegalStateException("invalid_document");
    if (index < 0 || index >= context.document.getSignatureCount()) throw new IllegalArgumentException("signature_verification_failed");
    CPDFSignature signature = context.document.getPdfSignature(index);
    if (signature == null || !signature.isValid()) throw new IllegalArgumentException("signature_verification_failed");
    WritableMap result = Arguments.createMap();
    result.putBoolean("signature_valid", signature.verify(context.document));
    result.putBoolean("document_unmodified", signature.verifyDocument(context.document));
    boolean trusted = false;
    boolean expired = false;
    CPDFSigner[] signers = signature.getSignerArr();
    if (signers != null) {
      for (CPDFSigner signer : signers) {
        if (signer == null || !signer.isValid()) continue;
        CPDFX509 certificate = signer.getCert();
        if (certificate != null && certificate.isValid()) {
          trusted |= certificate.checkCertificateIsTrusted(reactContext);
          expired |= certificate.isExpired();
        }
      }
    }
    result.putBoolean("certificate_trusted", trusted);
    result.putBoolean("certificate_expired", expired);
    result.putBoolean("timestamp_trusted", signature.veryfyTimestamp(reactContext));
    result.putInt("timestamp_source", signature.getTimestampSource().getId());
    try {
      Boolean embedded = RnSignatureLtvOps.embeddedTimestampValid(context.document, signature);
      if (embedded == null) result.putNull("embedded_timestamp_valid");
      else result.putBoolean("embedded_timestamp_valid", embedded);
    } catch (Exception error) {
      // Evidence inspection must not discard basic signature verification results.
      result.putNull("embedded_timestamp_valid");
    }
    try {
      WritableMap readiness = RnSignatureLtvOps.getLtvReadiness(context);
      if (readiness.getBoolean("success")) result.putBoolean("ltv_enabled", readiness.getBoolean("ltv_ready"));
      else result.putNull("ltv_enabled");
    } catch (Exception error) {
      result.putNull("ltv_enabled");
    }
    return result;
  }

  /** Writes only the selected unsigned field to a distinct output path. */
  boolean writeSignature(RnPdfViewContext context, int pageIndex, String uuid,
      String outputPath, ReadableMap config) {
    if (!isDocumentAvailable(context)) throw new IllegalStateException("invalid_document");
    CPDFAnnotation annotation = context.pageUtil.getAnnotation(pageIndex, uuid);
    if (!(annotation instanceof CPDFSignatureWidget)) throw new IllegalArgumentException("signature_widget_not_found");
    if (config == null || !config.hasKey("certificate_path") || !config.hasKey("password")) {
      throw new IllegalArgumentException("invalid_signature_config");
    }
    String certificate = config.getString("certificate_path");
    String password = config.getString("password");
    if (TextUtils.isEmpty(certificate) || !new File(certificate).isFile()) throw new IllegalArgumentException("certificate_not_found");
    if (!CPDFSignature.checkPKCS12Password(certificate, password)) throw new IllegalArgumentException("invalid_certificate_password");
    if (TextUtils.isEmpty(outputPath)) throw new IllegalArgumentException("invalid_output_path");
    File output = new File(outputPath);
    File parent = output.getParentFile();
    String source = context.document.getAbsolutePath();
    if (parent == null || !parent.isDirectory() || !parent.canWrite()
        || (!TextUtils.isEmpty(source) && sameFile(source, outputPath))) {
      throw new IllegalArgumentException("invalid_output_path");
    }
    CPDFSignatureWidget widget = (CPDFSignatureWidget) annotation;
    if (widget.isSigned()) throw new IllegalArgumentException("signature_already_signed");
    ReadableMap appearance = config.getMap("appearance");
    String name = config.hasKey("name") ? config.getString("name") : "";
    if (appearance != null && !widget.updateApWithDigitalSigConfig(signatureAppearance(appearance, name))) {
      throw new IllegalStateException("signature_write_failed");
    }
    String location = config.hasKey("location") ? config.getString("location") : null;
    String reason = config.hasKey("reason") ? config.getString("reason") : null;
    int permission = config.hasKey("permissions") ? config.getInt("permissions") : 2;
    String tsa = config.hasKey("timestamp_server_url") && !config.isNull("timestamp_server_url")
        ? config.getString("timestamp_server_url") : null;
    boolean success = tsa == null
        ? context.document.writeSignature(widget, outputPath, certificate, password, location, reason, PDFDocMdpP.valueOf(permission))
        : context.document.writeSignature(widget, outputPath, certificate, password, location, reason, PDFDocMdpP.valueOf(permission), tsa);
    if (!success) throw new IllegalStateException(tsa == null ? "signature_write_failed" : "signature_timestamp_failed");
    return true;
  }

  /** Builds appearance only after every requested bitmap can be decoded. */
  private static CPDFDigitalSigConfig signatureAppearance(ReadableMap values, String fallbackName) {
    CPDFDigitalSigConfig result = new CPDFDigitalSigConfig();
    result.setText(values.hasKey("text") ? values.getString("text") : fallbackName);
    result.setContent(values.hasKey("content") ? values.getString("content") : "");
    result.setDrawLogo(!values.hasKey("draw_logo") || values.getBoolean("draw_logo"));
    result.setDrawOnlyContent(values.hasKey("draw_only_content") && values.getBoolean("draw_only_content"));
    result.setContentAlginLeft(!values.hasKey("content_align_left") || values.getBoolean("content_align_left"));
    if (values.hasKey("text_color")) result.setTextColor(Color.parseColor(values.getString("text_color")));
    if (values.hasKey("content_color")) result.setContentColor(Color.parseColor(values.getString("content_color")));
    if (values.hasKey("logo_path") && !values.isNull("logo_path")) result.setLogo(requireBitmap(values.getString("logo_path")));
    if (values.hasKey("image_path") && !values.isNull("image_path")) result.setImage(requireBitmap(values.getString("image_path")));
    return result;
  }

  private static Bitmap requireBitmap(String path) {
    Bitmap bitmap = BitmapFactory.decodeFile(path);
    if (bitmap == null) throw new IllegalArgumentException("invalid_signature_config");
    return bitmap;
  }
}
