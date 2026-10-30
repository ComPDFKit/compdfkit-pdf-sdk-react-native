//
//  RCTCPDFView+DigitalSignature.swift
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
import ComPDFKit_Tools
import UIKit

/// Digital signature bridge operations, separated from page and annotation editing.
extension RCTCPDFView {
  func getDigitalSignatures(completionHandler: @escaping ([[String: Any]]) -> Void) {
    guard let document = pdfViewController?.pdfListView?.document else {
      completionHandler([])
      return
    }
    let values = (document.signatures() ?? []).enumerated().map {
      index, signature -> [String: Any] in
      // Updates CPDFSigner.isSignVerified, which the signer map below reads.
      signature.verifySignature(with: document)
      return digitalSignatureMap(signature, document: document, signatureIndex: index)
    }
    completionHandler(values)
  }

  private func digitalSignatureMap(
    _ signature: CPDFSignature, document: CPDFDocument, signatureIndex: Int
  ) -> [String: Any] {
    let bounds = signature.bounds
    return [
      "signature_index": signatureIndex,
      "field_name": signature.fieldName ?? "",
      "page_index": Int(signature.pageIndex(with: document)),
      "bounds": [
        "left": bounds.minX, "top": bounds.maxY, "right": bounds.maxX, "bottom": bounds.minY,
      ],
      "name": signature.name ?? "",
      "date": signature.date.map { ISO8601DateFormatter().string(from: $0) } ?? "",
      "reason": signature.reason ?? "",
      "location": signature.location ?? "",
      "filter": signature.filter ?? "",
      "sub_filter": signature.subFilter ?? "",
      "permissions": max(1, min(3, signature.permissions)),
      "signers": (signature.signers ?? []).map { signer -> [String: Any] in
        [
          "signature_verified": signer.isSignVerified,
          "certificate_trusted": signer.isCertTrusted,
          "certificates": signer.certificates.map { digitalCertificateMap($0) },
        ]
      },
      "modifications": (signature.modifyInfos ?? []).map { info -> [String: Any] in
        [
          "type": String(info.type.rawValue),
          "page_index": info.pageIndex ?? -1,
          "annotation_type": info.annotationType ?? -1,
          "form_type": info.formType ?? -1,
          "info": info.info ?? "",
        ]
      },
    ]
  }

  private func digitalCertificateMap(_ certificate: CPDFSignatureCertificate) -> [String: Any] {
    let now = Date()
    return [
      "version": certificate.version ?? "",
      "serial_number": certificate.serialNumber ?? "",
      // The iOS SDK exposes the signature algorithm, not the public-key type Android reports.
      "key_type": "",
      "signature_algorithm": certificate.signatureAlgorithmOID ?? "",
      "issuer": certificate.issuer ?? "",
      "subject": certificate.subject ?? "",
      "valid_from": ISO8601DateFormatter().string(from: certificate.validityStarts),
      "valid_to": ISO8601DateFormatter().string(from: certificate.validityEnds),
      "sha1_digest": certificate.sha1Digest ?? "",
      "md5_digest": certificate.md5Digest ?? "",
      "is_trusted": certificate.isTrusted,
      "is_expired": now < certificate.validityStarts || now > certificate.validityEnds,
    ]
  }

