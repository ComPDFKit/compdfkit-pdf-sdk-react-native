//  Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CPDFViewManager, NSObject)

RCT_EXTERN_METHOD(save:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setMargins:(NSInteger)tag
                  withEdges:[Int]edges)

RCT_EXTERN_METHOD(removeAllAnnotations:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(importAnnotations:(NSInteger)tag
                  withXfdfFile:(NSURL *)xfdfFile
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(exportAnnotations:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setDisplayPageIndex:(NSInteger)tag
                  withPageIndex:(NSInteger)pageIndex)

RCT_EXTERN_METHOD(getCurrentPageIndex:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(hasChange:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setScale:(NSInteger)tag
                  withScaleValue:(nonnull NSNumber *) scale)

RCT_EXTERN_METHOD(getScale:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setReadBackgroundColor:(NSInteger)tag
                  withThemes:(NSDictionary) themes)

RCT_EXTERN_METHOD(getReadBackgroundColor:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setFormFieldHighlight:(NSInteger)tag
                  withFormFieldHighlight:(BOOL) formFieldHighlight)

RCT_EXTERN_METHOD(isFormFieldHighlight:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setLinkHighlight:(NSInteger)tag
                  withLinkHighlight:(BOOL) linkHighlight)

RCT_EXTERN_METHOD(isLinkHighlight:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setVerticalMode:(NSInteger)tag
                  withVerticalMode:(BOOL) isVerticalMode)

RCT_EXTERN_METHOD(isVerticalMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setContinueMode:(NSInteger)tag
                  withContiueMode:(BOOL) isContinueMode)

RCT_EXTERN_METHOD(isContinueMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setDoublePageMode:(NSInteger)tag
                  withDoublePageMode:(BOOL) isDoublePageMode)

RCT_EXTERN_METHOD(isDoublePageMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setCoverPageMode:(NSInteger)tag
                  withCoverPageMode:(BOOL) isCoverPageMode)

RCT_EXTERN_METHOD(isCoverPageMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setCropMode:(NSInteger)tag
                  withCropMode:(BOOL) isCropMode)

RCT_EXTERN_METHOD(isCropMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setPreviewMode:(NSInteger *)tag
                  withViewMode:(NSString) viewMode)

RCT_EXTERN_METHOD(getPreviewMode:(NSInteger *)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showThumbnailView:(NSInteger *)tag
                  withEditMode:(BOOL) editMode)

RCT_EXTERN_METHOD(showBotaView:(NSInteger *)tag)

RCT_EXTERN_METHOD(showAddWatermarkView:(NSInteger *)tag
                  withSaveAsNewFile: (BOOL) saveAsNewFile)

RCT_EXTERN_METHOD(showSecurityView:(NSInteger *)tag)

RCT_EXTERN_METHOD(showDisplaySettingView:(NSInteger *)tag)

RCT_EXTERN_METHOD(enterSnipMode:(NSInteger *)tag)

RCT_EXTERN_METHOD(exitSnipMode:(NSInteger *)tag)

RCT_EXTERN_METHOD(open:(NSInteger *)tag
                  withDocument:(NSURL *) document
                  withPassword:(NSString *) password
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(getFileName:(NSInteger *) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isEncrypted:(NSInteger *) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isImageDoc:(NSInteger *) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPermissions:(NSInteger *) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPageCount:(NSInteger *) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkOwnerUnlocked:(NSInteger *) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkOwnerPassword:(NSInteger *) tag
                  withPassword:(NSString *) password
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removePassword:(NSInteger *) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setPassword:(NSInteger *) tag
                  withInfo:(NSDictionary) info
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getEncryptAlgo:(NSInteger *) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

//----------------------
//v2.3.0-beta.1
RCT_EXTERN_METHOD(printDocument:(NSInteger *)tag)

RCT_EXTERN_METHOD(importWidgets:(NSInteger)tag
                  withXfdfFile:(NSURL *)xfdfFile
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(exportWidgets:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDocumentPath:(NSInteger *)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                    withRejecter:(RCTPromiseRejectBlock)reject)
//------------------------
// v2.3.0 release
// 扁平化文档
// info 参数：
// save_path : 保存路径
// font_sub_set: 保存是否包含字体集
RCT_EXTERN_METHOD(flattenAllPages:(NSInteger)tag
                  withInfo:(NSDictionary) info
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)




+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
