/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme, type AppTheme } from '../../../theme/appTheme';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { AppToast } from '../../../widgets/common/ConfirmDialog';
import {
  DEFAULT_PERSISTED_SETTINGS,
  loadPersistedSettings,
  savePersistedSettings,
  type PersistedSettings,
} from '../../settings/settingsStorage';
import { APP_ROUTES, type AppStackParamList } from '../../navigation/routes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SettingsItem = {
  title: string;
  value?: string;
  url?: string;
};

type AppNavigation = NativeStackNavigationProp<AppStackParamList, 'Settings'>;

type SettingsAction =
  | { type: 'loaded'; payload: PersistedSettings }
  | { type: 'setHighlightLinkArea'; payload: boolean }
  | { type: 'setHighlightFormArea'; payload: boolean }
  | { type: 'setAnnotationAuthor'; payload: string };

function settingsReducer(
  state: PersistedSettings,
  action: SettingsAction,
): PersistedSettings {
  switch (action.type) {
    case 'loaded':
      return action.payload;
    case 'setHighlightLinkArea':
      return { ...state, highlightLinkArea: action.payload };
    case 'setHighlightFormArea':
      return { ...state, highlightFormArea: action.payload };
    case 'setAnnotationAuthor':
      return { ...state, annotationAuthor: action.payload };
  }
}

export function SettingsScreen() {
  const navigation = useNavigation<AppNavigation>();
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const [versionCode, setVersionCode] = useState('');
  const [settings, dispatch] = useReducer(settingsReducer, DEFAULT_PERSISTED_SETTINGS);
  const [authorDraft, setAuthorDraft] = useState('');
  const [authorDialogVisible, setAuthorDialogVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadVersion = async () => {
      const rawVersion = await ComPDFKit.getVersionCode();
      const version =
        typeof rawVersion === 'function'
          ? await rawVersion()
          : String(rawVersion);
      if (mounted) {
        setVersionCode(version);
      }
    };

    void loadVersion();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const persisted = await loadPersistedSettings();
      if (mounted) {
        dispatch({ type: 'loaded', payload: persisted });
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const persistAndDispatch = useCallback(
    (action: SettingsAction) => {
      const next = settingsReducer(settings, action);
      dispatch(action);
      void savePersistedSettings(next);
    },
    [settings],
  );

  const handleHighlightLinkAreaChange = (value: boolean) => {
    persistAndDispatch({ type: 'setHighlightLinkArea', payload: value });
  };

  const handleHighlightFormAreaChange = (value: boolean) => {
    persistAndDispatch({ type: 'setHighlightFormArea', payload: value });
  };

  const openAuthorDialog = () => {
    setAuthorDraft(settings.annotationAuthor);
    setAuthorDialogVisible(true);
  };

  const handleAuthorSave = () => {
    const nextAuthor = authorDraft.trim();
    if (!nextAuthor) {
      setToastMessage('Please enter an annotation author.');
      return;
    }

    setAuthorDialogVisible(false);
    persistAndDispatch({ type: 'setAnnotationAuthor', payload: nextAuthor });
  };

  const infoItems = useMemo<SettingsItem[]>(
    () => [
      {
        title: 'Versions',
        value: versionCode ? `v${versionCode}` : 'Loading...',
      },
    ],
    [versionCode],
  );

  const companyItems = useMemo<SettingsItem[]>(
    () => [
      { title: 'ComPDFKit Website', url: 'https://www.compdf.com/' },
      {
        title: 'About Us',
        url: 'https://www.compdf.com/company/about',
      },
      {
        title: 'Technical Support',
        url: 'https://www.compdf.com/support',
      },
      {
        title: 'Contact Sales',
        url: 'https://www.compdf.com/contact-sales',
      },
      {
        title: 'Support@compdf.com',
        url: 'mailto:support@compdf.com?subject=Technical Support',
      },
    ],
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppToolbar
        title="Settings"
        subtitle="Settings and Information"
        onBackPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate(APP_ROUTES.home)
        }
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Global setting</Text>
        <View style={styles.groupCard}>
          <SettingsToggleRow
            title="Highlight Link area"
            value={settings.highlightLinkArea}
            onValueChange={handleHighlightLinkAreaChange}
            appTheme={appTheme}
            styles={styles}
          />
          <View style={styles.divider} />
          <SettingsToggleRow
            title="Highlight Form Area"
            value={settings.highlightFormArea}
            onValueChange={handleHighlightFormAreaChange}
            appTheme={appTheme}
            styles={styles}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.78}
          onPress={openAuthorDialog}
          style={styles.singleRowCard}>
          <Text style={styles.rowTitle}>Document Author</Text>
          <View style={styles.inlineValueRow}>
            <Text style={styles.rowValue}>{settings.annotationAuthor}</Text>
            <Text style={styles.rowChevron}>›</Text>
          </View>
        </TouchableOpacity>

        <SettingsSection title="SDK Information" items={infoItems} styles={styles} />
        <SettingsSection
          title="Company Information"
          items={companyItems}
          styles={styles}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
          </Text>
          <View style={styles.footerLinks}>
            <FooterLink
              title="Privacy Policy"
              url="https://www.compdf.com/privacy-policy"
              styles={styles}
            />
            <FooterLink
              title="Terms of Service"
              url="https://www.compdf.com/terms-of-service"
              styles={styles}
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={authorDialogVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAuthorDialogVisible(false)}>
        <View style={styles.dialogBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setAuthorDialogVisible(false)}
          />
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>Annotation Author</Text>
            <Text style={styles.dialogMessage}>
              Set the default author name used in `annotationsConfig.annotationAuthor`.
            </Text>
            <TextInput
              style={styles.dialogInput}
              value={authorDraft}
              onChangeText={setAuthorDraft}
              placeholder="Enter author name"
              placeholderTextColor={appTheme.colors.textSecondary}
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.dialogActions}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.dialogButtonSecondary}
                onPress={() => setAuthorDialogVisible(false)}>
                <Text style={styles.dialogButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.dialogButtonPrimary}
                onPress={handleAuthorSave}>
                <Text style={styles.dialogButtonPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AppToast
        visible={!!toastMessage}
        message={toastMessage}
        onHide={() => setToastMessage('')}
      />
    </SafeAreaView>
  );
}

