package com.compdfkit.pdfviewer.pdf;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.compdfkit.core.document.CPDFSdk;
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
        Intent intent = new Intent(mReactContext, CPDFDocumentActivity.class);
        CPDFConfiguration configuration = CPDFConfigurationUtils.fromJson(configurationJson);
        intent.putExtra(CPDFDocumentActivity.EXTRA_CONFIGURATION, configuration);
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
}
