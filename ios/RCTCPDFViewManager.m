//
//  RCTCPDFViewManager.m
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RCTCPDFReaderView, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(configuration, NSString);

RCT_EXPORT_VIEW_PROPERTY(document, NSURL);

RCT_EXPORT_VIEW_PROPERTY(password, NSString);

RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)

@end
