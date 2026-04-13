/*
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 *
 */

package com.compdfkitpdf.reactnative.util;

import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.CPDFDocumentPermissionInfo;
import com.compdfkit.core.document.CPDFInfo;
import com.compdfkit.tools.common.utils.date.CDateUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.Map;

public class CPDFDocumentInfoUtil {

  public static WritableMap getDocumentInfo(CPDFDocument document){
    WritableMap documentInfo = Arguments.createMap();
    CPDFInfo info = document.getInfo();
    try {
      documentInfo.putString("title", info.getTitle());
      documentInfo.putString("author", info.getAuthor());
      documentInfo.putString("subject", info.getSubject());
      documentInfo.putString("keywords", info.getKeywords());
      documentInfo.putString("creator", info.getCreator());
      documentInfo.putString("producer", info.getProducer());
      long createDateTimes = CAppUtils.toTimes(CDateUtil.transformPDFDate(info.getCreationDate()));
      if (createDateTimes != 0L){
        CAppUtils.putLongCompat(documentInfo, "creationDate", createDateTimes);
      }
      long modificationDateTimes = CAppUtils.toTimes(CDateUtil.transformPDFDate(info.getModificationDate()));
      if (modificationDateTimes != 0L){
        CAppUtils.putLongCompat(documentInfo, "modificationDate", modificationDateTimes);
      }
      return documentInfo;
    } catch (Exception e) {
      return documentInfo;
    }
  }

  public static WritableMap getPermissionsInfo(CPDFDocument document) {
    WritableMap map = Arguments.createMap();
    try {
      CPDFDocumentPermissionInfo permissionInfo = document.getPermissionsInfo();
      map.putBoolean("allowsPrinting", permissionInfo.isAllowsPrinting());
      map.putBoolean("allowsHighQualityPrinting", permissionInfo.isAllowsHighQualityPrinting());
      map.putBoolean("allowsCopying", permissionInfo.isAllowsCopying());
      map.putBoolean("allowsDocumentChanges", permissionInfo.isAllowsDocumentChanges());
      map.putBoolean("allowsDocumentAssembly", permissionInfo.isAllowsDocumentAssembly());
      map.putBoolean("allowsCommenting", permissionInfo.isAllowsCommenting());
      map.putBoolean("allowsFormFieldEntry", permissionInfo.isAllowsFormFieldEntry());
      return map;
    } catch (Exception e) {
      return map;
    }
  }
}
