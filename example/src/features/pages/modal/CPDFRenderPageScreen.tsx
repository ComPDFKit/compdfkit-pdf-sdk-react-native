/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import PDFReaderContext, {
  CPDFImageUtil,
  CPDFReaderView,
} from '@compdfkit_pdf_sdk/react_native';
import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface CPDFRenderPageScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const CPDFRenderPageScreen: React.FC<CPDFRenderPageScreenProps> = ({
  visible,
  onClose,
}) => {
  const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;
  const [renderPageIndex, setRenderPageIndex] = useState(0);
  const [lastRenderedIndex, setLastRenderedIndex] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [uri, setUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const fetchPageCount = async () => {
      if (!pdfReader) {
        setPageCount(0);
        return;
      }

      try {
        const count = await pdfReader._pdfDocument.getPageCount();
        setPageCount(count);
      } catch (error) {
        setPageCount(0);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to get page count.');
      }
    };

    setRenderPageIndex(0);
    setLastRenderedIndex(null);
    setUri(null);
    setErrorMessage(null);
    void fetchPageCount();
  }, [visible, pdfReader]);

  const renderNextPage = async () => {
    if (!pdfReader || pageCount === 0) {
      if (!pdfReader) {
        setErrorMessage('PDF reader is not ready yet.');
      }
      return;
    }

    try {
      setErrorMessage(null);

      const indexToRender = renderPageIndex;
      const base64 = await renderPage(indexToRender);

      if (!base64) {
        setErrorMessage('Render page returned an empty image.');
        return;
      }

      setUri(CPDFImageUtil.base64ToUri(base64));
      setLastRenderedIndex(indexToRender);
      setRenderPageIndex(prev => (prev + 1) % pageCount);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to render page.');
    }
  };

  const renderPage = async (pageIndex: number) => {
    const size = await pdfReader!._pdfDocument.getPageSize(pageIndex);
    return pdfReader!._pdfDocument.renderPage({
      pageIndex,
      width: size.width,
      height: size.height,
      pageCompression: 'png',
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.title}>Render Page to Image</Text>
              <Text style={styles.pageLabel}>
                Page: {(lastRenderedIndex !== null ? lastRenderedIndex : renderPageIndex) + 1}
              </Text>
              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}
              <Button
                title="Render Next Page"
                onPress={() => {
                  void renderNextPage();
                }}
              />
              {uri && (
                <View style={styles.previewContainer}>
                  <Image source={{ uri }} style={styles.previewImage} />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalView: {
    backgroundColor: 'white',
    height: '80%',
    justifyContent: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  pageLabel: {
    marginBottom: 16,
  },
  errorText: {
    marginBottom: 12,
    color: '#C62828',
  },
  previewContainer: {
    flex: 1,
    marginTop: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});