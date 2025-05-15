//  Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CPDFViewManager, NSObject)

// MARK: - Document Methods

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

RCT_EXTERN_METHOD(setPreviewMode:(NSInteger)tag
                  withViewMode:(NSString) viewMode)

RCT_EXTERN_METHOD(getPreviewMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showThumbnailView:(NSInteger)tag
                  withEditMode:(BOOL) editMode)

RCT_EXTERN_METHOD(showBotaView:(NSInteger)tag)

RCT_EXTERN_METHOD(showAddWatermarkView:(NSInteger)tag
                  withSaveAsNewFile: (BOOL) saveAsNewFile)

RCT_EXTERN_METHOD(showSecurityView:(NSInteger)tag)

RCT_EXTERN_METHOD(showDisplaySettingView:(NSInteger)tag)

RCT_EXTERN_METHOD(enterSnipMode:(NSInteger)tag)

RCT_EXTERN_METHOD(exitSnipMode:(NSInteger)tag)

RCT_EXTERN_METHOD(open:(NSInteger)tag
                  withDocument:(NSURL *) document
                  withPassword:(NSString *) password
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(getFileName:(NSInteger) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isEncrypted:(NSInteger) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isImageDoc:(NSInteger) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPermissions:(NSInteger) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPageCount:(NSInteger) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkOwnerUnlocked:(NSInteger) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(checkOwnerPassword:(NSInteger) tag
                  withPassword:(NSString *) password
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removePassword:(NSInteger) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setPassword:(NSInteger) tag
                  withInfo:(NSDictionary) info
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getEncryptAlgo:(NSInteger) tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(printDocument:(NSInteger)tag)

RCT_EXTERN_METHOD(importWidgets:(NSInteger)tag
                  withXfdfFile:(NSURL *)xfdfFile
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(exportWidgets:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDocumentPath:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                    withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(flattenAllPages:(NSInteger)tag
                  withSavePath:(NSURL *) savePath
                  withFontSubset:(BOOL) fontSubset
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(saveAs:(NSInteger)tag
                  withSavePath:(NSURL *) savePath
                  withRemoveSecurity:(BOOL) removeSecurity
                  withFontSubset:(BOOL) fontSubset
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(importDocument:(NSInteger)tag
                  withFilePath:(NSURL *) filePath
                  withInfo:(NSDictionary) info
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(splitDocumentPages:(NSInteger)tag
                  withSavePath:(NSURL *) savePath
                  withPages:(NSArray *) pages
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(insertBlankPage:(NSInteger)tag
                  withPageIndex:(NSInteger) pageIndex
                  withPageWidth:(nonnull NSNumber *) pageWidth
                  withPageHeight:(nonnull NSNumber *) pageHeight
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

// MARK: - Pages Methods

RCT_EXTERN_METHOD(getAnnotations:(NSInteger)tag
                  withPageIndex:(NSInteger) pageIndex
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getForms:(NSInteger)tag
                  withPageIndex:(NSInteger) pageIndex
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setWidgetIsChecked:(NSInteger)tag
                  withPage:(NSInteger) page
                  withUuid:(NSString *) uuid
                  withIsChecked:(BOOL)isChecked
                  )

RCT_EXTERN_METHOD(setTextWidgetText:(NSInteger)tag
                  withPage:(NSInteger) page
                  withUuid:(NSString *) uuid
                  withText:(NSString *)text
                  )

RCT_EXTERN_METHOD(addWidgetImageSignature:(NSInteger)tag
                  withPage:(NSInteger) page
                  withUuid:(NSString *) uuid
                  withImagePath:(NSURL *)imagePath
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(updateAp:(NSInteger)tag
                  withPage:(NSInteger) page
                  withUuid:(NSString *) uuid
                  )

RCT_EXTERN_METHOD(reloadPages:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeAnnotation:(NSInteger)tag
                  withPageIndex:(NSInteger) pageIndex
                  withAnnotId:(NSString *) uuid
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeWidget:(NSInteger)tag
                  withPageIndex:(NSInteger) pageIndex
                  withWidgetId:(NSString *) uuid
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
                  
                  

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
