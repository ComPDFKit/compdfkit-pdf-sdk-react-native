//
//  RnSignatureLtvService.swift
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import ComPDFKit
import Foundation

/// Document-level evidence assessment and prolongation. Instances are not shared across queues.
enum RnSignatureLtvService {
  static func readiness(_ document: CPDFDocument) -> [String: Any] {
    return ltvReadinessMap(CPDFLtvService().assessReadiness(of: document))
  }

  /// A missing report means unavailable, rather than an invalid embedded timestamp.
  static func embeddedTimestampValid(_ signature: CPDFSignature, document: CPDFDocument) -> Bool? {
    return validationReport(for: signature, document: document).map {
      hasValidEmbeddedTimestamp($0)
    }
  }

  /// Reads the saved source and creates distinct LTV/LTA copies on a worker queue.
  static func add(
    document: CPDFDocument, outputPath: String, options: [String: Any],
    completion: @escaping (Result<[String: Any], Error>) -> Void
  ) {
    func fail(_ code: String, _ message: String) {
      completion(
        .failure(NSError(domain: code, code: 0, userInfo: [NSLocalizedDescriptionKey: message])))
    }
    let trustedCertificatePath = options["trusted_certificate_path"] as? String ?? ""
    let appendDocumentTimestamp = options["append_document_timestamp"] as? Bool ?? false
    let ltaOutputPath = options["lta_output_path"] as? String ?? ""
    guard FileManager.default.fileExists(atPath: trustedCertificatePath) else {
      fail("certificate_not_found", "The trusted root certificate file could not be found.")
      return
    }
    guard let inputPath = document.documentURL?.path,
      FileManager.default.fileExists(atPath: inputPath)
    else {
      fail("invalid_document", "LTV requires a document saved as a file.")
      return
    }
    guard isValidOutput(outputPath, inputPath: inputPath),
      !appendDocumentTimestamp
        || (isValidOutput(ltaOutputPath, inputPath: inputPath)
          && !isSamePath(outputPath, ltaOutputPath))
    else {
      fail(
        "ltv_output_invalid", "LTV and LTA require separate output files in an existing directory.")
      return
    }
    var tsaClient: CPDFURLSessionTSAClient?
    if appendDocumentTimestamp {
      guard let url = timestampURL(options["timestamp_server_url"] as? String ?? "") else {
        fail("ltv_output_invalid", "A document timestamp requires an http/https TSA URL.")
        return
      }
      tsaClient = CPDFURLSessionTSAClient(url: url)
    }
    let prolongOptions = CPDFPadesProlongOptions()
    prolongOptions.trustedCertPath = trustedCertificatePath
    let ocspUrls = options["ocsp_urls"] as? [String] ?? []
    let crlUrls = options["crl_urls"] as? [String] ?? []
    prolongOptions.ocspURLs = ocspUrls.isEmpty ? nil : ocspUrls
    prolongOptions.crlURLs = crlUrls.isEmpty ? nil : crlUrls
    // The iOS default is YES; always set it so both platforms behave the same.
    prolongOptions.appendDocumentTimestamp = appendDocumentTimestamp
    prolongOptions.ltaTSAClient = tsaClient

    DispatchQueue.global(qos: .userInitiated).async {
      let prolongResult = CPDFPadesSigner().prolongLTV(
        fromPath: inputPath,
        ltvPath: outputPath,
        ltaPath: appendDocumentTimestamp ? ltaOutputPath : nil,
        options: prolongOptions)
      let success = prolongResult.success
      // A failed run can still echo the requested paths, so only report
      // paths for a successful run.
      let value: [String: Any] = [
        "success": success,
        "ltv_path": success ? prolongResult.ltvPath : "",
        "lta_path": success ? prolongResult.ltaPath : "",
        "errors": prolongResult.errors.map { Self.signatureIssueMap($0) },
        "warnings": prolongResult.warnings.map { Self.signatureIssueMap($0) },
      ]
      DispatchQueue.main.async {
        completion(.success(value))
      }
    }
  }
  private static func validationReport(
    for signature: CPDFSignature,
    document: CPDFDocument
  ) -> CPDFSignatureValidationReport? {
    let options = CPDFSignatureWorkflowValidationOptions()
    options.fieldName = signature.fieldName
    let validation = CPDFSignatureWorkflow(document: document).validateDocument(with: options)
    return validation.reports.first { $0.fieldName == signature.fieldName }
  }

  /// Mirrors Android `CPDFSignatureValidationReport.hasEmbeddedTimestamp()`.
  private static func hasValidEmbeddedTimestamp(_ report: CPDFSignatureValidationReport) -> Bool {
    return report.items.contains {
      $0.code.hasPrefix("timestamp.embedded.") && $0.status == .valid
    }
  }

  /// Matches the document-level LTV check used by the Android ComPDFKit_Tools demo.
  private static func documentLtvReady(_ document: CPDFDocument) -> Bool {
    let readiness = CPDFLtvService().assessReadiness(of: document)
    return readiness.success && readiness.readinessInfo.ltvReady
  }

  private static func ltvReadinessMap(_ readiness: CPDFLtvReadinessResult) -> [String: Any] {
    let info = readiness.readinessInfo
    let dssInfo = info.dssInfo
    return [
      "success": readiness.success,
      "has_dss": info.hasDSS,
      "has_vri": info.hasVRI,
      "has_certificates": info.hasCertificates,
      "has_revocation": info.hasRevocation,
      "ltv_ready": info.ltvReady,
      "profile_hint": info.profileHint,
      "missing_materials": info.missingMaterials.filter { !$0.isEmpty },
      "dss": [
        "certificates_count": dssInfo.certificatesCount,
        "ocsp_responses_count": dssInfo.ocspResponsesCount,
        "crls_count": dssInfo.crlsCount,
        "vri_entries_count": dssInfo.vriEntriesCount,
      ],
      "errors": readiness.errors.map { Self.signatureIssueMap($0) },
      "warnings": readiness.warnings.map { Self.signatureIssueMap($0) },
    ]
  }

  private static func signatureIssueMap(_ item: CPDFValidationReportItem) -> [String: Any] {
    return [
      "code": item.code,
      "message": item.message,
    ]
  }

  static func timestampURL(_ value: String) -> URL? {
    guard let url = URL(string: value),
      let scheme = url.scheme?.lowercased(),
      scheme == "http" || scheme == "https",
      url.host?.isEmpty == false
    else {
      return nil
    }
    return url
  }

  private static func isValidOutput(_ outputPath: String, inputPath: String) -> Bool {
    guard !outputPath.isEmpty else {
      return false
    }
    var isDirectory: ObjCBool = false
    let parent = (outputPath as NSString).deletingLastPathComponent
    return FileManager.default.fileExists(atPath: parent, isDirectory: &isDirectory)
      && isDirectory.boolValue
      && !Self.isSamePath(outputPath, inputPath)
  }

  private static func isSamePath(_ first: String, _ second: String) -> Bool {
    return URL(fileURLWithPath: first).standardizedFileURL.resolvingSymlinksInPath()
      == URL(fileURLWithPath: second).standardizedFileURL.resolvingSymlinksInPath()
  }

}