type SettingsSectionProps = {
  title: string;
  items: SettingsItem[];
  styles: ReturnType<typeof createStyles>;
};

function SettingsSection({ title, items, styles }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.groupCard}>
        {items.map((item, index) => (
          <React.Fragment key={item.title}>
            {index > 0 ? <View style={styles.divider} /> : null}
          <TouchableOpacity
            activeOpacity={item.url ? 0.75 : 1}
            disabled={!item.url}
            onPress={() => item.url && void openExternalLink(item.url)}
            style={styles.sectionRow}>
            <View style={styles.sectionCopy}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              {item.value ? <Text style={styles.rowValue}>{item.value}</Text> : null}
            </View>
            {item.url ? <Text style={styles.rowChevron}>›</Text> : null}
          </TouchableOpacity>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

type SettingsToggleRowProps = {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  appTheme: AppTheme;
  styles: ReturnType<typeof createStyles>;
};

function SettingsToggleRow({
  title,
  value,
  onValueChange,
  appTheme,
  styles,
}: SettingsToggleRowProps) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: appTheme.colors.outline,
          true: appTheme.colors.primary,
        }}
        thumbColor={appTheme.colors.surface}
        ios_backgroundColor={appTheme.colors.outline}
      />
    </View>
  );
}

type FooterLinkProps = {
  title: string;
  url: string;
  styles: ReturnType<typeof createStyles>;
};

function FooterLink({ title, url, styles }: FooterLinkProps) {
  return (
    <TouchableOpacity onPress={() => void openExternalLink(url)}>
      <Text style={styles.footerLink}>{title}</Text>
    </TouchableOpacity>
  );
}

async function openExternalLink(url: string) {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  }
}

function createStyles(appTheme: AppTheme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: appTheme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    content: {
      paddingHorizontal: appTheme.spacing.md,
      paddingTop: appTheme.spacing.sm,
      paddingBottom: appTheme.spacing.xxl,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    section: {
      marginTop: appTheme.spacing.xl,
    },
    sectionLabel: {
      color: appTheme.colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      marginBottom: appTheme.spacing.xs,
    },
    groupCard: {
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: appTheme.colors.surface,
    },
    singleRowCard: {
      minHeight: 52,
      marginTop: appTheme.spacing.sm,
      borderRadius: 12,
      paddingHorizontal: appTheme.spacing.sm,
      backgroundColor: appTheme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    inlineValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: appTheme.spacing.xs,
    },
    sectionRow: {
      minHeight: 52,
      paddingHorizontal: appTheme.spacing.sm,
      paddingVertical: appTheme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    divider: {
      height: 1,
      backgroundColor: appTheme.colors.outlineVariant,
      marginHorizontal: appTheme.spacing.sm,
    },
    sectionCopy: {
      flex: 1,
      paddingRight: appTheme.spacing.sm,
    },
    rowTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: 14,
      fontWeight: '400',
    },
    rowValue: {
      color: appTheme.colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    rowChevron: {
      color: '#9CA3AF',
      fontSize: 20,
      fontWeight: '400',
    },
    footer: {
      marginTop: appTheme.spacing.xl,
      alignItems: 'center',
    },
    footerText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelSmall,
      textAlign: 'center',
    },
    footerLinks: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: appTheme.spacing.sm,
      marginTop: appTheme.spacing.xs,
    },
    footerLink: {
      color: appTheme.colors.primary,
      fontSize: 12,
      fontWeight: '400',
    },
    dialogBackdrop: {
      flex: 1,
      padding: appTheme.spacing.xl,
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.36)',
    },
    dialogCard: {
      borderRadius: 16,
      backgroundColor: appTheme.colors.surface,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      padding: appTheme.spacing.lg,
      gap: appTheme.spacing.md,
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    dialogTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    dialogMessage: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 22,
    },
    dialogInput: {
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      borderRadius: 12,
      backgroundColor: appTheme.colors.surfaceAlt,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyMedium,
    },
    dialogActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: appTheme.spacing.sm,
    },
    dialogButtonSecondary: {
      minWidth: 88,
      borderRadius: 10,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    dialogButtonPrimary: {
      minWidth: 88,
      borderRadius: 10,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appTheme.colors.primary,
    },
    dialogButtonSecondaryText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    dialogButtonPrimaryText: {
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '700',
    },
  });
}
