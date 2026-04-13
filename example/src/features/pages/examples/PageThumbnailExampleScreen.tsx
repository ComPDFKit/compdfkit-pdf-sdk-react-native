/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';

import { CPDFRenderPageScreen } from '../modal/CPDFRenderPageScreen';
import { PageExampleScaffold } from '../shared/PageExampleScaffold';

export default function PageThumbnailExampleScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <PageExampleScaffold
      title="Page Thumbnails"
      subtitle="Render PDF pages into image previews and inspect them page by page."
      actions={[
        {
          key: 'open-render-preview',
          label: 'Open Render Preview',
          onPress: async () => {
            setVisible(true);
          },
        },
      ]}>
      {visible ? (
        <CPDFRenderPageScreen
          visible={visible}
          onClose={() => setVisible(false)}
        />
      ) : null}
    </PageExampleScaffold>
  );
}