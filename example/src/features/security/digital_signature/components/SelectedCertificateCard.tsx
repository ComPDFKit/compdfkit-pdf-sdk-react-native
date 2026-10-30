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
import type { CertificateSession } from "../models/CertificateSession";
import { signatureStyles as s } from "./signatureStyles";

/** Displays certificate metadata only; credentials are never rendered. */
export function SelectedCertificateCard({
  certificate,
}: {
  certificate: CertificateSession | null;
}) {
  return (
    <View style={s.panel}>
      <Text style={s.text}>
        {certificate?.info.subject || "No certificate selected"}
      </Text>
      {certificate ? (
        <>
          <Text style={s.label}>{certificate.path.split("/").pop()}</Text>
          <Text style={s.text}>
            Valid to: {certificate.info.validTo ?? "Unavailable"}
          </Text>
        </>
      ) : null}
    </View>
  );
}
