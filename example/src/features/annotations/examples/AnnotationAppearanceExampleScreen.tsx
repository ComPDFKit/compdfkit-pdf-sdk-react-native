/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useMemo, useRef, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CPDFAnnotation,
  CPDFAnnotationRenderOptions,
  CPDFImageUtil,
  CPDFPageCompression,
  CPDFReaderView,
  CPDFViewMode,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { useAppTheme } from '../../../theme/appTheme';
import { Logger } from '../../../util/logger';
import { AnnotationExampleScaffold } from '../shared/AnnotationExampleScaffold';
import { fetchAllAnnotations } from '../shared/annotationExampleActions';
import { getDefaultAnnotationDocument } from '../shared/defaultDocument';

type AnnotationAppearanceRoute = RouteProp<
  AppStackParamList,
  'CPDFAnnotationAppearanceExample'
>;

type AppearancePreset = {
  key: 'png-hd' | 'jpeg-compact';
  label: string;
  description: string;
  scale: number;
  compression: typeof CPDFPageCompression[keyof typeof CPDFPageCompression];
  quality?: number;
};

type RenderSummary = {
  base64Length: number;
  options: CPDFAnnotationRenderOptions;
};

const appearancePresets: AppearancePreset[] = [
  {
    key: 'png-hd',
    label: 'High fidelity PNG',
    description: 'Lossless preview for UI snapshots and visual checks.',
    scale: 4,
    compression: CPDFPageCompression.PNG,
  },
  {
    key: 'jpeg-compact',
    label: 'Compact JPEG',
    description: 'Smaller payload for demos where exact transparency is not required.',
    scale: 3,
    compression: CPDFPageCompression.JPEG,
    quality: 82,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeDecimalInput(value: string) {
  return value.replace(/[^0-9.]/g, '');
}

function sanitizeIntegerInput(value: string) {
  return value.replace(/[^0-9]/g, '');
}

function formatAnnotationLabel(annotation: CPDFAnnotation) {
  if (annotation.title?.trim()) {
    return annotation.title.trim();
  }
  if (annotation.content?.trim()) {
    return annotation.content.trim();
  }
  return `${annotation.type.toUpperCase()} annotation`;
}

function compressionConstantName(
  compression: typeof CPDFPageCompression[keyof typeof CPDFPageCompression],
) {
  return compression === CPDFPageCompression.JPEG ? 'JPEG' : 'PNG';
}

export default function AnnotationAppearanceExampleScreen() {
  const navigation = useNavigation();
  const route = useRoute<AnnotationAppearanceRoute>();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const [document] = useState(route.params?.document ?? getDefaultAnnotationDocument());
  const [annotations, setAnnotations] = useState<CPDFAnnotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<CPDFAnnotation | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loadingAnnotations, setLoadingAnnotations] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [selectedPresetKey, setSelectedPresetKey] = useState<AppearancePreset['key']>('png-hd');
  const [scaleInput, setScaleInput] = useState('4');
  const [qualityInput, setQualityInput] = useState('82');
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [renderSummary, setRenderSummary] = useState<RenderSummary | null>(null);

  const selectedPreset =
    appearancePresets.find((preset) => preset.key === selectedPresetKey) ?? appearancePresets[0]!;

  const effectiveRenderState = useMemo(() => {
    const parsedScale = Number.parseFloat(scaleInput);
    const safeScale = Number.isFinite(parsedScale) && parsedScale > 0
      ? parsedScale
      : selectedPreset.scale;

    const options: CPDFAnnotationRenderOptions = {
      scale: safeScale,
      compression: selectedPreset.compression,
    };

    let safeQuality: number | undefined;
    if (selectedPreset.compression === CPDFPageCompression.JPEG) {
      const parsedQuality = Number.parseInt(qualityInput, 10);
      safeQuality = Number.isFinite(parsedQuality)
        ? clamp(parsedQuality, 1, 100)
        : selectedPreset.quality ?? 80;
      options.quality = safeQuality;
    }

    return {
      options,
      compressionLabel: compressionConstantName(selectedPreset.compression),
      scale: safeScale,
      quality: safeQuality,
    };
  }, [qualityInput, scaleInput, selectedPreset]);

  const codeSample = useMemo(() => {
    const lines = [
      'const base64 = await pdfReaderRef.current?._pdfDocument.renderAnnotationAppearance(',
      '  selectedAnnotation,',
      '  {',
      `    scale: ${effectiveRenderState.scale},`,
      `    compression: CPDFPageCompression.${effectiveRenderState.compressionLabel},`,
    ];

    if (effectiveRenderState.quality !== undefined) {
      lines.push(`    quality: ${effectiveRenderState.quality},`);
    }

    lines.push('  }', ');', 'const uri = CPDFImageUtil.base64ToUri(base64);');
    return lines.join('\n');
  }, [effectiveRenderState]);

  const clearRenderedState = () => {
    setPreviewImageUri(null);
    setRenderSummary(null);
    setErrorMessage(null);
  };

  const applyPreset = (preset: AppearancePreset) => {
    setSelectedPresetKey(preset.key);
    setScaleInput(String(preset.scale));
    if (preset.quality !== undefined) {
      setQualityInput(String(preset.quality));
    }
    clearRenderedState();
  };

  const collectAnnotations = async () => {
    if (loadingAnnotations) {
      return;
    }

    setLoadingAnnotations(true);
    setErrorMessage(null);

    try {
      const items = await fetchAllAnnotations(readerRef.current);
      setAnnotations(items);

      if (items.length === 0) {
        setSelectedAnnotation(null);
        setPickerVisible(false);
        setPreviewImageUri(null);
        setRenderSummary(null);
        setErrorMessage('No annotations were found in the current document. Add one first, then reload.');
        return;
      }

      const firstAnnotation = items[0]!;
      setSelectedAnnotation((current) => current ?? firstAnnotation);
      setPickerVisible(true);
    } catch (error) {
      Logger.error('collectAnnotations error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to collect annotations.');
    } finally {
      setLoadingAnnotations(false);
    }
  };

  const openPicker = () => {
    if (annotations.length === 0) {
      void collectAnnotations();
      return;
    }
    setPickerVisible(true);
  };

  const selectAnnotation = async (annotation: CPDFAnnotation) => {
    setSelectedAnnotation(annotation);
    setPickerVisible(false);
    clearRenderedState();

    try {
      if (annotation.rect) {
        await readerRef.current?.setDisplayPageIndex(annotation.page, {
          rectList: [annotation.rect],
        });
      } else {
        await readerRef.current?.setDisplayPageIndex(annotation.page);
      }
    } catch (error) {
      Logger.warn('selectAnnotation navigation failed:', error);
    }
  };

  const renderAppearance = async () => {
    if (!readerRef.current) {
      setErrorMessage('PDF reader is not ready yet. Wait for the document to finish loading.');
      return;
    }

    if (!selectedAnnotation) {
      setErrorMessage('Select an annotation before rendering its appearance.');
      return;
    }

    setRendering(true);
    setErrorMessage(null);

    try {
      const base64 = await readerRef.current._pdfDocument.renderAnnotationAppearance(
        selectedAnnotation,
        effectiveRenderState.options,
      );

      if (!base64) {
        setPreviewImageUri(null);
        setRenderSummary(null);
        setErrorMessage('renderAnnotationAppearance returned an empty image.');
        return;
      }

      setPreviewImageUri(CPDFImageUtil.base64ToUri(base64));
      setRenderSummary({
        base64Length: base64.length,
        options: effectiveRenderState.options,
      });
    } catch (error) {
      setPreviewImageUri(null);
      setRenderSummary(null);
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to render annotation appearance.',
      );
    } finally {
      setRendering(false);
    }
  };

  return (
    <AnnotationExampleScaffold
      title="Annotation Appearance"
      subtitle="Render the current visual appearance of a selected annotation into a standalone image."
      document={document}
      readerRef={readerRef}
      configuration={ComPDFKit.getDefaultConfig({
        modeConfig: {
          initialViewMode: CPDFViewMode.ANNOTATIONS,
        },
      })}
      overlay={
        <>
          <View pointerEvents="box-none" style={styles.overlayRoot}>
            <View style={[styles.panelCard, panelCollapsed ? styles.panelCardCollapsed : null]}>
              <View style={styles.panelHeaderRow}>
                <View style={styles.panelHeaderCopy}>
                  <Text style={styles.panelEyebrow}>Image Rendering Demo</Text>
                  <Text style={styles.panelTitle}>Render annotation appearance</Text>
                  {!panelCollapsed ? (
                    <Text style={styles.panelDescription}>
                      Pick an existing annotation, choose an output preset, then render the
                      appearance into a base64 image string.
                    </Text>
                  ) : (
                    <Text style={styles.panelDescriptionCompact}>
                      Collapsed view keeps the essentials while freeing more room for the reader.
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.collapseButton}
                  onPress={() => setPanelCollapsed((current) => !current)}>
                  <Text style={styles.collapseButtonText}>
                    {panelCollapsed ? 'Expand' : 'Collapse'}
                  </Text>
                </TouchableOpacity>
              </View>

              {panelCollapsed ? (
                <View style={styles.collapsedContent}>
                  <View style={styles.selectionCard}>
                    <Text style={styles.sectionLabel}>Selected annotation</Text>
                    {selectedAnnotation ? (
                      <>
                        <Text style={styles.selectionTitle} numberOfLines={1}>
                          {formatAnnotationLabel(selectedAnnotation)}
                        </Text>
                        <Text style={styles.selectionMeta}>
                          Page {selectedAnnotation.page + 1} • {selectedAnnotation.type.toUpperCase()}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.selectionEmpty}>
                        Load annotations and choose one to render.
                      </Text>
                    )}
                  </View>

                  <View style={styles.collapsedSummaryRow}>
                    <Text style={styles.collapsedSummaryText}>
                      {annotations.length} loaded • {effectiveRenderState.compressionLabel} • scale {effectiveRenderState.scale}
                    </Text>
                    {renderSummary ? (
                      <Text style={styles.collapsedSummaryText}>
                        {renderSummary.base64Length} chars
                      </Text>
                    ) : null}
                  </View>

                  <Text style={styles.collapsedHintText}>
                    Expand the panel to load annotations, change presets, or render a new preview.
                  </Text>

                  {errorMessage ? (
                    <View style={styles.errorCardCompact}>
                      <Text style={styles.errorMessage}>{errorMessage}</Text>
                    </View>
                  ) : null}
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={styles.panelContent}
                  showsVerticalScrollIndicator={false}>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.primaryButton}
                      onPress={() => {
                        void collectAnnotations();
                      }}>
                      {loadingAnnotations ? (
                        <ActivityIndicator size="small" color={appTheme.colors.inverseText} />
                      ) : (
                        <Text style={styles.primaryButtonText}>
                          {annotations.length > 0 ? 'Refresh annotations' : 'Load annotations'}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[
                        styles.secondaryButton,
                        annotations.length === 0 ? styles.buttonDisabled : null,
                      ]}
                      disabled={annotations.length === 0}
                      onPress={openPicker}>
                      <Text style={styles.secondaryButtonText}>Choose annotation</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Loaded annotations</Text>
                    <Text style={styles.statusValue}>{annotations.length}</Text>
                  </View>

                  <View style={styles.selectionCard}>
                    <Text style={styles.sectionLabel}>Selected annotation</Text>
                    {selectedAnnotation ? (
                      <>
                        <Text style={styles.selectionTitle} numberOfLines={1}>
                          {formatAnnotationLabel(selectedAnnotation)}
                        </Text>
                        <Text style={styles.selectionMeta}>
                          Page {selectedAnnotation.page + 1} • {selectedAnnotation.type.toUpperCase()}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.selectionEmpty}>
                        Load annotations from the current document and choose one to render.
                      </Text>
                    )}
                  </View>

                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionLabel}>Presets</Text>
                    <View style={styles.presetList}>
                      {appearancePresets.map((preset) => {
                        const active = preset.key === selectedPresetKey;
                        return (
                          <TouchableOpacity
                            key={preset.key}
                            activeOpacity={0.85}
                            style={[styles.presetCard, active ? styles.presetCardActive : null]}
                            onPress={() => applyPreset(preset)}>
                            <Text style={[styles.presetTitle, active ? styles.presetTitleActive : null]}>
                              {preset.label}
                            </Text>
                            <Text
                              style={[
                                styles.presetDescription,
                                active ? styles.presetDescriptionActive : null,
                              ]}>
                              {preset.description}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionLabel}>Render options</Text>
                    <View style={styles.inputRow}>
                      <View style={styles.inputCard}>
                        <Text style={styles.inputLabel}>Scale</Text>
                        <TextInput
                          keyboardType="decimal-pad"
                          value={scaleInput}
                          onChangeText={(value) => {
                            setScaleInput(sanitizeDecimalInput(value));
                            clearRenderedState();
                          }}
                          placeholder={String(selectedPreset.scale)}
                          placeholderTextColor={appTheme.colors.textSecondary}
                          style={styles.input}
                        />
                      </View>

                      <View style={styles.inputCard}>
                        <Text style={styles.inputLabel}>Quality</Text>
                        <TextInput
                          keyboardType="number-pad"
                          editable={selectedPreset.compression === CPDFPageCompression.JPEG}
                          value={
                            selectedPreset.compression === CPDFPageCompression.JPEG ? qualityInput : 'PNG'
                          }
                          onChangeText={(value) => {
                            setQualityInput(sanitizeIntegerInput(value));
                            clearRenderedState();
                          }}
                          placeholder={String(selectedPreset.quality ?? 82)}
                          placeholderTextColor={appTheme.colors.textSecondary}
                          style={[
                            styles.input,
                            selectedPreset.compression !== CPDFPageCompression.JPEG
                              ? styles.inputDisabled
                              : null,
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={styles.helperText}>
                      The current output format is {effectiveRenderState.compressionLabel}. JPEG uses
                      quality from 1 to 100. PNG ignores quality.
                    </Text>
                  </View>

                  {errorMessage ? (
                    <View style={styles.errorCard}>
                      <Text style={styles.errorTitle}>Action failed</Text>
                      <Text style={styles.errorMessage}>{errorMessage}</Text>
                    </View>
                  ) : null}

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.renderButton,
                      !selectedAnnotation || rendering ? styles.buttonDisabled : null,
                    ]}
                    disabled={!selectedAnnotation || rendering}
                    onPress={() => {
                      void renderAppearance();
                    }}>
                    {rendering ? (
                      <ActivityIndicator size="small" color={appTheme.colors.inverseText} />
                    ) : (
                      <Text style={styles.renderButtonText}>Render appearance</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.previewCard}>
                    <Text style={styles.sectionLabel}>Rendered preview</Text>
                    {previewImageUri ? (
                      <Image
                        source={{ uri: previewImageUri }}
                        resizeMode="contain"
                        style={styles.previewImage}
                      />
                    ) : (
                      <View style={styles.previewPlaceholder}>
                        <Text style={styles.previewPlaceholderText}>
                          The generated image will appear here after you render.
                        </Text>
                      </View>
                    )}

                    {renderSummary ? (
                      <View style={styles.resultSummary}>
                        <Text style={styles.resultSummaryText}>
                          Base64 length: {renderSummary.base64Length}
                        </Text>
                        <Text style={styles.resultSummaryText}>
                          Compression: {compressionConstantName(
                            renderSummary.options.compression ?? CPDFPageCompression.PNG,
                          )}
                        </Text>
                        <Text style={styles.resultSummaryText}>
                          Scale: {renderSummary.options.scale ?? 1}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.codeCard}>
                    <Text style={styles.sectionLabel}>How to call the API</Text>
                    <Text style={styles.codeBlock}>{codeSample}</Text>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>

          <Modal
            visible={pickerVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setPickerVisible(false)}>
            <View style={styles.modalOverlay}>
              <Pressable style={StyleSheet.absoluteFill} onPress={() => setPickerVisible(false)} />
              <View style={styles.modalCard}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Choose an annotation</Text>
                  <Text style={styles.modalSubtitle}>
                    Selecting an item jumps the viewer to that annotation before rendering.
                  </Text>
                </View>
                <FlatList
                  data={annotations}
                  keyExtractor={(item) => item.uuid}
                  contentContainerStyle={styles.modalListContent}
                  ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
                  renderItem={({ item }) => {
                    const active = selectedAnnotation?.uuid === item.uuid;
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.annotationRow, active ? styles.annotationRowActive : null]}
                        onPress={() => {
                          void selectAnnotation(item);
                        }}>
                        <View style={styles.annotationRowBody}>
                          <Text style={styles.annotationRowTitle} numberOfLines={1}>
                            {formatAnnotationLabel(item)}
                          </Text>
                          <Text style={styles.annotationRowMeta}>
                            Page {item.page + 1} • {item.type.toUpperCase()}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </Modal>
        </>
      }
      onBackPress={() => navigation.goBack()}
    />
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    overlayRoot: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      paddingHorizontal: appTheme.spacing.md,
      paddingBottom: appTheme.spacing.md,
    },
    panelCard: {
      maxHeight: '64%',
      borderRadius: appTheme.radii.xl,
      backgroundColor: appTheme.colors.surface,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      shadowColor: '#000000',
      shadowOpacity: 0.16,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 14,
    },
    panelCardCollapsed: {
      maxHeight: 228,
    },
    panelHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: appTheme.spacing.sm,
      paddingHorizontal: appTheme.spacing.md,
      paddingTop: appTheme.spacing.md,
      paddingBottom: appTheme.spacing.sm,
    },
    panelHeaderCopy: {
      flex: 1,
      gap: appTheme.spacing.xs,
    },
    panelContent: {
      padding: appTheme.spacing.md,
      gap: appTheme.spacing.md,
    },
    collapsedContent: {
      paddingHorizontal: appTheme.spacing.md,
      paddingBottom: appTheme.spacing.md,
      gap: appTheme.spacing.sm,
    },
    panelEyebrow: {
      color: appTheme.colors.primary,
      fontSize: appTheme.typography.labelSmall,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    panelTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    panelDescription: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      lineHeight: 18,
    },
    panelDescriptionCompact: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      lineHeight: 18,
    },
    collapseButton: {
      minHeight: 36,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: appTheme.spacing.md,
    },
    collapseButtonText: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodySmall,
      fontWeight: '700',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: appTheme.spacing.sm,
    },
    primaryButton: {
      flex: 1,
      minHeight: 44,
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: appTheme.spacing.md,
    },
    primaryButtonText: {
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '700',
    },
    secondaryButton: {
      flex: 1,
      minHeight: 44,
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: appTheme.spacing.md,
    },
    secondaryButtonText: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    buttonDisabled: {
      opacity: 0.45,
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: appTheme.spacing.sm,
    },
    statusLabel: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
    },
    statusValue: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '700',
    },
    selectionCard: {
      backgroundColor: appTheme.colors.surfaceAlt,
      borderRadius: appTheme.radii.lg,
      padding: appTheme.spacing.md,
      gap: appTheme.spacing.xxs,
    },
    sectionBlock: {
      gap: appTheme.spacing.sm,
    },
    sectionLabel: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '700',
    },
    selectionTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyMedium,
      fontWeight: '700',
    },
    selectionMeta: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
    },
    selectionEmpty: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      lineHeight: 18,
    },
    presetList: {
      gap: appTheme.spacing.sm,
    },
    presetCard: {
      borderRadius: appTheme.radii.lg,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      backgroundColor: appTheme.colors.surface,
      padding: appTheme.spacing.md,
      gap: appTheme.spacing.xs,
    },
    presetCardActive: {
      backgroundColor: '#EAF2FF',
      borderColor: appTheme.colors.primary,
    },
    presetTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyMedium,
      fontWeight: '700',
    },
    presetTitleActive: {
      color: appTheme.colors.primary,
    },
    presetDescription: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      lineHeight: 18,
    },
    presetDescriptionActive: {
      color: appTheme.colors.primary,
    },
    inputRow: {
      flexDirection: 'row',
      gap: appTheme.spacing.sm,
    },
    inputCard: {
      flex: 1,
      gap: appTheme.spacing.xs,
    },
    inputLabel: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      fontWeight: '600',
    },
    input: {
      minHeight: 44,
      borderRadius: appTheme.radii.md,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      backgroundColor: appTheme.colors.surface,
      paddingHorizontal: appTheme.spacing.md,
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyMedium,
      fontWeight: '600',
    },
    inputDisabled: {
      color: appTheme.colors.textSecondary,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    helperText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      lineHeight: 18,
    },
    errorCard: {
      borderRadius: appTheme.radii.lg,
      backgroundColor: '#FFF1F1',
      padding: appTheme.spacing.md,
      gap: appTheme.spacing.xs,
    },
    errorTitle: {
      color: '#B91C1C',
      fontSize: appTheme.typography.bodyMedium,
      fontWeight: '700',
    },
    errorMessage: {
      color: '#B91C1C',
      fontSize: appTheme.typography.bodySmall,
      lineHeight: 18,
    },
    renderButton: {
      minHeight: 48,
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: appTheme.spacing.md,
    },
    renderButtonText: {
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '700',
    },
    collapsedSummaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: appTheme.spacing.sm,
    },
    collapsedSummaryText: {
      flex: 1,
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
    },
    collapsedHintText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      lineHeight: 18,
    },
    errorCardCompact: {
      borderRadius: appTheme.radii.md,
      backgroundColor: '#FFF1F1',
      padding: appTheme.spacing.sm,
    },
    previewCard: {
      gap: appTheme.spacing.sm,
    },
    previewImage: {
      width: '100%',
      height: 180,
      borderRadius: appTheme.radii.lg,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    previewPlaceholder: {
      height: 140,
      borderRadius: appTheme.radii.lg,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: appTheme.colors.outline,
      backgroundColor: appTheme.colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: appTheme.spacing.md,
    },
    previewPlaceholderText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      lineHeight: 18,
      textAlign: 'center',
    },
    resultSummary: {
      gap: appTheme.spacing.xxs,
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.surfaceAlt,
      padding: appTheme.spacing.sm,
    },
    resultSummaryText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
    },
    codeCard: {
      gap: appTheme.spacing.sm,
      marginBottom: appTheme.spacing.xs,
    },
    codeBlock: {
      borderRadius: appTheme.radii.lg,
      backgroundColor: '#0F172A',
      color: '#E2E8F0',
      padding: appTheme.spacing.md,
      fontSize: 12,
      lineHeight: 18,
      fontFamily: 'Menlo',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(15, 23, 42, 0.48)',
    },
    modalCard: {
      maxHeight: '74%',
      borderTopLeftRadius: appTheme.radii.xl,
      borderTopRightRadius: appTheme.radii.xl,
      backgroundColor: appTheme.colors.surface,
      paddingTop: appTheme.spacing.sm,
      paddingHorizontal: appTheme.spacing.md,
      paddingBottom: appTheme.spacing.md,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      borderBottomWidth: 0,
    },
    modalHandle: {
      alignSelf: 'center',
      width: 44,
      height: 5,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.outline,
      marginBottom: appTheme.spacing.md,
    },
    modalHeader: {
      gap: appTheme.spacing.xs,
      marginBottom: appTheme.spacing.md,
    },
    modalTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    modalSubtitle: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      lineHeight: 18,
    },
    modalListContent: {
      paddingBottom: appTheme.spacing.lg,
    },
    modalSeparator: {
      height: appTheme.spacing.sm,
    },
    annotationRow: {
      borderRadius: appTheme.radii.lg,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      backgroundColor: appTheme.colors.surface,
      padding: appTheme.spacing.md,
    },
    annotationRowActive: {
      borderColor: appTheme.colors.primary,
      backgroundColor: '#EAF2FF',
    },
    annotationRowBody: {
      gap: appTheme.spacing.xxs,
    },
    annotationRowTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyMedium,
      fontWeight: '700',
    },
    annotationRowMeta: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
    },
  });
}