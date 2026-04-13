/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';

import { useAppTheme } from '../../../theme/appTheme';
import AnnotationsTab from './AnnotationsTab';
import BookmarksTab from './BookmarksTab';
import OutlineTab from './OutlineTab';
import ThumbnailsTab from './ThumbnailsTab';

type TabKey = 'bookmark' | 'outline' | 'thumbnail' | 'annotations';

type CPDFBotaScreenProps = {
  visible: boolean;
  onClose: () => void;
  initialTab?: TabKey;
};

const TAB_CONFIG: ReadonlyArray<{
  key: TabKey;
  label: string;
}> = [
  {
    key: 'bookmark',
    label: 'Bookmarks',
  },
  {
    key: 'outline',
    label: 'Outline',
  },
  {
    key: 'thumbnail',
    label: 'Thumbnails',
  },
  {
    key: 'annotations',
    label: 'Annotations',
  },
];

export const CPDFBotaScreen = ({
  visible,
  onClose,
  initialTab = 'outline',
}: CPDFBotaScreenProps) => {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const activeTabConfig = TAB_CONFIG.find(tab => tab.key === activeTab) || {
    key: 'outline' as const,
    label: 'Outline',
  };

  React.useEffect(() => {
    if (visible) {
      setActiveTab(initialTab);
    }
  }, [initialTab, visible]);

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.82}
        onPress={onClose}
        style={styles.iconButton}>
        <Image
          source={require('../../../../assets/ic_syasarrow_left.png')}
          style={styles.navIcon}
        />
      </TouchableOpacity>

      <Text numberOfLines={1} style={styles.toolbarTitle}>
        {activeTabConfig.label}
      </Text>

      <View style={styles.iconPlaceholder} />
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {TAB_CONFIG.map(tab => (
        <TabButton
          key={tab.key}
          title={tab.label}
          active={activeTab === tab.key}
          onPress={() => setActiveTab(tab.key)}
          styles={styles}
        />
      ))}
    </View>
  );

  const renderBody = () => {
    switch (activeTab) {
      case 'outline':
        return <OutlineTab onClose={onClose} />;
      case 'bookmark':
        return <BookmarksTab onClose={onClose} />;
      case 'thumbnail':
        return <ThumbnailsTab />;
      case 'annotations':
        return <AnnotationsTab />;
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <MenuProvider skipInstanceCheck>
        <SafeAreaView style={styles.container}>
          {renderToolbar()}
          {renderTabBar()}
          <View style={styles.body}>{renderBody()}</View>
        </SafeAreaView>
      </MenuProvider>
    </Modal>
  );
};

const TabButton = ({
  title,
  active,
  onPress,
  styles,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    activeOpacity={0.88}
    style={[styles.tabButton, active && styles.tabButtonActive]}
    onPress={onPress}>
    <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appTheme.colors.surface,
    },
    toolbar: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: appTheme.colors.surface,
      paddingHorizontal: appTheme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: appTheme.colors.outlineVariant,
    },
    iconButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPlaceholder: {
      width: 40,
      height: 40,
    },
    navIcon: {
      width: 20,
      height: 20,
      tintColor: appTheme.colors.textPrimary,
    },
    toolbarTitle: {
      flex: 1,
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '600',
      textAlign: 'center',
    },
    tabBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: appTheme.colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: appTheme.colors.outlineVariant,
    },
    tabButton: {
      flex: 1,
      minHeight: 40,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: appTheme.spacing.xs,
    },
    tabButtonActive: {
      borderBottomWidth: 2,
      borderBottomColor: appTheme.colors.primary,
    },
    tabButtonText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '500',
    },
    tabButtonTextActive: {
      color: appTheme.colors.primary,
      fontWeight: '600',
    },
    body: {
      flex: 1,
      backgroundColor: appTheme.colors.surface,
    },
  });
}

export default CPDFBotaScreen;