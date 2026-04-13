/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PDFReaderContext, {
  CPDFDisplayMode,
  CPDFReaderView,
  CPDFThemes,
} from '@compdfkit_pdf_sdk/react_native';

interface CPDFDisplaySettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const CPDFDisplaySettingsScreen: React.FC<
  CPDFDisplaySettingsScreenProps
> = ({ visible, onClose }) => {
  const [isVertical, setIsVertical] = useState(false);
  const [displayMode, setDisplayMode] = useState(CPDFDisplayMode.SINGLE_PAGE);
  const [isFormFieldHighlight, setIsFormFieldHighlight] = useState(false);
  const [isLinkHighlight, setIsLinkHighlight] = useState(false);
  const [isContinuousScrolling, setIsContinuousScrolling] = useState(false);
  const [isCrop, setIsCrop] = useState(false);
  const [themes, setThemes] = useState(CPDFThemes.LIGHT);
  const [isCanScale, setCanScale] = useState(true);

  const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

  useEffect(() => {
    const checkSettings = async () => {
      if (pdfReader) {
        const verticalMode = await pdfReader.isVerticalMode();
        setIsVertical(verticalMode);

        const isDoublePageMode = await pdfReader.isDoublePageMode();
        const isCoverPageMode = await pdfReader.isCoverPageMode();

        if (!isDoublePageMode) {
          setDisplayMode(CPDFDisplayMode.SINGLE_PAGE);
        } else {
          setDisplayMode(
            isCoverPageMode
              ? CPDFDisplayMode.COVER_PAGE
              : CPDFDisplayMode.DOUBLE_PAGE,
          );
        }

        setIsFormFieldHighlight(await pdfReader.isFormFieldHighlight());
        setIsLinkHighlight(await pdfReader.isLinkHighlight());
        setIsContinuousScrolling(await pdfReader.isContinueMode());
        setIsCrop(await pdfReader.isCropMode());
        setThemes(await pdfReader.getReadBackgroundColor());
      }
    };

    if (visible) {
      void checkSettings();
    }
  }, [visible, pdfReader]);

  const renderScrollItem = () => {
    return (
      <View>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>Scroll</Text>
        </View>

        {renderItem('Vertical Scrolling', isVertical, () => {
          void pdfReader?.setVerticalMode(true);
          setIsVertical(true);
        })}
        {renderItem('Horizontal Scrolling', !isVertical, () => {
          void pdfReader?.setVerticalMode(false);
          setIsVertical(false);
        })}
      </View>
    );
  };

  const renderDisplayMode = () => {
    return (
      <View>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>Display Mode</Text>
        </View>

        {renderItem('Single Page', displayMode === CPDFDisplayMode.SINGLE_PAGE, () => {
          void pdfReader?.setDoublePageMode(false);
          setDisplayMode(CPDFDisplayMode.SINGLE_PAGE);
        })}
        {renderItem('Two Page', displayMode === CPDFDisplayMode.DOUBLE_PAGE, () => {
          void pdfReader?.setDoublePageMode(true);
          setDisplayMode(CPDFDisplayMode.DOUBLE_PAGE);
        })}
        {renderItem('Cover Mode', displayMode === CPDFDisplayMode.COVER_PAGE, () => {
          void pdfReader?.setCoverPageMode(true);
          setDisplayMode(CPDFDisplayMode.COVER_PAGE);
        })}
      </View>
    );
  };

  const renderOtherSettings = () => {
    return (
      <View>
        <View style={styles.subTitleView} />
        {renderSwitchItem('Highlight Links', isLinkHighlight, value => {
          void pdfReader?.setLinkHighlight(value);
          setIsLinkHighlight(value);
        })}
        {renderSwitchItem('Highlight Form Fields', isFormFieldHighlight, value => {
          void pdfReader?.setFormFieldHighlight(value);
          setIsFormFieldHighlight(value);
        })}
        {renderSwitchItem('Continuous Scrolling', isContinuousScrolling, value => {
          void pdfReader?.setContinueMode(value);
          setIsContinuousScrolling(value);
        })}
        {renderSwitchItem('Crop', isCrop, value => {
          void pdfReader?.setCropMode(value);
          setIsCrop(value);
        })}

        {Platform.OS === 'android'
          ? renderSwitchItem('Can Scale', isCanScale, value => {
              void pdfReader?.setCanScale(value);
              setCanScale(value);
            })
          : null}
      </View>
    );
  };

  const renderThemes = () => {
    return (
      <View>
        <View style={styles.subTitleView}>
          <Text style={styles.subTitle}>Themes</Text>
        </View>

        {renderItem('Light', themes === CPDFThemes.LIGHT, () => {
          void pdfReader?.setReadBackgroundColor(CPDFThemes.LIGHT);
          setThemes(CPDFThemes.LIGHT);
        })}
        {renderItem('Dark', themes === CPDFThemes.DARK, () => {
          void pdfReader?.setReadBackgroundColor(CPDFThemes.DARK);
          setThemes(CPDFThemes.DARK);
        })}
        {renderItem('Sepia', themes === CPDFThemes.SEPIA, () => {
          void pdfReader?.setReadBackgroundColor(CPDFThemes.SEPIA);
          setThemes(CPDFThemes.SEPIA);
        })}
        {renderItem('Reseda', themes === CPDFThemes.RESEDA, () => {
          void pdfReader?.setReadBackgroundColor(CPDFThemes.RESEDA);
          setThemes(CPDFThemes.RESEDA);
        })}
      </View>
    );
  };

  const renderItem = (
    title: string,
    isChecked: boolean,
    onPress: () => void,
  ) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.item}>
          <Text style={isChecked ? styles.itemTextSelect : styles.itemTextNormal}>
            {title}
          </Text>
          {isChecked ? (
            <Image
              source={require('../../../../../assets/right.png')}
              style={styles.rightIcon}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSwitchItem = (
    title: string,
    isChecked: boolean,
    onValueChange: (value: boolean) => void,
  ) => {
    return (
      <TouchableOpacity>
        <View style={styles.item}>
          <Text style={styles.itemTextNormal}>{title}</Text>
          <Switch
            thumbColor={isChecked ? '#1460F3' : 'white'}
            trackColor={{ false: '#E0E0E0', true: '#1460F34D' }}
            value={isChecked}
            onValueChange={onValueChange}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.title}>Settings</Text>
              <ScrollView>
                {renderScrollItem()}
                {renderDisplayMode()}
                {renderOtherSettings()}
                {renderThemes()}
              </ScrollView>
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginStart: 16,
    marginBottom: 16,
    color: 'black',
  },
  subTitleView: {
    justifyContent: 'center',
    height: 32,
    marginHorizontal: 16,
    lineHeight: 32,
    fontWeight: 'bold',
    backgroundColor: '#DDE9FF',
    paddingStart: 8,
    borderRadius: 4,
  },
  subTitle: {
    fontSize: 14,
    textAlignVertical: 'center',
    alignContent: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  item: {
    height: 48,
    marginStart: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginEnd: 16,
  },
  itemTextNormal: {
    textAlignVertical: 'center',
    fontSize: 12,
    color: 'gray',
  },
  itemTextSelect: {
    textAlignVertical: 'center',
    color: 'black',
    fontSize: 12,
  },
  rightIcon: {
    width: 24,
    height: 24,
    marginStart: 8,
  },
});

export default CPDFDisplaySettingsScreen;