/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { type ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { signatureStyles as s } from "./signatureStyles";

/** One native modal hosts all signature dialogs; avoids overlapping iOS modal presentations. */
export function SignatureModalHost({
  children,
  busy,
  onClose,
}: {
  children: ReactNode;
  busy: string | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      {/* Modal windows do not always inherit native safe-area padding from the screen below. */}
      <View
        style={[
          s.backdrop,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={s.keyboard}
        >
          {children}
        </KeyboardAvoidingView>
        {busy ? (
          <View style={s.busyOverlay}>
            <View style={s.dialog}>
              <ActivityIndicator />
              <Text style={s.text}>{busy}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}
