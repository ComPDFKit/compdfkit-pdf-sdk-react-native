/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { DigitalSignatureController } from "./DigitalSignatureController";

/** React only subscribes and manages lifetime; document logic stays in the controller. */
export function useDigitalSignatureController() {
  const [controller] = useState(() => new DigitalSignatureController());
  const state = useSyncExternalStore(
    controller.subscribe,
    controller.getSnapshot
  );
  useEffect(() => {
    controller.initialize();
    return () => controller.dispose();
  }, [controller]);
  return { controller, state };
}
