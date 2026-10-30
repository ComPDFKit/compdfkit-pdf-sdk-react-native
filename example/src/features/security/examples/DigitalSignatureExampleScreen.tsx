/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  ComPDFKit,
  CPDFReaderView,
  CPDFSignatureWidget,
  CPDFWidgetType,
} from "@compdfkit_pdf_sdk/react_native";
import { AppToolbar } from "../../../widgets/common/AppToolbar";
import { useDigitalSignatureController } from "../digital_signature/useDigitalSignatureController";
import { DigitalSignatureSheet } from "../digital_signature/components/DigitalSignatureSheet";
import { SignatureInfoDialog } from "../digital_signature/components/SignatureInfoDialog";
import { SignatureModalHost } from "../digital_signature/components/SignatureModalHost";

const configuration = ComPDFKit.getDefaultConfig({
  toolbarConfig: { mainToolbarVisible: true },
  readerViewConfig: { formFieldHighlight: true },
  formsConfig: {
    interceptFormWidgetActions: [CPDFWidgetType.SIGNATURES_FIELDS],
  },
});

/** Page composition only. See DigitalSignatureController and services for the reusable SDK flow. */
export default function DigitalSignatureExampleScreen() {
  const navigation = useNavigation();
  const { controller, state } = useDigitalSignatureController();
  const dialog = state.dialog;
  return (
    <SafeAreaView style={styles.page}>
      <AppToolbar
        title="Digital Signature"
        onBackPress={() => navigation.goBack()}
        rightAccessory={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open PDF"
            disabled={!!state.busy}
            onPress={() => controller.openPdf()}
            style={styles.open}
          >
            <Text style={styles.openText}>Open PDF</Text>
          </Pressable>
        }
      />
      <View style={styles.viewer}>
        {state.document ? (
          <CPDFReaderView
            key={state.generation}
            ref={controller.attachReader}
            document={`file://${state.document}`}
            configuration={configuration}
            onViewCreated={() => controller.readerReady(state.generation)}
            onIOSClickBackPressed={() => navigation.goBack()}
            onInterceptWidgetActionCallback={(widget) => {
              if (widget instanceof CPDFSignatureWidget)
                controller.handleField(widget);
            }}
          />
        ) : null}
        {state.busy && dialog.type === "none" ? (
          <View style={styles.busy}>
            <ActivityIndicator />
            <Text style={styles.text}>{state.busy}</Text>
          </View>
        ) : null}
        {dialog.type === "none" && (state.message || state.error) ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss message"
            onPress={controller.dismissMessage}
            style={[styles.message, state.error ? styles.error : null]}
          >
            <Text style={styles.text}>{state.error || state.message}</Text>
          </Pressable>
        ) : null}
      </View>
      {dialog.type !== "none" ? (
        <SignatureModalHost busy={state.busy} onClose={controller.closeDialog}>
          {dialog.type === "sign" ? (
            <DigitalSignatureSheet
              key={dialog.widget.uuid}
              fieldName={dialog.widget.title}
              controller={controller}
              busy={!!state.busy}
              error={state.error}
            />
          ) : (
            <SignatureInfoDialog
              details={dialog.details}
              busy={!!state.busy}
              error={state.error}
              onClose={controller.closeDialog}
              onTrust={
                controller.canTrust
                  ? () => controller.trustCertificate()
                  : undefined
              }
              onAddLtv={(append) => controller.addLtv(append)}
            />
          )}
        </SignatureModalHost>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },
  viewer: { flex: 1 },
  open: { padding: 12 },
  openText: { color: "#1460F3", fontSize: 14 },
  busy: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#00000066",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  message: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#EEF5FF",
    borderRadius: 8,
    padding: 16,
  },
  error: { backgroundColor: "#FFF1F0" },
  text: { color: "#1D2939", fontSize: 13 },
});