  func verifyDigitalSignature(index: Int, completionHandler: @escaping ([String: Any]?) -> Void) {
    guard let document = pdfViewController?.pdfListView?.document,
      let signatures = document.signatures(), index >= 0, index < signatures.count
    else {
      completionHandler(nil)
      return
    }
    DispatchQueue.global(qos: .userInitiated).async {
      let signature = signatures[index]
      signature.verifySignature(with: document)
      let signers = signature.signers ?? []
      var certs: [CPDFSignatureCertificate] = []
      for signer in signers { certs.append(contentsOf: signer.certificates) }
      let readiness = RnSignatureLtvService.readiness(document)
      let ltvEnabled: Any =
        readiness["success"] as? Bool == true ? (readiness["ltv_ready"] ?? NSNull()) : NSNull()
      let value: [String: Any] = [
        "signature_valid": signature.verifySignature(document),
        "document_unmodified": signature.verifyDocument(document),
        "certificate_trusted": signers.contains { $0.isCertTrusted },
        "certificate_expired": certs.contains {
          Date() < $0.validityStarts || Date() > $0.validityEnds
        }, "timestamp_trusted": signature.verifyTimestampAuthority(),
        "timestamp_source": signature.timestampSource.rawValue,
        "embedded_timestamp_valid":
          (RnSignatureLtvService.embeddedTimestampValid(signature, document: document) as Any?)
          ?? NSNull(),
        "ltv_enabled": ltvEnabled,
      ]
      DispatchQueue.main.async { completionHandler(value) }
    }
  }

