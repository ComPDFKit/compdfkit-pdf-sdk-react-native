/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { PureComponent } from "react";
import {
  findNodeHandle,
  requireNativeComponent,
  NativeModules,
  Platform,
} from "react-native";
import {
  CPDFAnnotationType,
  CPDFAnnotationStyleDialogDismissedEvent,
  CPDFContentEditorStyleDialogDismissedEvent,
  CPDFEditType,
  CPDFEventDataMap,
  CPDFFormStyleDialogDismissedEvent,
  CPDFPrepareNextStampOptions,
  CPDFThemes,
  CPDFViewMode,
  CPDFWidgetType,
} from "../configuration/CPDFOptions";
import {
  CPDFAnnotationAttr,
  CPDFAnnotationAttrUnion,
} from "../configuration/attributes/CPDFAnnotationAttr";
import {
  CPDFCheckBoxAttr,
  CPDFComboBoxAttr,
  CPDFListBoxAttr,
  CPDFPushButtonAttr,
  CPDFRadioButtonAttr,
  CPDFSignatureWidgetAttr,
  CPDFTextFieldAttr,
  CPDFWidgetAttr,
} from "../configuration/attributes/CPDFWidgetAttr";
import { CPDFAnnotation } from "../annotation/CPDFAnnotation";
import { CPDFDocument } from "../document/CPDFDocument";
import { CPDFEditArea } from "../edit/CPDFEditArea";
import { CPDFEditManager } from "../edit/CPDFEditManager";
import { CPDFRectF } from "../util/CPDFRectF";
import { CPDFWidget } from "../annotation/form/CPDFWidget";
import { CPDFAnnotationHistoryManager } from "../history/CPDFAnnotationHistoryManager";
import {
  normalizeColorToARGB,
  safeParseEnumValue,
  normalizeColorsInAnnotationAttr,
  normalizeColorsInWidgetAttr,
} from "../util/CPDFEnumUtils";
import { CPDFWatermarkConfig } from "../configuration/config/CPDFWatermarkConfig";
import { CPDFAnnotationFactory } from "../annotation/CPDFAnnotationFactory";
import { CPDFWidgetFactory } from "../annotation/form/CPDFWidgetFactory";
const { CPDFViewManager } = NativeModules;

/**
 * ComPDFKit PDF UI Component.
 *
 * @example
 * const pdfReaderRef = useRef<CPDFReaderView>(null);
 *
 *  <CPDFReaderView
 *      ref={pdfReaderRef}
 *      document={samplePDF}
 *      password={'1234'}
 *      configuration={ComPDFKit.getDefaultConfig({})}
 *  />
 */

/**
 * Props used to configure and observe the native PDF reader view.
 *
 * @group Viewer
 */
export interface CPDFReaderViewProps {
  configuration: string;
  document: string;
  password?: string;
  pageIndex?: number;
  onPageChanged?: (pageIndex: number) => void;
  onSaveDocument?: () => void;
  onPageEditDialogBackPress?: () => void;
  onFullScreenChanged?: (isFullScreen: boolean) => void;
  onTapMainDocArea?: () => void;
  onIOSClickBackPressed?: () => void; // iOS only
  onChange?: (event: any) => void;
  onViewCreated?: () => void;
  onCustomToolbarItemTapped?: (identifier: string) => void;
  onCustomContextMenuItemTapped?: (identifier: string, event: any) => void;
  onSearchBackButtonTapped?: () => void;
  onAddWatermarkDialogDismissed?: () => void;
  onAnnotationStyleDialogDismissed?: (
    event: CPDFAnnotationStyleDialogDismissedEvent
  ) => void;
  onFormStyleDialogDismissed?: (
    event: CPDFFormStyleDialogDismissedEvent
  ) => void;
  onContentEditorStyleDialogDismissed?: (
    event: CPDFContentEditorStyleDialogDismissedEvent
  ) => void;
  onAnnotationCreationPrepared?: (
    type: CPDFAnnotationType,
    event: CPDFAnnotation | null
  ) => void;
  onInterceptAnnotationActionCallback?: (annotation: CPDFAnnotation) => void;
  onInterceptWidgetActionCallback?: (widget: CPDFWidget) => void;
  style?: any;
}

/**
 * Native PDF reader component for viewing and editing a document.
 *
 * @group Viewer
 * @since 3.0.0
 * @remarks Supported on Android and iOS. Platform-specific methods document their limitations.
 */
export class CPDFReaderView extends PureComponent<CPDFReaderViewProps, any> {
  /** @internal */
  _viewerRef: any;

  /** @group Document Lifecycle */
  _pdfDocument: CPDFDocument;

  /** @group Annotations */
  _annotationsHistoryManager: CPDFAnnotationHistoryManager;

  /** @group Content Editing */
  _editManager: CPDFEditManager;

  /** @internal */
  _eventListeners: Map<string, Array<Function>> = new Map();

  /** @internal */
  static defaultProps = {
    password: "",
    pageIndex: 0,
  };

  constructor(props: CPDFReaderViewProps) {
    super(props);
    this._pdfDocument = new CPDFDocument(this._viewerRef);
    this._annotationsHistoryManager = new CPDFAnnotationHistoryManager(
      this._viewerRef
    );
    this._editManager = new CPDFEditManager(this._viewerRef);
  }

  /** @internal */
  _setNativeRef = (ref: any) => {
    this._viewerRef = ref;
    this._pdfDocument = new CPDFDocument(this._viewerRef);
    this._annotationsHistoryManager = new CPDFAnnotationHistoryManager(
      this._viewerRef
    );
    this._editManager = new CPDFEditManager(this._viewerRef);
  };

