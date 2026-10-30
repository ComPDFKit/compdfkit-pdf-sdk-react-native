//
//  ComPDFKitRN+Certificates.swift
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import ComPDFKit

/// PKCS#12 certificate APIs. They belong to the `ComPDFKit` module, matching Android `RnPdfModule`,
/// because JavaScript calls them on `NativeModules.ComPDFKit`.
extension ComPDFKit {
  @objc(generatePkcs12Certificate: withResolver: withRejecter:)
  func generatePkcs12Certificate(_ request: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    guard let subject = request["subject"] as? [String: String], let password = request["password"] as? String, let path = request["output_path"] as? String else { reject("INVALID_CERTIFICATE_REQUEST", "Certificate request is incomplete", nil); return }
    var info: [String: String] = [:]
    [("country", "C"), ("state", "ST"), ("locality", "L"), ("organization", "O"), ("organizational_unit", "OU"), ("common_name", "CN"), ("email", "emailAddress")].forEach { if let value = subject[$0.0], !value.isEmpty { info[$0.1] = value } }
    let usage = (request["usage"] as? NSNumber)?.intValue ?? 1
    resolve(CPDFSignature.generatePKCS12Cert(withInfo: info, password: password, toPath: path, certUsage: CPDFCertUsage(rawValue: usage) ?? .digSig))
  }
  @objc(checkPkcs12CertificatePassword: withPassword: withResolver: withRejecter:)
  func checkPkcs12CertificatePassword(_ path: String, password: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) { resolve(CPDFSignatureCertificate(pkcs12Path: path, password: password) != nil) }
  @objc(loadPkcs12Certificate: withPassword: withResolver: withRejecter:)
  func loadPkcs12Certificate(_ path: String, password: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) { guard let cert = CPDFSignatureCertificate(pkcs12Path: path, password: password) else { resolve(nil); return }; cert.checkIsTrusted(); let f = ISO8601DateFormatter(); resolve(["version": cert.version, "serial_number": cert.serialNumber, "key_type": "", "signature_algorithm": cert.signatureAlgorithmOID, "issuer": cert.issuer, "subject": cert.subject, "valid_from": f.string(from: cert.validityStarts), "valid_to": f.string(from: cert.validityEnds), "sha1_digest": cert.sha1Digest, "md5_digest": cert.md5Digest, "is_trusted": cert.isTrusted, "is_expired": Date() < cert.validityStarts || Date() > cert.validityEnds]) }
  @objc(configureTrustedCertificateDirectories: withResolver: withRejecter:)
  func configureTrustedCertificateDirectories(_ options: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) { reject("UNSUPPORTED_CERTIFICATE_DIRECTORY_CONFIGURATION", "iOS manages certificate directories inside the application sandbox", nil) }
  @objc(addTrustedCertificate: withPassword: withResolver: withRejecter:)
  func addTrustedCertificate(_ path: String, password: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) { resolve(CPDFSignatureCertificate(pkcs12Path: path, password: password)?.addToTrustedCertificates() ?? false) }
}
