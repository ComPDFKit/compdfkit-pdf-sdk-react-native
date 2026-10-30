/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import android.text.TextUtils;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.signature.*;
import com.facebook.react.bridge.*;
import java.io.File;
import java.util.*;

/** Saved-file LTV evidence and PAdES prolongation. Never overwrites the source PDF. */
final class RnSignatureLtvOps {
  private RnSignatureLtvOps() {}

  static Boolean embeddedTimestampValid(CPDFDocument document, CPDFSignature signature) {
    CPDFSignatureValidationReport report = validationReport(document, signature);
    return report == null ? null : report.hasEmbeddedTimestamp();
  }

  static WritableMap getLtvReadiness(RnPdfViewContext context) {
    if (context.document == null) throw new IllegalStateException("invalid_document");
    CPDFLtvReadinessResult result = CPDFLtvService.assessReadiness(context.document);
    if (result == null) throw new IllegalStateException("ltv_readiness_failed");
    return Arguments.makeNativeMap(toReadinessMap(result));
  }

  /** The caller saves pending edits before this operation reads the current file. */
  static WritableMap addSignatureLtv(RnPdfViewContext context, String outputPath, ReadableMap options) {
    if (context.document == null) throw new IllegalStateException("invalid_document");
    Map<String, Object> values = options.toHashMap();
    String root = string(values, "trusted_certificate_path");
    if (!new File(root).isFile()) throw new IllegalArgumentException("certificate_not_found");
    String input = context.document.getAbsolutePath();
    String lta = nullableString(values, "lta_output_path");
    String tsa = nullableString(values, "timestamp_server_url");
    boolean append = Boolean.TRUE.equals(values.get("append_document_timestamp"));
    if (TextUtils.isEmpty(input) || !new File(input).isFile()) throw new IllegalStateException("invalid_document");
    if (!isValidOutput(input, outputPath) || (append && (!isValidOutput(input, lta) || samePath(outputPath, lta) || TextUtils.isEmpty(tsa)))) {
      throw new IllegalArgumentException("ltv_output_invalid");
    }
    CPDFPadesOptions config = new CPDFPadesOptions().setTrustedCertPath(root)
      .setRevocationUrls(strings(values, "ocsp_urls"), strings(values, "crl_urls"))
      .setAppendDocumentTimestamp(append);
    if (append) config.setLtaTsaUrl(tsa);
    return Arguments.makeNativeMap(toLtvResultMap(CPDFPadesSigner.prolongLtv(input, outputPath, append ? lta : null, config)));
  }

  private static String string(Map<String, Object> values, String key) {
    Object value = values.get(key); return value == null ? "" : String.valueOf(value);
  }
  private static String nullableString(Map<String, Object> values, String key) {
    String value = string(values, key); return value.isEmpty() ? null : value;
  }

    private static CPDFSignatureValidationReport validationReport( CPDFDocument document,
             CPDFSignature signature) {
        String fieldName = signature.getFieldName();
        CPDFSignatureValidationResult validation = CPDFSignatureValidator.validate(document,
                new CPDFSignatureValidationOptions().setFieldName(fieldName));
        if (validation == null || validation.getReports() == null) {
            return null;
        }
        for (CPDFSignatureValidationReport report : validation.getReports()) {
            if (report != null && TextUtils.equals(report.getFieldName(), fieldName)) {
                return report;
            }
        }
        return null;
    }

    /** Matches the document-level LTV check used by the Android ComPDFKit_Tools demo. */
    private static boolean documentLtvReady( CPDFDocument document) {
        CPDFLtvReadinessResult result = CPDFLtvService.assessReadiness(document);
        return result != null
                && result.isSuccess()
                && result.getReadinessInfo() != null
                && result.getReadinessInfo().isLtvReady();
    }

