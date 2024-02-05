//
//  OpenPDFModuleBridge.m
//  ComPDFKit_RN
//
//  Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "OpenPDFModuleBridge.h"
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(OpenPDFModule, NSObject)

RCT_EXTERN_METHOD(openPDF:(NSString *) configurationJson)

RCT_EXTERN_METHOD(openPDFByConfiguration:(NSURL *)filePath password:(NSString *)password configurationJson:(NSString *)configurationJson)

RCT_EXTERN_METHOD(init_:(NSString *)license)

RCT_EXTERN_METHOD(initialize:(NSString *)androidOnlineLicense iosOnlineLicense:(NSString *)iosOnlineLicense)

@end

@implementation OpenPDFModuleBridge

@end
