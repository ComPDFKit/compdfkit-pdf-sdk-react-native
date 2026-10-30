/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import android.content.Context;
import android.graphics.RectF;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.signature.CPDFSignature;
import com.compdfkit.core.signature.CPDFSigner;
import com.compdfkit.core.signature.CPDFX509;
import com.compdfkit.core.signature.CPDFCertInfo;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

/** Maps signature metadata and signer certificates without changing native index identity. */
final class RnDigitalSignatureMapper {
  private RnDigitalSignatureMapper() {}

  static WritableMap toMap(CPDFSignature signature, CPDFDocument document, int index, Context context) {
    WritableMap value = Arguments.createMap();
    value.putInt("signature_index", index);
    value.putString("field_name", signature.getFieldName());
    value.putInt("page_index", signature.getPageIndex(document));
    value.putString("name", signature.getName());
    value.putString("date", signature.getDate());
    value.putString("reason", signature.getReason());
    value.putString("location", signature.getLocation());
    value.putString("filter", signature.getFilter());
    value.putString("sub_filter", signature.getSubFilter());
    RectF rect = signature.getBounds();
    if (rect != null) {
      WritableMap bounds = Arguments.createMap();
      bounds.putDouble("left", rect.left);
      bounds.putDouble("top", rect.top);
      bounds.putDouble("right", rect.right);
      bounds.putDouble("bottom", rect.bottom);
      value.putMap("bounds", bounds);
    }
    value.putInt("permissions", signature.getPermissionType().id);
    // Android core does not expose iOS modification records.
    value.putArray("modifications", Arguments.createArray());
    WritableArray signers = Arguments.createArray();
    CPDFSigner[] nativeSigners = signature.getSignerArr();
    boolean verified = signature.verify(document);
    if (nativeSigners != null) {
      for (CPDFSigner signer : nativeSigners) {
        if (signer == null || !signer.isValid()) continue;
        WritableMap entry = Arguments.createMap();
        CPDFX509 certificate = signer.getCert();
        entry.putBoolean("signature_verified", verified);
        entry.putBoolean("certificate_trusted", certificate != null && certificate.checkCertificateIsTrusted(context));
        WritableArray certificates = Arguments.createArray();
        if (certificate != null && certificate.isValid()) certificates.pushMap(certificateMap(certificate, context));
        entry.putArray("certificates", certificates);
        signers.pushMap(entry);
      }
    }
    value.putArray("signers", signers);
    return value;
  }

  private static WritableMap certificateMap(CPDFX509 certificate, Context context) {
    CPDFCertInfo info = certificate.getCertInfo();
    WritableMap value = Arguments.createMap();
    value.putString("version", info.getVersion());
    value.putString("serial_number", info.getSeriaNumber());
    value.putString("key_type", info.getKeyType());
    value.putString("signature_algorithm", info.getSignatureAlgOid());
    value.putString("issuer", info.getIssuer() == null ? null : info.getIssuer().toString());
    value.putString("subject", info.getSubject() == null ? null : info.getSubject().toString());
    value.putString("valid_from", info.getValidDateBegin());
    value.putString("valid_to", info.getValidDateEnd());
    value.putString("sha1_digest", info.getSha1Digest());
    value.putString("md5_digest", info.getMd5Digest());
    value.putBoolean("is_trusted", certificate.checkCertificateIsTrusted(context));
    value.putBoolean("is_expired", certificate.isExpired());
    return value;
  }
}
