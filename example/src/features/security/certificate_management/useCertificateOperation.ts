/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/** Serializes native work and ignores completion after a child page has been dismissed. */
export function useCertificateOperation() {
  const mounted = useRef(true);
  const running = useRef(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(
    async (action: () => Promise<void>, onError: (error: unknown) => void) => {
      if (running.current || !mounted.current) return;
      running.current = true;
      setBusy(true);
      try {
        await action();
      } catch (error) {
        if (mounted.current) onError(error);
      } finally {
        running.current = false;
        if (mounted.current) setBusy(false);
      }
    },
    [],
  );

  return { busy, run, isMounted: () => mounted.current };
}
