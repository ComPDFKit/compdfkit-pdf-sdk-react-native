/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from "react";
import { Text, View } from "react-native";
import { signatureStyles as s } from "./signatureStyles";

/** Information preview, matching Flutter; this is not a pixel rendering of the native appearance. */
export function SignaturePreview({
  name,
  reason,
  location,
}: {
  name: string;
  reason: string;
  location: string;
}) {
  return (
    <View style={s.preview}>
      <Text style={s.text}>Signature preview</Text>
      <Text style={s.text}>Name: {name}</Text>
      <Text style={s.text}>Reason: {reason}</Text>
      <Text style={s.text}>Location: {location}</Text>
    </View>
  );
}