    private static HashMap<String, Object> toReadinessMap(
             CPDFLtvReadinessResult readiness) {
        HashMap<String, Object> value = new HashMap<>();
        CPDFLtvReadinessInfo info = readiness.getReadinessInfo();
        value.put("success", readiness.isSuccess());
        value.put("has_dss", info != null && info.hasDss());
        value.put("has_vri", info != null && info.hasVri());
        value.put("has_certificates", info != null && info.hasCertificates());
        value.put("has_revocation", info != null && info.hasRevocation());
        value.put("ltv_ready", info != null && info.isLtvReady());
        value.put("profile_hint", info == null ? "" : info.getProfileHint());
        ArrayList<String> missingMaterials = new ArrayList<>();
        if (info != null && info.getMissingMaterials() != null) {
            for (String material : info.getMissingMaterials()) {
                if (!TextUtils.isEmpty(material)) {
                    missingMaterials.add(material);
                }
            }
        }
        value.put("missing_materials", missingMaterials);
        HashMap<String, Object> dss = new HashMap<>();
        CPDFLtvDssInfo dssInfo = info == null ? null : info.getDssInfo();
        dss.put("certificates_count", dssInfo == null ? 0 : dssInfo.getCertificatesCount());
        dss.put("ocsp_responses_count", dssInfo == null ? 0 : dssInfo.getOcspResponsesCount());
        dss.put("crls_count", dssInfo == null ? 0 : dssInfo.getCrlsCount());
        dss.put("vri_entries_count", dssInfo == null ? 0 : dssInfo.getVriEntriesCount());
        value.put("dss", dss);
        value.put("errors", toIssues(readiness.getErrors()));
        value.put("warnings", toIssues(readiness.getWarnings()));
        return value;
    }

    private static HashMap<String, Object> toLtvResultMap( CPDFPadesResult padesResult) {
        HashMap<String, Object> value = new HashMap<>();
        boolean success = padesResult != null && padesResult.isSuccess();
        value.put("success", success);
        // Paths are reported only for a successful run; a failed run may still
        // echo the requested path even though no usable file was produced.
        value.put("ltv_path", success ? padesResult.getLtvPath() : "");
        value.put("lta_path", success ? padesResult.getLtaPath() : "");
        value.put("errors", toIssues(padesResult == null ? null : padesResult.getErrors()));
        value.put("warnings", toIssues(padesResult == null ? null : padesResult.getWarnings()));
        return value;
    }

    private static ArrayList<HashMap<String, Object>> toIssues(
             CPDFValidationReportItem[] items) {
        ArrayList<HashMap<String, Object>> values = new ArrayList<>();
        if (items == null) {
            return values;
        }
        for (CPDFValidationReportItem item : items) {
            if (item != null) {
                values.add(issue(item.getCode(), item.getMessage()));
            }
        }
        return values;
    }

    /** Converts the core's {@code code: message} lines into issue maps. */
    private static ArrayList<HashMap<String, Object>> toIssues( String[] lines) {
        ArrayList<HashMap<String, Object>> values = new ArrayList<>();
        if (lines == null) {
            return values;
        }
        for (String line : lines) {
            if (TextUtils.isEmpty(line)) {
                continue;
            }
            int separator = line.indexOf(": ");
            values.add(separator < 0
                    ? issue(line, "")
                    : issue(line.substring(0, separator), line.substring(separator + 2)));
        }
        return values;
    }

    private static HashMap<String, Object> issue( String code,  String message) {
        HashMap<String, Object> value = new HashMap<>();
        value.put("code", code == null ? "" : code);
        value.put("message", message == null ? "" : message);
        return value;
    }

    private static boolean isValidOutput( String inputPath,  String outputPath) {
        if (TextUtils.isEmpty(outputPath)) {
            return false;
        }
        File parent = new File(outputPath).getAbsoluteFile().getParentFile();
        return parent != null && parent.isDirectory() && !samePath(inputPath, outputPath);
    }

    private static boolean samePath( String first,  String second) {
        if (first == null || second == null) {
            return false;
        }
        try {
            return new File(first).getCanonicalFile().equals(new File(second).getCanonicalFile());
        } catch (Exception ignored) {
            return new File(first).getAbsoluteFile().equals(new File(second).getAbsoluteFile());
        }
    }


    private static String[] strings( Map<String, Object> values, String key) {
        Object value = values.get(key);
        if (!(value instanceof List)) {
            return null;
        }
        ArrayList<String> items = new ArrayList<>();
        for (Object item : (List<?>) value) {
            if (item != null && !TextUtils.isEmpty(String.valueOf(item))) {
                items.add(String.valueOf(item));
            }
        }
        return items.isEmpty() ? null : items.toArray(new String[0]);
    }

}
