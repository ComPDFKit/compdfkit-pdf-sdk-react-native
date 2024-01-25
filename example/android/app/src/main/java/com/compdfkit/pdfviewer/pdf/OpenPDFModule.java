/**
 * Copyright © 2014-2023 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.compdfkit.pdfviewer.pdf;

import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.compdfkit.tools.common.pdf.CPDFConfigurationUtils;
import com.compdfkit.tools.common.pdf.CPDFDocumentActivity;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkit.tools.common.utils.CFileUtils;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class OpenPDFModule extends ReactContextBaseJavaModule {

    private ReactContext mReactContext;

    public OpenPDFModule(ReactApplicationContext context) {
        super(context);
        this.mReactContext = context;
    }


    @NonNull
    @Override
    public String getName() {
        return "OpenPDFModule";
    }

    @ReactMethod
    public void openPDF(String configurationJson) {
        String samplePDFPath = CFileUtils.getAssetsTempFile(mReactContext, "PDF32000_2008.pdf","PDF32000_2008.pdf");
        CPDFConfiguration configuration = CPDFConfigurationUtils.fromJson(configurationJson);
        Intent intent = new Intent(mReactContext, CPDFDocumentActivity.class);
        intent.putExtra(CPDFDocumentActivity.EXTRA_CONFIGURATION, configuration);
        intent.putExtra(CPDFDocumentActivity.EXTRA_FILE_PATH, samplePDFPath);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mReactContext.startActivity(intent);
    }

    @ReactMethod
    public void openPDFByConfiguration(String filePath, String password, String configurationJson){
        Intent intent = new Intent(mReactContext, CPDFDocumentActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra(CPDFDocumentActivity.EXTRA_FILE_PATH, filePath);
        intent.putExtra(CPDFDocumentActivity.EXTRA_FILE_PASSWORD, password);
        CPDFConfiguration configuration = CPDFConfigurationUtils.fromJson(configurationJson);
        intent.putExtra(CPDFDocumentActivity.EXTRA_CONFIGURATION, configuration);
        mReactContext.startActivity(intent);
    }

    @ReactMethod
    public void openPDFByUri(String uriString, String password, String configurationJson){
        Intent intent = new Intent(mReactContext, CPDFDocumentActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.setData(Uri.parse(uriString));
        intent.putExtra(CPDFDocumentActivity.EXTRA_FILE_PASSWORD, password);
        CPDFConfiguration configuration = CPDFConfigurationUtils.fromJson(configurationJson);
        intent.putExtra(CPDFDocumentActivity.EXTRA_CONFIGURATION, configuration);
        mReactContext.startActivity(intent);
    }
}