  /**
   * Register an event listener for a specific event with type-safe callbacks.
   *
   * @example
   * // Annotation created event - returns CPDFAnnotation
   * pdfReaderRef.current?.addEventListener(CPDFEvent.ANNOTATIONS_CREATED, (annotation) => {
   *   console.log('Annotation created:', annotation.type);
   * });
   *
   * // Form field selected event - returns CPDFWidget
   * pdfReaderRef.current?.addEventListener(CPDFEvent.FORM_FIELDS_SELECTED, (widget) => {
   *   console.log('Form field selected:', widget.type);
   * });
   *
   * // Editor selection - returns CPDFEditArea | null
   * pdfReaderRef.current?.addEventListener(CPDFEvent.EDITOR_SELECTION_DESELECTED, (editArea) => {
   *   if (editArea) {
   *     console.log('Edit area deselected');
   *   }
   * });
   *
   * @param event The event type to listen for
   * @param callback The callback function with typed event data
   * @group Events
   */
  addEventListener<K extends keyof CPDFEventDataMap>(
    event: K,
    callback: (eventData: CPDFEventDataMap[K]) => void
  ): void {
    if (__DEV__) {
      console.log("ComPDFKit addEventListener for event:", event);
    }
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, []);
    }
    this._eventListeners.get(event)?.push(callback as Function);
  }

  /**
   * Remove an event listener for a specific event.
   * @param event The event type to stop listening for
   * @param callback The callback function to remove
   * @group Events
   */
  removeEventListener<K extends keyof CPDFEventDataMap>(
    event: K,
    callback: (eventData: CPDFEventDataMap[K]) => void
  ): void {
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback as Function);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Trigger event listeners for a specific event.
   * @param event The event type to trigger
   * @param eventData The data to pass to the event listeners
   */
  private _triggerEvent = (event: string, eventData?: any) => {
    const listeners = this._eventListeners.get(event);
    if (listeners && listeners.length > 0) {
      listeners.forEach((callback) => {
        try {
          callback(eventData);
        } catch (error) {
          console.error(`ComPDFKit event listener error for ${event}:`, error);
        }
      });
    }
  };

  /** @internal */
  onChange = (event: any) => {
    if ("onPageChanged" in event.nativeEvent) {
      if (this.props.onPageChanged) {
        this.props.onPageChanged(event.nativeEvent.onPageChanged);
      }
    } else if ("onSaveDocument" in event.nativeEvent) {
      if (this.props.onSaveDocument) {
        this.props.onSaveDocument();
      }
    } else if ("onPageEditDialogBackPress" in event.nativeEvent) {
      if (this.props.onPageEditDialogBackPress) {
        this.props.onPageEditDialogBackPress();
      }
    } else if ("onFullScreenChanged" in event.nativeEvent) {
      if (this.props.onFullScreenChanged) {
        this.props.onFullScreenChanged(event.nativeEvent.onFullScreenChanged);
      }
    } else if ("onTapMainDocArea" in event.nativeEvent) {
      if (this.props.onTapMainDocArea) {
        this.props.onTapMainDocArea();
      }
    } else if ("onAnnotationHistoryChanged" in event.nativeEvent) {
      if (this._annotationsHistoryManager) {
        this._annotationsHistoryManager.handle(event);
      }
    } else if ("onIOSClickBackPressed" in event.nativeEvent) {
      if (this.props.onIOSClickBackPressed) {
        this.props.onIOSClickBackPressed();
      }
    } else if ("onDocumentIsReady" in event.nativeEvent) {
      if (this.props.onViewCreated) {
        this.props.onViewCreated();
      }
    } else if ("onContentEditorHistoryChanged" in event.nativeEvent) {
      if (this._editManager) {
        this._editManager.historyManager.handle(event);
      }
    } else if ("onCustomToolbarItemTapped" in event.nativeEvent) {
      if (this.props.onCustomToolbarItemTapped) {
        this.props.onCustomToolbarItemTapped(
          event.nativeEvent.onCustomToolbarItemTapped
        );
      }
    } else if ("onSearchBackButtonTapped" in event.nativeEvent) {
      if (this.props.onSearchBackButtonTapped) {
        this.props.onSearchBackButtonTapped();
      }
    } else if ("onAddWatermarkDialogDismissed" in event.nativeEvent) {
      if (this.props.onAddWatermarkDialogDismissed) {
        this.props.onAddWatermarkDialogDismissed();
      }
    } else if ("onAnnotationStyleDialogDismissed" in event.nativeEvent) {
      if (this.props.onAnnotationStyleDialogDismissed) {
        this.props.onAnnotationStyleDialogDismissed(
          event.nativeEvent.onAnnotationStyleDialogDismissed
        );
      }
    } else if ("onFormStyleDialogDismissed" in event.nativeEvent) {
      if (this.props.onFormStyleDialogDismissed) {
        this.props.onFormStyleDialogDismissed(
          event.nativeEvent.onFormStyleDialogDismissed
        );
      }
    } else if ("onContentEditorStyleDialogDismissed" in event.nativeEvent) {
      if (this.props.onContentEditorStyleDialogDismissed) {
        this.props.onContentEditorStyleDialogDismissed(
          event.nativeEvent.onContentEditorStyleDialogDismissed
        );
      }
    } else if ("annotationsCreated" in event.nativeEvent) {
      this._triggerEvent(
        "annotationsCreated",
        CPDFAnnotationFactory.create(event.nativeEvent.annotationsCreated)
      );
    } else if ("pencilDrawingCompleted" in event.nativeEvent) {
      this._triggerEvent(
        "pencilDrawingCompleted",
        event.nativeEvent.pencilDrawingCompleted
      );
    } else if ("pencilDrawingDiscarded" in event.nativeEvent) {
      this._triggerEvent(
        "pencilDrawingDiscarded",
        event.nativeEvent.pencilDrawingDiscarded
      );
    } else if ("annotationsSelected" in event.nativeEvent) {
      this._triggerEvent(
        "annotationsSelected",
        CPDFAnnotationFactory.create(event.nativeEvent.annotationsSelected)
      );
    } else if ("annotationsDeselected" in event.nativeEvent) {
      this._triggerEvent(
        "annotationsDeselected",
        CPDFAnnotationFactory.create(event.nativeEvent.annotationsDeselected)
      );
    } else if ("formFieldsCreated" in event.nativeEvent) {
      this._triggerEvent(
        "formFieldsCreated",
        CPDFWidgetFactory.create(
          event.nativeEvent.formFieldsCreated
        )
      );
    } else if ("formFieldsSelected" in event.nativeEvent) {
      this._triggerEvent(
        "formFieldsSelected",
        CPDFWidgetFactory.create(
          event.nativeEvent.formFieldsSelected
        )
      );
    } else if ("formFieldsDeselected" in event.nativeEvent) {
      this._triggerEvent(
        "formFieldsDeselected",
        CPDFWidgetFactory.create(
          event.nativeEvent.formFieldsDeselected
        )
      );
    } else if ("editorSelectionSelected" in event.nativeEvent) {
      this._triggerEvent(
        "editorSelectionSelected",
        CPDFEditArea.create(event.nativeEvent.editorSelectionSelected)
      );
    } else if ("editorSelectionDeselected" in event.nativeEvent) {
      const editAreaData = event.nativeEvent.editorSelectionDeselected;
      this._triggerEvent(
        "editorSelectionDeselected",
        editAreaData ? CPDFEditArea.create(editAreaData) : null
      );
    } else if ("onCustomContextMenuItemTapped" in event.nativeEvent) {
      if (this.props.onCustomContextMenuItemTapped) {
        const data = event.nativeEvent.onCustomContextMenuItemTapped;
        const { identifier, ...rest } = data;

        // Convert data values to corresponding data classes
        const eventData: Record<string, any> = {};

        for (const [key, value] of Object.entries(rest)) {
          switch (key) {
            case "rect":
              eventData[key] = value as CPDFRectF;
              break;
            case "annotation":
              eventData[key] = CPDFAnnotationFactory.create(value);
              break;
            case "widget":
              eventData[key] = CPDFWidgetFactory.create(value);
              break;
            case "editArea":
              eventData[key] = CPDFEditArea.create(value);
              break;
            case "point":
              eventData[key] = value;
              break;
            default:
              eventData[key] = value;
              break;
          }
        }

        this.props.onCustomContextMenuItemTapped(identifier, eventData);
      }
    } else if ("onAnnotationCreationPrepared" in event.nativeEvent) {
      if (this.props.onAnnotationCreationPrepared) {
        const data = event.nativeEvent.onAnnotationCreationPrepared;
        const type = safeParseEnumValue(
          data.type,
          Object.values(CPDFAnnotationType),
          CPDFAnnotationType.UNKNOWN
        );
        const annotation = data.annotation
          ? CPDFAnnotationFactory.create(data.annotation)
          : null;
        this.props.onAnnotationCreationPrepared(type, annotation);
      }
    } else if ("onInterceptAnnotationAction" in event.nativeEvent) {
      if (this.props.onInterceptAnnotationActionCallback) {
        const data = event.nativeEvent.onInterceptAnnotationAction;
        const annotation = CPDFAnnotationFactory.create(data);
        this.props.onInterceptAnnotationActionCallback(annotation);
      }
    } else if ("onInterceptWidgetAction" in event.nativeEvent) {
      if (this.props.onInterceptWidgetActionCallback) {
        const data = event.nativeEvent.onInterceptWidgetAction;
        const widget = CPDFWidgetFactory.create(data);
        this.props.onInterceptWidgetActionCallback(widget);
      }
    }
  };

  /**
   * Save the document and return whether it is saved successfully.
   * @example
   * const saveResult = await pdfReaderRef.current.save();
   *
   * @returns true or false
   * @group Document Lifecycle
   */
  save = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.save(tag);
    }
    return Promise.resolve(false);
  };

  /**
   * Set the reading area spacing.
   * @example
   * await pdfReaderRef.current?.setMargins(10,10,10,10);
   *
   * @param left The left reading-area margin.
   * @param top The top reading-area margin.
   * @param right The right reading-area margin.
   * @param bottom The bottom reading-area margin.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setMargins = (
    left: number,
    top: number,
    right: number,
    bottom: number
  ): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setMargins(tag, [left, top, right, bottom]);
    }
    return Promise.resolve();
  };

  /**
   *
   * @deprecated Use `_pdfDocument.removeAllAnnotations()` instead.
   *
   * Delete all comments in the current document
   * @example
   * const removeResult = await pdfReaderRef.current?.removeAllAnnotations();
   *
   * @returns A promise that resolves to `true` when all annotations are removed; otherwise, `false`.
   * @group Deprecated
   */
  removeAllAnnotations = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.removeAllAnnotations(tag);
    }
    return Promise.resolve(false);
  };

  /**
   *
   * @deprecated Use `_pdfDocument.importAnnotations()` instead.
   *
   * Imports annotations from the specified XFDF file into the current PDF document.
   * @example
   * // Android - assets file
   * const testXfdf = 'file:///android_asset/test.xfdf';
   * const importResult = await pdfReaderRef.current?.importAnnotations(testXfdf);
   *
   * // Android - file path
   * const testXfdf = '/data/user/0/com.compdfkit.reactnative.example/xxx/xxx.xfdf';
   * const importResult = await pdfReaderRef.current?.importAnnotations(testXfdf);
   *
   * // Android - Uri
   * const xfdfUri = 'content://xxxx'
   * const importResult = await pdfReaderRef.current?.importAnnotations(xfdfUri);
   *
   * // iOS
   *
   *
   *
   * @param xfdfFile Path of the XFDF file to be imported.
   * @returns true if the import is successful; otherwise, false.
   * @group Deprecated
   */
  importAnnotations = (xfdfFile: string): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.importAnnotations(tag, xfdfFile);
    }
    return Promise.resolve(false);
  };

  /**
   *
   * @deprecated Use `_pdfDocument.exportAnnotations()` instead.
   *
   * Exports annotations from the current PDF document to an XFDF file.
   *
   * @example
   * const exportXfdfFilePath = await pdfReaderRef.current?.exportAnnotations();
   *
   * @returns The path of the XFDF file if export is successful; an empty string if the export fails.
   * @group Deprecated
   */
  exportAnnotations = (): Promise<string> => {
    return this._pdfDocument.exportAnnotations();
  };

  /**
   * Jump to the index page.
   *
   * @example
   * await pdfReaderRef.current?.setDisplayPageIndex(1);
   *
   * @param pageIndex The index of the page to jump.
   * @param options Options for page display
   * @param options.rectList The rects to be visible in the page. The rect is in PDF coordinate system.
   * @returns A promise that resolves when the operation completes.
   * @group Navigation
   */
  setDisplayPageIndex = (
    pageIndex: number,
    options: { rectList?: CPDFRectF[] } = {}
  ): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      const { rectList = [] } = options;
      return CPDFViewManager.setDisplayPageIndex(tag, pageIndex, rectList);
    }
    return Promise.resolve();
  };

  /**
   * get current page index
   *
   * @example
   * const pageIndex = await pdfReaderRef.current?.getCurrentPageIndex();
   *
   * @returns A promise that resolves to the current zero-based page index.
   * @group Navigation
   */
  getCurrentPageIndex = (): Promise<number> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.getCurrentPageIndex(tag);
    }
    return Promise.resolve(0);
  };

  /**
   * @deprecated Use `_pdfDocument.hasChange()` instead.
   *
   * Checks whether the document has been modified
   *
   * @example
   * const hasChange = await pdfReaderRef.current?.hasChange();
   *
   * @returns {Promise<boolean>} Returns a Promise indicating if the document has been modified.
   *          `true`: The document has been modified,
   *          `false`: The document has not been modified.
   *          If the native view reference cannot be found, a rejected Promise will be returned.
   * @group Document Lifecycle
   */
  hasChange = (): Promise<boolean> => {
    return this._pdfDocument.hasChange();
  };

  /**
   * Set the page scale
   * Value Range: 1.0~5.0
   *
   * @example
   * await pdfReaderRef.current?.setScale(2.0);
   *
   * @param scale The zoom scale to apply.
   * @returns Returns a Promise.
   * @group View Settings
   */
  setScale = (scale: number): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setScale(tag, scale);
    }
    return Promise.resolve();
  };

  /**
   * Get the current page scale
   *
   * @example
   * const scale = await pdfReaderRef.current?.getScale();
   *
   * @returns Returns the zoom ratio of the current page.
   * @group View Settings
   */
  getScale = (): Promise<number> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.getScale(tag);
    }
    return Promise.resolve(1);
  };

  /**
   * Whether allow to scale.
   * Default : true
   *
   * @example
   * await pdfReaderRef.current?.setCanScale(false);
   *
   * @param canScale Whether pinch-to-zoom is enabled.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setCanScale = (canScale: boolean): Promise<void> => {
    if (Platform.OS != "android") {
      return Promise.reject(
        "setCanScale() method only support Android platform."
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setCanScale(tag, canScale);
    }
    return Promise.resolve();
  };

  /**
   * Sets background color of reader.
   * The color of each document space will be set to 75% of [color] transparency
   * @example
   * await pdfReaderRef.current?.setReadBackgroundColor(CPDFThemes.LIGHT);
   *
   * @param theme The reading background theme to apply.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setReadBackgroundColor = (theme: CPDFThemes): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      let color: string;
      switch (theme) {
        case CPDFThemes.LIGHT:
          color = "#FFFFFF";
          break;
        case CPDFThemes.DARK:
          color = "#000000";
          break;
        case CPDFThemes.SEPIA:
          color = "#FFEFBE";
          break;
        case CPDFThemes.RESEDA:
          color = "#CDE6D0";
          break;
        default:
          color = "#FFFFFF";
      }
      return CPDFViewManager.setReadBackgroundColor(tag, {
        displayMode: theme,
        color: color,
      });
    }
    return Promise.resolve();
  };

  /**
   * Set the background color of the reader.
   * @param color The background color to set (in hex format).
   * @example
   * await pdfReaderRef.current?.setBackgroundColor('#285BA8FF');
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setBackgroundColor = (color: string): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      const argbColor = normalizeColorToARGB(color);
      return CPDFViewManager.setBackgroundColor(tag, argbColor);
    }
    return Promise.resolve();
  };

  /**
   * Get background color of reader.
   *
   * @example
   * CPDFThemes theme = await pdfReaderRef.current?.getReadBackgroundColor();
   * @returns A promise that resolves to the current reading background theme.
   * @group View Settings
   */
  getReadBackgroundColor = async (): Promise<CPDFThemes> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      var themesColor: string = await CPDFViewManager.getReadBackgroundColor(
        tag
      );
      let theme: CPDFThemes;
      switch (themesColor) {
        case "#FFFFFFFF":
          theme = CPDFThemes.LIGHT;
          break;
        case "#FF000000":
          theme = CPDFThemes.DARK;
          break;
        case "#FFFFEFBE":
          theme = CPDFThemes.SEPIA;
          break;
        case "#FFCDE6D0":
          theme = CPDFThemes.RESEDA;
          break;
        default:
          theme = CPDFThemes.LIGHT;
      }
      return Promise.resolve(theme);
    }
    return Promise.resolve(CPDFThemes.LIGHT);
  };

  /**
   * Sets whether to display highlight Form Field.
   * @example
   * await pdfReaderRef.current?.setFormFieldHighlight(true);
   * @param isFormFieldHighlight true to display highlight Form Field.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setFormFieldHighlight = (isFormFieldHighlight: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setFormFieldHighlight(tag, isFormFieldHighlight);
    }
    return Promise.resolve();
  };

  /**
   * Whether to display highlight Form Field.
   * @example
   * const isFormFieldHighlight = await pdfReaderRef.current?.isFormFieldHighlight();
   * @returns A promise that resolves to whether form field highlighting is enabled.
   * @group View Settings
   */
  isFormFieldHighlight = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.isFormFieldHighlight(tag);
    }
    return Promise.resolve(false);
  };

  /**
   * Sets whether to display highlight Link.
   * @example
   * await pdfReaderRef.current?.setLinkHighlight(true);
   * @param isLinkHighlight Whether to highlight Link.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setLinkHighlight = (isLinkHighlight: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setLinkHighlight(tag, isLinkHighlight);
    }
    return Promise.resolve();
  };

  /**
   * Whether to display highlight Link.
   * @example
   * const isLinkHighlight = await pdfReaderRef.current?.isLinkHighlight();
   * @returns A promise that resolves to whether link highlighting is enabled.
   * @group View Settings
   */
  isLinkHighlight = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.isLinkHighlight(tag);
    }
    return Promise.resolve(false);
  };

  /**
   * Sets whether it is vertical scroll mode.
   * @example
   * await pdfReaderRef.current?.setVerticalMode(true);
   * @param isVerticalMode Whether it is vertical scroll mode.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setVerticalMode = (isVerticalMode: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setVerticalMode(tag, isVerticalMode);
    }
    return Promise.resolve();
  };

  /**
   * Whether it is vertical scroll mode.
   * @example
   * await pdfReaderRef.current?.isVerticalMode();
   * @returns A promise that resolves to whether vertical scrolling is enabled.
   * @group View Settings
   */
  isVerticalMode = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.isVerticalMode(tag);
    }
    return Promise.resolve(false);
  };

  /**
   * Sets the spacing between pages. This method is supported only on the [Android] platform.
   * - For the [iOS] platform, use the [setMargins] method instead.
   * The spacing between pages is equal to the value of [CPDFEdgeInsets.top].
   * @example
   * await pdfReaderRef.current?.setPageSpacing(10);
   * @param pageSpacing The space between pages, in pixels.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setPageSpacing = (pageSpacing: number): Promise<void> => {
    if (Platform.OS === "ios") {
      return Promise.reject(
        "This method is not supported on iOS, only supported on Android"
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setPageSpacing(tag, pageSpacing);
    }
    return Promise.resolve();
  };

  /**
   * Sets whether it is continuous scroll mode.
   * @example
   * await pdfReaderRef.current?.setContinueMode(true);
   * @param isContinueMode Whether it is continuous scroll mode.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setContinueMode = (isContinueMode: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setContinueMode(tag, isContinueMode);
    }
    return Promise.resolve();
  };

  /**
   * Whether it is continuous scroll mode.
   * @example
   * await pdfReaderRef.current?.isContinueMode();
   * @returns A promise that resolves to whether continuous scrolling is enabled.
   * @group View Settings
   */
  isContinueMode = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.isContinueMode(tag);
    }
    return Promise.resolve(true);
  };

  /**
   * Sets whether it is double page mode.
   * @example
   * await pdfReaderRef.current?.setDoublePageMode(true);
   * @param isDoublePageMode Whether it is double page mode.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setDoublePageMode = (isDoublePageMode: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setDoublePageMode(tag, isDoublePageMode);
    }
    return Promise.resolve();
  };

  /**
   * Whether it is double page mode.
   * @example
   * await pdfReaderRef.current?.isDoublePageMode();
   * @returns Returns `true` if double page display is enabled, otherwise returns `false`
   * @group View Settings
   */
  isDoublePageMode = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.isDoublePageMode(tag);
    }
    return Promise.resolve(false);
  };

  /**
   * Sets whether it is cover page mode.
   * @example
   * await pdfReaderRef.current?.setCoverPageMode(true);
   * @param isCoverPageMode Whether to display the document in cover form
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setCoverPageMode = (isCoverPageMode: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setCoverPageMode(tag, isCoverPageMode);
    }
    return Promise.resolve();
  };

  /**
   * Whether it is cover page mode.
   * @example
   * await pdfReaderRef.current?.isCoverPageMode();
   * @returns Returns `true` if the document cover is displayed, otherwise returns `false`
   * @group View Settings
   */
  isCoverPageMode = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.isCoverPageMode(tag);
    }
    return Promise.resolve(false);
  };
  /**
   * Sets whether it is crop mode.
   * @example
   * await pdfReaderRef.current?.setCropMode(true);
   * @param isCropMode Whether it is crop mode.
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setCropMode = (isCropMode: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setCropMode(tag, isCropMode);
    }
    return Promise.resolve();
  };
  /**
   * Whether it is crop mode.
   * @example
   * await pdfReaderRef.current?.isCropMode();
   * @returns Returns `true` if the current mode is clipping mode, otherwise returns `false`
   * @group View Settings
   */
  isCropMode = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.isCropMode(tag);
    }
    return Promise.resolve(false);
  };

  /**
   * In the single page mode, set whether all pages keep the same width
   * and the original page keeps the same width as readerView.
   *
   * @example
   * await pdfReaderRef.current?.setPageSameWidth(true);
   *
   * @param isPageSameWidth true: All pages keep the same width, the original state keeps the same width as readerView; false: Show in the actual width of page
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setPageSameWidth = (isPageSameWidth: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setPageSameWidth(tag, isPageSameWidth);
    }
    return Promise.resolve();
  };

  /**
   * Gets whether the specified [pageIndex] is displayed on the screen
   * @example
   * const isPageInScreen = await pdfReaderRef.current?.isPageInScreen(1);
   * @param pageIndex The zero-based page index to check.
   * @returns A promise that resolves to whether the specified page is currently visible.
   * @group View Settings
   */
  isPageInScreen = (pageIndex: number): Promise<boolean> => {
    if (Platform.OS === "ios") {
      return Promise.reject(
        "This method is not supported on iOS, only supported on Android"
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.isPageInScreen(tag, pageIndex);
    }
    return Promise.resolve(false);
  };

  /**
   * Sets whether to fix the position of the non-swipe direction when zooming in for reading.
   * @example
   * await pdfReaderRef.current?.setFixedScroll(true);
   * @param isFixedScroll Whether to fix scrolling
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setFixedScroll = (isFixedScroll: boolean): Promise<void> => {
    if (Platform.OS != "android") {
      return Promise.reject(
        "setFixedScroll() method only support Android platform"
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setFixedScroll(tag, isFixedScroll);
    }
    return Promise.resolve();
  };

  /**
   * Switch the mode displayed by the current CPDFReaderWidget.
   * Please see [CPDFViewMode] for available modes.
   *
   * @example
   * await pdfReaderRef.current?.setViewMode(CPDFViewMode.VIEWER);
   * @param viewMode The view mode to display
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  setViewMode = (viewMode: CPDFViewMode): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setPreviewMode(tag, viewMode);
    }
    return Promise.resolve();
  };

  /**
   * @deprecated Use setViewMode() instead.
   * @group Deprecated
   */
  setPreviewMode = (viewMode: CPDFViewMode): Promise<void> => {
    return this.setViewMode(viewMode);
  };

  /**
   * Get the currently displayed mode.
   * @example
   * const mode = await pdfReaderRef.current?.getViewMode();
   * @returns A promise that resolves to the current view mode.
   * @group View Settings
   */
  getViewMode = async (): Promise<CPDFViewMode> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      var modeStr = await CPDFViewManager.getPreviewMode(tag);
      for (const key in CPDFViewMode) {
        if (CPDFViewMode[key as keyof typeof CPDFViewMode] === modeStr) {
          return Promise.resolve(
            CPDFViewMode[key as keyof typeof CPDFViewMode]
          );
        }
      }
    }
    return Promise.resolve(CPDFViewMode.VIEWER);
  };

  /**
   * @deprecated Use getViewMode() instead.
   * @group Deprecated
   */
  getPreviewMode = async (): Promise<CPDFViewMode> => {
    return this.getViewMode();
  };

  /**
   * Displays the thumbnail view. When [editMode] is `true`,
   * the page enters edit mode, allowing operations such as insert, delete, extract, etc.
   *
   * @example
   * await pdfReaderRef.current?.showThumbnailView(true);
   *
   * @param editMode Whether to enable edit mode
   * @returns A promise that resolves when the operation completes.
   * @group Navigation
   */
  showThumbnailView = (editMode: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showThumbnailView(tag, editMode);
    }
    return Promise.resolve();
  };

  /**
   * Displays the BOTA view, which includes the document outline, bookmarks, and annotation list.
   *
   * @example
   * await pdfReaderRef.current?.showBotaView();
   *
   * @returns A promise that resolves when the operation completes.
   * @group Navigation
   */
  showBotaView = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showBotaView(tag);
    }
    return Promise.resolve();
  };

  /**
   * Displays the "Add Watermark" view, where users can add watermarks to the document.
   *
   * @example
   * await pdfReaderRef.current?.showAddWatermarkView();
   *
   * @returns A promise that resolves when the operation completes.
   * @group Dialogs and UI
   */
  showAddWatermarkView = (config?: CPDFWatermarkConfig): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      const defaultConfig = new CPDFWatermarkConfig();
      return CPDFViewManager.showAddWatermarkView(tag, {
        ...defaultConfig,
        ...config,
      });
    }
    return Promise.resolve();
  };

  /**
   * Displays the document security settings view, allowing users to configure document security options.
   *
   * @example
   * await pdfReaderRef.current?.showSecurityView();
   *
   * @returns A promise that resolves when the operation completes.
   * @group Dialogs and UI
   */
  showSecurityView = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showSecurityView(tag);
    }
    return Promise.resolve();
  };

  /**
   * Displays the display settings view, where users can configure options such as scroll direction, scroll mode, and themes.
   *
   * @example
   * await pdfReaderRef.current?.showDisplaySettingView();
   *
   * @returns A promise that resolves when the operation completes.
   * @group Dialogs and UI
   */
  showDisplaySettingView = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showDisplaySettingView(tag);
    }
    return Promise.resolve();
  };

  /**
   * Displays the document information view, where users can inspect document metadata.
   *
   * @example
   * await pdfReaderRef.current?.showDocumentInfoView();
   *
   * @returns A promise that resolves when the operation completes.
   * @group Dialogs and UI
   */
  showDocumentInfoView = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showDocumentInfoView(tag);
    }
    return Promise.resolve();
  };

  /**
   * Enters snip mode, allowing users to capture screenshots.
   *
   * @example
   * await pdfReaderRef.current?.enterSnipMode();
   *
   * @returns A promise that resolves when the operation completes.
   * @group Dialogs and UI
   */
  enterSnipMode = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.enterSnipMode(tag);
    }
    return Promise.resolve();
  };

  /**
   * Exits snip mode, stopping the screenshot capture.
   *
   * @example
   * await pdfReaderRef.current?.exitSnipMode();
   *
   * @returns A promise that resolves when the operation completes.
   * @group Dialogs and UI
   */
  exitSnipMode = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.exitSnipMode(tag);
    }
    return Promise.resolve();
  };

  /**
   * Reloads all pages in the readerview.
   * @returns A promise that resolves when the operation completes.
   * @group Document Lifecycle
   */
  reloadPages = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.reloadPages(tag);
    }
    return Promise.resolve();
  };

  /**
   * Reloads all pages while preserving the current reading position.
   *
   * On Android, this keeps the current viewport anchored to the same visual position
   * after the refresh. For example, if the viewer is currently showing page 2 at about
   * 20% scroll progress, the same position remains visible after reloading.
   * On iOS, this falls back to `reloadPages()` because the native implementation does
   * not expose a position-preserving reload path.
   * @returns A promise that resolves when the operation completes.
   * @group Document Lifecycle
   */
  reloadPagesPreservingPosition = (): Promise<void> => {
    if (Platform.OS === "ios") {
      return this.reloadPages();
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.reloadPages2(tag);
    }
    return Promise.resolve();
  };

  /**
   * @deprecated Use reloadPagesPreservingPosition() instead.
   * @group Deprecated
   */
  reloadPages2 = (): Promise<void> => {
    return this.reloadPagesPreservingPosition();
  };

  /**
   * Used to add a specified annotation type when touching the page in annotation mode
   * This method is only available in [CPDFViewMode.ANNOTATIONS] mode.
   * @param type The type of annotation mode to set.
   *
   * @example
   * await pdfReaderRef.current?.setAnnotationMode(CPDFAnnotationType.HIGHLIGHT);
   *
   * @returns A promise that resolves when the operation completes.
   * @group Annotations
   */
  setAnnotationMode = async (type: CPDFAnnotationType): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      if ((await this.getViewMode()) != CPDFViewMode.ANNOTATIONS) {
        return Promise.reject(
          "setAnnotationMode() method only support CPDFViewMode.ANNOTATIONS mode"
        );
      }
      return CPDFViewManager.setAnnotationMode(tag, type);
    }
    return Promise.resolve();
  };

  /**
   * Get the type of annotation added to the current touch page.
   * This method is only available in [CPDFViewMode.ANNOTATIONS] mode.
   *
   * @example
   * const annotationMode = await pdfReaderRef.current?.getAnnotationMode();
   *
   * @returns A promise that resolves to the current annotation mode.
   * @group Annotations
   */
  getAnnotationMode = async (): Promise<CPDFAnnotationType> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag) {
      return CPDFViewManager.getAnnotationMode(tag);
    }
    return Promise.resolve(CPDFAnnotationType.UNKNOWN);
  };

  /**
   * set current form creation mode.
   * This method is only available in [CPDFViewMode.FORMS] mode.
   * @example
   * await pdfReaderRef.current?.setFormCreationMode(CPDFWidgetType.TEXT_FIELD);
   * @param type The type of form field to create.
   * @returns A promise that resolves when the operation completes.
   * @group Forms
   */
  setFormCreationMode = async (type: CPDFWidgetType): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      if ((await this.getViewMode()) != CPDFViewMode.FORMS) {
        return Promise.reject(
          "setFormCreationMode() method only support CPDFViewMode.FORMS mode"
        );
      }
      return CPDFViewManager.setFormCreationMode(tag, type);
    }
    return Promise.resolve();
  };

  /**
   * get current form creation mode.
   * This method is only available in [CPDFViewMode.FORMS] mode.
   * @example
   * const formCreationMode = await pdfReaderRef.current?.getFormCreationMode();
   * @returns get current form creation mode.
   * @group Forms
   */
  getFormCreationMode = (): Promise<CPDFWidgetType> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag) {
      return CPDFViewManager.getFormCreationMode(tag);
    }
    return Promise.resolve(CPDFWidgetType.UNKNOWN);
  };

  /**
   * Exits form creation mode.
   * This method is only available in [CPDFViewMode.FORMS] mode.
   * @example
   * await pdfReaderRef.current?.exitFormCreationMode();
   * @returns A promise that resolves when the operation completes.
   * @group Forms
   */
  exitFormCreationMode = (): Promise<void> => {
    return this.setFormCreationMode(CPDFWidgetType.UNKNOWN);
  };

  /**
   * Verify the digital signature status of the document.
   * If the document contains a digital signature, a status bar will be displayed at the top of the document.
   * @example
   * await pdfReaderRef.current?.verifyDigitalSignatureStatus();
   * @returns A promise that resolves when the operation completes.
   * @group Digital Signatures
   */
  verifyDigitalSignatureStatus = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.verifyDigitalSignatureStatus(tag);
    }
    return Promise.resolve();
  };

  /**
   * Hide the digital signature status view.
   * @example
   * await pdfReaderRef.current?.hideDigitalSignStatusView();
   * @returns A promise that resolves when the operation completes.
   * @group Digital Signatures
   */
  hideDigitalSignStatusView = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.hideDigitalSignStatusView(tag);
    }
    return Promise.resolve();
  };

  /**
   * Clear the display area, making it completely white without displaying any content.
   * @example
   * await pdfReaderRef.current?.clearDisplayRect();
   * @returns A promise that resolves when the operation completes.
   * @group View Settings
   */
  clearDisplayRect = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.clearDisplayRect(tag);
    }
    return Promise.resolve();
  };

  /**
   * Dismiss the context menu if it is displayed.
   * @example
   * await pdfReaderRef.current?.dismissContextMenu();
   * @returns Dismiss the context menu if it is displayed.
   * @group Dialogs and UI
   */
  dismissContextMenu = (): Promise<void> => {
    if (Platform.OS === "ios") {
      return Promise.reject(
        "This method is not supported on iOS, only supported on Android"
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.dismissContextMenu(tag);
    }
    return Promise.resolve();
  };

  /**
   * Show the search text view.
   * @example
   * await pdfReaderRef.current?.showSearchTextView();
   * @returns Show the search text view.
   * @group Navigation
   */
  showSearchTextView = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showSearchTextView(tag);
    }
    return Promise.resolve();
  };

  /**
   * Hide the search text view.
   * @example
   * await pdfReaderRef.current?.hideSearchTextView();
   * @returns Hide the search text view.
   * @group Navigation
   */
  hideSearchTextView = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.hideSearchTextView(tag);
    }
    return Promise.resolve();
  };

  /**
   * Save the current ink annotation.
   *
   * @example
   * await pdfReaderRef.current?.saveCurrentInk();
   * @returns A promise that resolves when the operation completes.
   * @group Annotations
   */
  saveCurrentInk = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.saveCurrentInk(tag);
    }
    return Promise.resolve();
  };

  /**
   * Save the current pencil annotation.
   *
   * @example
   * await pdfReaderRef.current?.saveCurrentPencil();
   * @returns A promise that resolves when the operation completes.
   * @group Annotations
   */
  saveCurrentPencil(): Promise<void> {
    if (Platform.OS === "android") {
      return Promise.reject(
        "saveCurrentPencil() method only support iOS platform."
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.saveCurrentPencil(tag);
    }
    return Promise.resolve();
  }

  /**
   * Sets whether annotations are visible.
   * @example
   * await pdfReaderRef.current?.setAnnotationsVisible(true);
   * @param visible whether annotations should be visible
   * @group Annotations
   */
  setAnnotationsVisible = (visible: boolean): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setAnnotationsVisible(tag, visible);
    }
    return Promise.resolve();
  };

  /**
   * Gets whether annotations are visible.
   * @example
   * const visible = await pdfReaderRef.current?.isAnnotationsVisible();
   * @returns {Promise<boolean>}
   * @group Annotations
   */
  isAnnotationsVisible = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.isAnnotationsVisible(tag);
    }
    return Promise.resolve(false);
  };

  /**
   * Displays the default properties panel for the specified annotation type.
   *
   * Only some annotation types are supported. Please refer to the documentation for the list of supported types.
   *
   * @example
   * await pdfReaderRef.current?.showDefaultAnnotationPropertiesView(CPDFAnnotationType.HIGHLIGHT);
   *
   * @param type The type of annotation for which to display the properties panel.
   * @returns A promise that resolves when the operation completes.
   * @group Annotations
   */
  showDefaultAnnotationPropertiesView = (
    type: CPDFAnnotationType
  ): Promise<void> => {
    const notSupportTypes: CPDFAnnotationType[] = [
      CPDFAnnotationType.INK_ERASER,
      CPDFAnnotationType.UNKNOWN,
      CPDFAnnotationType.SIGNATURE,
      CPDFAnnotationType.STAMP,
      CPDFAnnotationType.SOUND,
      CPDFAnnotationType.PICTURES,
      CPDFAnnotationType.LINK,
    ];

    if (notSupportTypes.includes(type)) {
      throw new Error(
        `This type: ${type} of annotation is not supported, please select another type.`
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showDefaultAnnotationPropertiesView(tag, type);
    }
    return Promise.resolve();
  };

  /**
   * Displays the properties panel for the specified annotation.
   *
   * Only some annotation types are supported. Please refer to the documentation for the list of supported types.
   *
   * @example
   * await pdfReaderRef.current?.showAnnotationPropertiesView(annotation);
   * @param annotation The annotation for which to display the properties panel.
   * @returns A promise that resolves when the operation completes.
   * @group Annotations
   */
  showAnnotationPropertiesView = (
    annotation: CPDFAnnotation
  ): Promise<void> => {
    const notSupportTypes: CPDFAnnotationType[] = [
      CPDFAnnotationType.INK_ERASER,
      CPDFAnnotationType.UNKNOWN,
      CPDFAnnotationType.SIGNATURE,
      CPDFAnnotationType.STAMP,
      CPDFAnnotationType.SOUND,
      CPDFAnnotationType.PICTURES,
      CPDFAnnotationType.LINK,
    ];
    if (notSupportTypes.includes(annotation.type)) {
      throw new Error(
        `This type: ${annotation.type} of annotation is not supported, please select another type.`
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showAnnotationPropertiesView(
        tag,
        annotation.toJSON()
      );
    }
    return Promise.resolve();
  };

  /**
   * Displays the properties panel for the specified form field widget.
   *
   * Only some widget types are supported. Please refer to the documentation for the list of supported types.
   *
   * @example
   * await pdfReaderRef.current?.showWidgetPropertiesView(widget);
   * @param widget The form widget whose properties or appearance will be updated.
   * @returns A promise that resolves when the operation completes.
   * @group Forms
   */
  showWidgetPropertiesView = (widget: CPDFWidget): Promise<void> => {
    if (
      widget.type === CPDFWidgetType.SIGNATURES_FIELDS ||
      widget.type === CPDFWidgetType.UNKNOWN
    ) {
      throw new Error(
        `This type: ${widget.type} of form field is not supported, please select another type.`
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showWidgetPropertiesView(tag, widget.toJSON());
    }
    return Promise.resolve();
  };

  /**
   * Displays the properties panel for the specified edit area.
   * support:
   * - CPDFEditType.TEXT
   * - CPDFEditType.IMAGE
   *
   * @example
   * await pdfReaderRef.current?.showEditAreaPropertiesView(editArea);
   *
   * @param editArea The edit area for which to display the properties panel.
   * @returns A promise that resolves when the operation completes.
   * @group Content Editing
   */
  showEditAreaPropertiesView = (editArea: CPDFEditArea): Promise<void> => {
    if (editArea.type === CPDFEditType.PATH) {
      throw new Error(
        `This type: ${editArea.type} of edit area is not supported, please select another type.`
      );
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.showEditAreaPropertiesView(tag, editArea.toJson());
    }
    return Promise.resolve();
  };

  /**
   * Pre-configure the next signature annotation to be inserted when the user taps the page.
   * only use in signature creation mode. [CPDFAnnotationType.signature]
   *
   * @example
   * // first enter signature creation mode
   * await controller.setAnnotationMode(CPDFAnnotationType.signature);
   *
   * // then prepare the signature image path
   * await controller.prepareNextSignature('/path/to/signature.png');
   *
   * // now, when the user taps the page, the signature will be inserted using the specified image
   * ```
   * @param signaturePath The local path of the signature image to insert.
   * @returns A promise that resolves when the operation completes.
   * @group Digital Signatures
   */
  prepareNextSignature = (signaturePath: string): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.prepareNextSignature(tag, signaturePath);
    }
    return Promise.resolve();
  };

  /**
   * Pre-configures the next stamp annotation to be inserted when the user taps on the page.
   *
   * @remarks
   * Call this method after entering stamp creation mode to specify which type of stamp
   * (image / standard / text) should be inserted on the next tap.
   *
   * Exactly **one** of `imagePath`, `standardStamp`, or `textStamp` must be provided.
   * Providing none or more than one will result in an error.
   *  
   * @param options An object containing exactly one of the following properties:
   * 
   * - imagePath
   * Path to an image stamp.
   * - Android: file path or drawable resource name
   * - iOS: file path or bundled image name
   * 
   * - standardStamp
   * Built-in standard stamp enum value (for example, `CPDFStandardStamp.Approved`).
   *
   * - textStamp
   * A `CPDFTextStamp` instance that defines custom text, colors, font size, and other properties.
   *
   * @returns A promise that resolves when the operation completes.
   * A `Promise<void>` that resolves when the native side has been notified.
   *
   * @throws
   * Throws an `Error` if the "exactly one parameter" rule is violated.
   * The error message is in English.
   *
   * @example
   * ```ts
   * // Prepares an image stamp for the next tap
   * await pdfReaderRef.current?.prepareNextStamp({ imagePath: '/path/to/stamp.png' });
   *
   * // Prepares a standard "Approved" stamp for the next tap
   * await pdfReaderRef.current?.prepareNextStamp({standardStamp: CPDFStandardStamp.Approved});
   *
   * // Prepares a custom text stamp for the next tap
   * await pdfReaderRef.current?.prepareNextStamp({
   *   textStamp: {
   *     content: "ComPDFKit",
   *     date: CPDFDateUtil.getTextStampDate({
   *       timeSwitch: true,
   *       dateSwitch: true,
   *     }),
   *     color: CPDFTextStampColor.blue,
   *     shape: CPDFTextStampShape.leftTriangle,
   *   },
   * });
   * ```
   * @group Annotations
   */
  prepareNextStamp = (options: CPDFPrepareNextStampOptions): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      if (options.imagePath != null) {
        return CPDFViewManager.prepareNextStamp(tag, {
          type: "image",
          imagePath: options.imagePath,
        });
      } else if (options.standardStamp != null) {
        return CPDFViewManager.prepareNextStamp(tag, {
          type: "standard",
          standardStamp: options.standardStamp,
        });
      } else if (options.textStamp != null) {
        return CPDFViewManager.prepareNextStamp(tag, {
          type: "text",
          textStamp: options.textStamp,
        });
      } else {
        return Promise.reject(
          "Either imagePath, standardStamp or textStamp must be provided."
        );
      }
    }
    return Promise.resolve();
  };

  /**
   * Pre-configure the next image annotation to be inserted when the user taps the page.
   * @param imagePath The path of the image to be used for the next image annotation.
   * @example
   * // first enter image creation mode
   * await pdfReaderRef.current?.setAnnotationMode(CPDFAnnotationType.PICTURES);
   *
   * // then prepare the image path
   * await pdfReaderRef.current?.prepareNextImage('/path/to/image.png');
   *
   * // now, when the user taps the page, the image annotation will be inserted using the specified image
   * ```
   * @returns A promise that resolves when the operation completes.
   * @group Annotations
   */
  prepareNextImage = (imagePath: string): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.prepareNextImage(tag, imagePath);
    }
    return Promise.resolve();
  };

  /**
   * Fetches the default annotation style.
   * Use this after the CPDFReaderView is initialized to retrieve the current default annotation style.
   *
   * @example
   * const defaultStyle = await pdfReaderRef.current?.fetchDefaultAnnotationStyle();
   * @returns The current default annotation style; returns an empty object if the native view is unavailable.
   * @group Annotations
   */
  fetchDefaultAnnotationStyle = (): Promise<CPDFAnnotationAttr> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.fetchDefaultAnnotationStyle(tag);
    }
    return Promise.resolve({});
  };

  /**
   * Updates the default annotation style.
   * When updating annotation styles, you can pass only the properties that need to be modified, and other properties will remain unchanged.
   * All HexColor values are normalized to ARGB before being sent to native.
   *
   * @example
   *  const noteAttr : CPDFTextAttr = {
   *     type: 'note',
   *     color: '#FF0000',
   *     alpha: 100
   *   }
   * await pdfReaderRef.current?.updateDefaultAnnotationStyle(noteAttr);
   * @param attr The annotation attributes to update.
   * @returns A promise that resolves when the operation completes.
   * @group Annotations
   */
  updateDefaultAnnotationStyle = (
    attr: CPDFAnnotationAttrUnion
  ): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      // Normalize hex colors to ARGB format
      const normalizedAttr = normalizeColorsInAnnotationAttr(attr);
      return CPDFViewManager.updateDefaultAnnotationStyle(tag, normalizedAttr);
    }
    return Promise.resolve();
  };

  /**
   * Fetches the default widget style.
   *
   * @example
   * const defaultWidgetStyle = await pdfReaderRef.current?.fetchDefaultWidgetStyle();
   * @returns The current default widget style; returns an empty object if the native view is unavailable.
   * @group Forms
   */
  fetchDefaultWidgetStyle(): Promise<CPDFWidgetAttr> {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.fetchDefaultWidgetStyle(tag);
    }
    return Promise.resolve({});
  }

  /**
   * Updates the default widget style.
   * When updating form fields, you can pass only the properties that need to be modified, and other properties will remain unchanged.
   * All HexColor values are normalized to ARGB before being sent to native.
   *
   *
   * @example
   * await pdfReaderRef.current?.updateDefaultWidgetStyle({
   *   type: 'textField',
   *   fillColor: '#DDE9FF',
   *   borderColor: '#1460F3'
   * });
   * @param attr The widget attributes to update.
   * @see CPDFTextFieldAttr
   * @see CPDFCheckBoxAttr
   * @see CPDFRadioButtonAttr
   * @see CPDFListBoxAttr
   * @see CPDFComboBoxAttr
   * @see CPDFPushButtonAttr
   * @see CPDFSignatureWidgetAttr
   * @returns A promise that resolves when the default widget style is updated.
   * @group Forms
   */
  updateDefaultWidgetStyle(
    attr:
      | CPDFTextFieldAttr
      | CPDFCheckBoxAttr
      | CPDFRadioButtonAttr
      | CPDFListBoxAttr
      | CPDFComboBoxAttr
      | CPDFPushButtonAttr
      | CPDFSignatureWidgetAttr
  ): Promise<void> {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      // Normalize hex colors to ARGB format
      const normalizedAttr = normalizeColorsInWidgetAttr(attr);
      return CPDFViewManager.updateDefaultWidgetStyle(tag, normalizedAttr);
    }
    return Promise.resolve();
  }



  /** @internal */
  render() {
    {
      return (
        <RCTCPDFReaderView
          ref={this._setNativeRef}
          style={{ flex: 1 }}
          onChange={this.onChange}
          {...this.props}
        />
      );
    }
  }
}

const RCTCPDFReaderView =
  requireNativeComponent<CPDFReaderViewProps>("RCTCPDFReaderView");