  /// Signs a signature field and writes the signed copy. Failures carry the same error codes as
  /// Android in the NSError domain: `invalid_document`, `signature_widget_not_found`,
  /// `invalid_signature_config`, `certificate_not_found`, `invalid_certificate_password`,
  /// `invalid_output_path`, and `signature_write_failed`.
  func writeSignature(
    pageIndex: Int, uuid: String, outputPath: String, config: [String: Any],
    completionHandler: @escaping (Result<Bool, Error>) -> Void
  ) {
    func fail(_ code: String, _ message: String) {
      completionHandler(
        .failure(NSError(domain: code, code: 0, userInfo: [NSLocalizedDescriptionKey: message])))
    }
    guard let document = pdfViewController?.pdfListView?.document,
      let sourceURL = document.documentURL
    else {
      fail("invalid_document", "The document is released or invalid.")
      return
    }
    guard let page = document.page(at: UInt(pageIndex)),
      let widget = page.annotations.compactMap({ $0 as? CPDFSignatureWidgetAnnotation })
        .first(where: { CPDFUtil.getMemoryAddress($0) == uuid })
    else {
      fail("signature_widget_not_found", "The signature form field could not be found.")
      return
    }
    guard let certificatePath = config["certificate_path"] as? String,
      let password = config["password"] as? String
    else {
      fail(
        "invalid_signature_config", "The signature config requires certificate_path and password.")
      return
    }
    guard FileManager.default.fileExists(atPath: certificatePath) else {
      fail("certificate_not_found", "The certificate file does not exist.")
      return
    }
    guard CPDFSignatureCertificate(pkcs12Path: certificatePath, password: password) != nil else {
      fail("invalid_certificate_password", "The certificate password is invalid.")
      return
    }
    let outputURL = URL(fileURLWithPath: outputPath)
    var isDirectory: ObjCBool = false
    let parent = outputURL.deletingLastPathComponent().path
    guard !outputPath.isEmpty,
      FileManager.default.fileExists(atPath: parent, isDirectory: &isDirectory),
      isDirectory.boolValue,
      FileManager.default.isWritableFile(atPath: parent),
      outputURL.standardizedFileURL.resolvingSymlinksInPath()
        != sourceURL.standardizedFileURL.resolvingSymlinksInPath()
    else {
      fail(
        "invalid_output_path",
        "The signed PDF must be written to a new file in a writable directory.")
      return
    }

    guard !widget.isSigned() else {
      fail("signature_already_signed", "The signature field is already signed.")
      return
    }
    var tsaClient: CPDFURLSessionTSAClient?
    if let tsa = config["timestamp_server_url"] as? String {
      guard let url = RnSignatureLtvService.timestampURL(tsa) else {
        fail("signature_timestamp_failed", "The timestamp server URL is invalid.")
        return
      }
      tsaClient = CPDFURLSessionTSAClient(url: url)
    }
    let appearance = config["appearance"] as? [String: Any] ?? [:]
    let signatureConfig = CPDFSignatureConfig()
    signatureConfig.isDrawKey = true
    let appearanceText = appearance["text"] as? String ?? ""
    signatureConfig.text =
      appearanceText.isEmpty ? (config["name"] as? String ?? "") : appearanceText
    signatureConfig.isDrawLogo = appearance["draw_logo"] as? Bool ?? true
    signatureConfig.isDrawOnlyContent = appearance["draw_only_content"] as? Bool ?? false
    signatureConfig.isContentAlginLeft = appearance["content_align_left"] as? Bool ?? true
    signatureConfig.textColor = ColorHelper.colorWithHexString(
      hex: appearance["text_color"] as? String ?? "#FF000000")
    signatureConfig.contentsColor = ColorHelper.colorWithHexString(
      hex: appearance["content_color"] as? String ?? "#FF000000")
    if let content = appearance["content"] as? String, !content.isEmpty {
      signatureConfig.contents = content.components(separatedBy: .newlines).filter { !$0.isEmpty }
        .map { line in
          let item = CPDFSignatureConfigItem()
          let parts = line.split(separator: ":", maxSplits: 1, omittingEmptySubsequences: false)
          item.key = parts.count == 2 ? String(parts[0]).trimmingCharacters(in: .whitespaces) : ""
          item.value =
            parts.count == 2 ? String(parts[1]).trimmingCharacters(in: .whitespaces) : line
          return item
        }
    }
    if let imagePath = appearance["image_path"] as? String, !imagePath.isEmpty {
      guard let image = UIImage(contentsOfFile: imagePath) else {
        fail("invalid_signature_config", "The signature appearance image is invalid.")
        return
      }
      signatureConfig.image = image
    }
    if let logoPath = appearance["logo_path"] as? String, !logoPath.isEmpty {
      guard let logo = UIImage(contentsOfFile: logoPath) else {
        fail("invalid_signature_config", "The signature logo image is invalid.")
        return
      }
      signatureConfig.logo = logo
    }
    widget.signAppearanceConfig(signatureConfig)
    let permission =
      CPDFSignaturePermissions(rawValue: max(1, min(3, (config["permissions"] as? Int) ?? 2)))
      ?? .fillSign
    let location = config["location"] as? String ?? ""
    let reason = config["reason"] as? String ?? ""

    DispatchQueue.global(qos: .userInitiated).async {
      let ok = document.writeSignature(
        to: outputURL, withWidget: widget, pkcs12Cert: certificatePath, password: password,
        location: location, reason: reason, isSetSignAp: false, permissions: permission,
        tsaClient: tsaClient)
      DispatchQueue.main.async {
        if ok {
          completionHandler(.success(true))
        } else {
          completionHandler(
            .failure(
              NSError(
                domain: tsaClient == nil ? "signature_write_failed" : "signature_timestamp_failed",
                code: 0,
                userInfo: [NSLocalizedDescriptionKey: "The digital signature could not be written."]
              )))
        }
      }
    }
  }

  /// Inspects evidence off the UI thread and resolves on the main queue.
  func getLtvReadiness(completion: @escaping ([String: Any]?) -> Void) {
    guard let document = pdfViewController?.pdfListView?.document else {
      completion(nil)
      return
    }
    DispatchQueue.global(qos: .userInitiated).async {
      let value = RnSignatureLtvService.readiness(document)
      DispatchQueue.main.async { completion(value) }
    }
  }

  func addSignatureLtv(
    path: String, options: [String: Any],
    completion: @escaping (Result<[String: Any], Error>) -> Void
  ) {
    guard let document = pdfViewController?.pdfListView?.document else {
      completion(
        .failure(
          NSError(
            domain: "invalid_document", code: 0,
            userInfo: [NSLocalizedDescriptionKey: "The document is unavailable."])))
      return
    }
    RnSignatureLtvService.add(
      document: document, outputPath: path, options: options, completion: completion)
  }
}
