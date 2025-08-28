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
                  withEdges:(NSArray)edges
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

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
                  withPageIndex:(NSInteger)pageIndex
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCurrentPageIndex:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(hasChange:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setScale:(NSInteger)tag
                  withScaleValue:(nonnull NSNumber *) scale
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getScale:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setReadBackgroundColor:(NSInteger)tag
                  withThemes:(NSDictionary) themes
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setBackgroundColor: (NSInteger)tag
                  withBackgroundColor:(NSString *) backgroundColor
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getReadBackgroundColor:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setFormFieldHighlight:(NSInteger)tag
                  withFormFieldHighlight:(BOOL) formFieldHighlight
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isFormFieldHighlight:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setLinkHighlight:(NSInteger)tag
                  withLinkHighlight:(BOOL) linkHighlight
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isLinkHighlight:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setVerticalMode:(NSInteger)tag
                  withVerticalMode:(BOOL) isVerticalMode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isVerticalMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setContinueMode:(NSInteger)tag
                  withContiueMode:(BOOL) isContinueMode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isContinueMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setDoublePageMode:(NSInteger)tag
                  withDoublePageMode:(BOOL) isDoublePageMode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isDoublePageMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setCoverPageMode:(NSInteger)tag
                  withCoverPageMode:(BOOL) isCoverPageMode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isCoverPageMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setCropMode:(NSInteger)tag
                  withCropMode:(BOOL) isCropMode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isCropMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setPreviewMode:(NSInteger)tag
                  withViewMode:(NSString) viewMode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPreviewMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showThumbnailView:(NSInteger)tag
                  withEditMode:(BOOL) editMode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showBotaView:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showAddWatermarkView:(NSInteger)tag
                  withSaveAsNewFile: (BOOL) saveAsNewFile
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showSecurityView:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(showDisplaySettingView:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(enterSnipMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(exitSnipMode:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

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

RCT_EXTERN_METHOD(printDocument:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

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
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
                  

RCT_EXTERN_METHOD(setTextWidgetText:(NSInteger)tag
                  withPage:(NSInteger) page
                  withUuid:(NSString *) uuid
                  withText:(NSString *)text
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
                  

RCT_EXTERN_METHOD(addWidgetImageSignature:(NSInteger)tag
                  withPage:(NSInteger) page
                  withUuid:(NSString *) uuid
                  withImagePath:(NSURL *)imagePath
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(updateAp:(NSInteger)tag
                  withPage:(NSInteger) page
                  withUuid:(NSString *) uuid
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

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

// MARK: - Annotation Methods

RCT_EXTERN_METHOD(setAnnotationMode: (NSInteger)tag
                  withMode:(NSString *) mode
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAnnotationMode: (NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(annotationCanUndo:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(annotationCanRedo:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(annotationUndo:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(annotationRedo:(NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(searchText: (NSInteger)tag
                  withText:(NSString *) text
                  withSearchOption : (NSInteger) searchOption
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(selection: (NSInteger)tag
                  range:(NSDictionary)range
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearSearch: (NSInteger)tag
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getSearchText: (NSInteger)tag
                   withPageIndex: (NSInteger) pageIndex
                   withLocation: (NSInteger) location
                   withLength: (NSInteger) length
                   withResolver:(RCTPromiseResolveBlock)resolve
                   withRejecter:(RCTPromiseRejectBlock)reject)
                  
                  
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
