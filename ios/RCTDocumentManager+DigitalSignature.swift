//
//  RCTDocumentManager+DigitalSignature.swift
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

/// Routes signature calls to the reader; implementation lives in dedicated signature services.
extension RCTDocumentManager {
  @objc(getDigitalSignatures:withResolver:withRejecter:)
  func getDigitalSignatures(
    forCPDFViewTag tag: Int, resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { withCPDFView(tag: tag, reject: reject) { $0.getDigitalSignatures { resolve($0) } } }
  @objc(verifyDigitalSignature:withIndex:withResolver:withRejecter:)
  func verifyDigitalSignature(
    forCPDFViewTag tag: Int, index: Int, resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) {
      $0.verifyDigitalSignature(index: index) { value in
        if let value {
          resolve(value)
        } else {
          reject("signature_verification_failed", "The digital signature could not be found.", nil)
        }
      }
    }
  }
  @objc(writeSignature:withPageIndex:withUuid:withOutputPath:withConfig:withResolver:withRejecter:)
  func writeSignature(
    forCPDFViewTag tag: Int, pageIndex: Int, uuid: String, outputPath: String, config: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) {
      $0.writeSignature(
        pageIndex: pageIndex, uuid: uuid, outputPath: outputPath,
        config: config as? [String: Any] ?? [:]
      ) { result in
        switch result {
        case .success(let value): resolve(value)
        case .failure(let error):
          let nsError = error as NSError
          reject(nsError.domain, nsError.localizedDescription, nil)
        }
      }
    }
  }

  @objc(getLtvReadiness:withResolver:withRejecter:)
  func getLtvReadiness(
    tag: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getLtvReadiness { value in
        if let value {
          resolve(value)
        } else {
          reject("invalid_document", "The document is unavailable.", nil)
        }
      }
    }
  }

  @objc(addSignatureLtv:withOutputPath:withOptions:withResolver:withRejecter:)
  func addSignatureLtv(
    tag: Int, path: String, options: NSDictionary, resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.addSignatureLtv(path: path, options: options as? [String: Any] ?? [:]) { result in
        switch result {
        case .success(let value): resolve(value)
        case .failure(let error):
          let failure = error as NSError
          reject(failure.domain, failure.localizedDescription, nil)
        }
      }
    }
  }
}
