/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  InteractionManager,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Image,
} from 'react-native';

import { useAppTheme } from '../../theme/appTheme';

export type ToolbarActionTone = 'primary' | 'secondary' | 'danger';

export type ToolbarActionMenuItem = {
  key?: string;
  label: string;
  onPress: () => void | Promise<void>;
  tone?: ToolbarActionTone;
};

type ToolbarActionMenuProps = {
  actions: ToolbarActionMenuItem[];
};

export function ToolbarActionMenu({ actions }: ToolbarActionMenuProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const triggerRef = useRef<View | null>(null);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuTranslateY = useRef(new Animated.Value(-8)).current;
  const menuScale = useRef(new Animated.Value(0.98)).current;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchorFrame, setAnchorFrame] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const pendingActionRef = useRef<(() => void | Promise<void>) | null>(null);

  useEffect(() => {
    if (menuVisible || !pendingActionRef.current) {
      return;
    }

    let cancelled = false;
    const interactionHandle = InteractionManager.runAfterInteractions(() => {
      if (cancelled) {
        return;
      }

      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      if (action) {
        void action();
      }
    });

    return () => {
      cancelled = true;
      interactionHandle.cancel();
    };
  }, [menuVisible]);

  if (actions.length === 0) {
    return null;
  }

  const runOpenAnimation = () => {
    backdropOpacity.setValue(0);
    menuOpacity.setValue(0);
    menuTranslateY.setValue(-8);
    menuScale.setValue(0.98);

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuTranslateY, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchorFrame({ x, y, width, height });
      setMenuVisible(true);
      requestAnimationFrame(runOpenAnimation);
    });
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue: 0,
        duration: 110,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuTranslateY, {
        toValue: -6,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(menuScale, {
        toValue: 0.985,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMenuVisible(false);
    });
  };

  const menuWidth = 220;
  const left = Math.max(
    appTheme.spacing.md,
    Math.min(
      anchorFrame.x + anchorFrame.width - menuWidth,
      screenWidth - menuWidth - appTheme.spacing.md,
    ),
  );
  const top = Math.min(
    anchorFrame.y + anchorFrame.height + appTheme.spacing.xs,
    screenHeight - actions.length * 52 - 80,
  );

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={openMenu}
        style={({ pressed }) => [
          styles.triggerButton,
          pressed ? styles.triggerButtonPressed : null,
        ]}
      >
        <Image
          source={require('../../../assets/more.png')}
          style={styles.triggerIcon}
        />
      </Pressable>

      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdropPressTarget} onPress={closeMenu}>
            <Animated.View
              style={[styles.backdrop, { opacity: backdropOpacity }]}
            />
          </Pressable>
          <Animated.View
            style={[
              styles.menuCard,
              {
                left,
                top,
                width: menuWidth,
                opacity: menuOpacity,
                transform: [
                  { translateY: menuTranslateY },
                  { scale: menuScale },
                ],
              },
            ]}
          >
            {actions.map((action, index) => (
              <Pressable
                key={action.key ?? action.label}
                onPress={() => {
                  pendingActionRef.current = action.onPress;
                  closeMenu();
                }}
                style={({ pressed }) => [
                  styles.optionRow,
                  index > 0 ? styles.optionRowBorder : null,
                  pressed ? styles.optionRowPressed : null,
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.optionLabel,
                    action.tone === 'primary' ? styles.primaryOptionLabel : null,
                    action.tone === 'secondary' ? styles.secondaryOptionLabel : null,
                    action.tone === 'danger' ? styles.dangerOptionLabel : null,
                  ]}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    modalRoot: {
      flex: 1,
    },
    backdropPressTarget: {
      ...StyleSheet.absoluteFillObject,
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    triggerButton: {
      width: 36,
      height: 36,
      borderRadius: appTheme.radii.sm,
      backgroundColor: appTheme.colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    triggerButtonPressed: {
      backgroundColor: appTheme.colors.surfaceAlt,
      opacity: 0.72,
    },
    triggerIcon: {
      width: 20,
      height: 20,
      tintColor: appTheme.colors.textPrimary,
      resizeMode: 'contain',
    },
    menuCard: {
      position: 'absolute',
      overflow: 'hidden',
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.surface,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      shadowColor: '#000000',
      shadowOpacity: 0.14,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    optionRow: {
      minHeight: 48,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      justifyContent: 'center',
      backgroundColor: appTheme.colors.surface,
    },
    optionRowBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: appTheme.colors.outlineVariant,
    },
    optionRowPressed: {
      backgroundColor: appTheme.colors.surfaceAlt,
      opacity: 0.9,
    },
    optionLabel: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    primaryOptionLabel: {
      color: appTheme.colors.primary,
    },
    secondaryOptionLabel: {
      color: appTheme.colors.textPrimary,
    },
    dangerOptionLabel: {
      color: '#D92D20',
    },
  });
}