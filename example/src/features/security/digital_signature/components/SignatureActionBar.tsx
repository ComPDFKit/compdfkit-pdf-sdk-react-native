/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { type ReactNode } from "react";
import { View } from "react-native";
import { signatureStyles as s } from "./signatureStyles";

/** Separates fixed actions from scrolling content. Direct button children use flex: 1 for equal widths. */
export function SignatureActionBar({ children }: { children: ReactNode }) {
  return <View style={s.actionBar}>{children}</View>;
}
