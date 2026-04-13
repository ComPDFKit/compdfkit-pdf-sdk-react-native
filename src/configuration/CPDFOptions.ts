/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFAnnotation } from "../annotation/CPDFAnnotation";
import { CPDFTextStamp } from "../annotation/CPDFTextStamp";
import { CPDFWidget } from "../annotation/form/CPDFWidget";
import { CPDFEditArea } from "../edit/CPDFEditArea";


export const CPDFViewMode = {

    /**
     * Viewer mode, allows viewing PDF only, cannot edit annotations, forms, etc.
     */
    VIEWER: 'viewer',
    /**
     * Annotations mode, allows annotation editing
     */
    ANNOTATIONS: 'annotations',
    /**
     * Content editor mode, allows editing text, images of PDF document
     */
    CONTENT_EDITOR: 'contentEditor',
    /**
     * Forms mode, allows adding text fields, signature fields, list boxes, etc.
     */
    FORMS: 'forms',
    /**
     * Signatures mode, allows adding signature fields for electronic signing, digital signing, verifying digital signatures
     */
    SIGNATURES: 'signatures'

} as const
export type CPDFViewMode = ValueOf<typeof CPDFViewMode>;


/**
 * Toolbar actions supported in the displayed PDF view
 */
export const CPDFToolbarAction = {
  /**
   * Back button.
   *
   * Exits the current PDF view when clicked.
   * - On Android: always displayed at the far left of the toolbar.
   * - On iOS: displayed based on the configured toolbar position.
   */
  BACK: 'back',

  /**
   * Thumbnail list.
   *
   * Displays page thumbnails of the current document.
   */
  THUMBNAIL: 'thumbnail',

  /**
   * Text search.
   *
   * Provides keyword search functionality within the PDF document.
   */
  SEARCH: 'search',

  /**
   * BOTA panel.
   *
   * Displays related document navigation content:
   * - b: Bookmarks
   * - o: Outline
   * - t: Thumbnails
   * - a: Annotations
   */
  BOTA: 'bota',

  /**
   * Menu button.
   *
   * Opens the main toolbar menu.
   */
  MENU: 'menu',

  /**
   * View settings.
   *
   * Controls display-related options such as zoom mode,
   * page layout, and reading preferences.
   */
  VIEW_SETTINGS: 'viewSettings',

  /**
   * Document editor.
   *
   * Opens document editing features such as content editing
   * or annotation editing.
   */
  DOCUMENT_EDITOR: 'documentEditor',

  /**
   * Security settings.
   *
   * Opens security-related options such as password protection
   * and permission settings.
   */
  SECURITY: 'security',

  /**
   * Watermark management.
   *
   * Used to add, edit, or remove watermarks in the document.
   */
  WATERMARK: 'watermark',

  /**
   * Document information.
   *
   * Displays metadata and basic information of the PDF document.
   */
  DOCUMENT_INFO: 'documentInfo',

  /**
   * Save document.
   *
   * Saves changes made to the current document.
   */
  SAVE: 'save',

  /**
   * Share document.
   *
   * Opens the system share dialog to export or share the document.
   */
  SHARE: 'share',

  /**
   * Open document.
   *
   * Opens another PDF document.
   */
  OPEN_DOCUMENT: 'openDocument',

  /**
   * Flatten annotations.
   *
   * Merges annotations into the document content so they
   * can no longer be edited.
   */
  FLATTENED: 'flattened',

  /**
   * Snip tool.
   *
   * Allows capturing a selected area of the document.
   */
  SNIP: 'snip',

  /**
   * Custom toolbar action.
   *
   * Represents a user-defined toolbar action.
   */
  CUSTOM: 'custom',
} as const;
export type CPDFToolbarAction = ValueOf<typeof CPDFToolbarAction>;



/**
 * annotations type.
 * Please note that {@link PENCIL} is only available on ios platform.
 */
export const CPDFAnnotationType = {

    UNKNOWN: 'unknown',

    NOTE: 'note',

    HIGHLIGHT: 'highlight',

    UNDERLINE: 'underline',

    SQUIGGLY: 'squiggly',

    STRIKEOUT: 'strikeout',

    INK: 'ink',

    INK_ERASER: 'ink_eraser',

    /**
     * only ios platform.
     */
    PENCIL: "pencil",

    CIRCLE: 'circle',

    SQUARE: 'square',

    ARROW: 'arrow',

    LINE: 'line',

    FREETEXT: 'freetext',

    SIGNATURE: 'signature',

    STAMP: 'stamp',

    PICTURES: 'pictures',

    LINK: 'link',

    SOUND: 'sound'

} as const
export type CPDFAnnotationType = ValueOf<typeof CPDFAnnotationType>;

/**
  * {@link CPDFViewMode.ANNOTATIONS}, {@link CPDFViewMode.CONTENT_EDITOR},{@link CPDFViewMode.FORMS} function tools.
  * {@link CPDFConfigTool.SETTING} is not available in form functionality.
  *
  */
export const CPDFConfigTool = {
    /**
     * Set button, corresponding to open the selected annotation, text or picture property panel.
     */
    SETTING: 'setting',
    /**
     * Undo annotation, content editing, form operations
     */
    UNDO: 'undo',
    /**
     * Redo an undone action
     */
    REDO: 'redo'
} as const
export type CPDFConfigTool = ValueOf<typeof CPDFConfigTool>;


/**
 * Shape annotation border style, default {@link CPDFBorderStyle.SOLID}.
 * shape:
 * * {@link CPDFAnnotationType.SQUARE}
 * * {@link CPDFAnnotationType.CIRCLE}
 * * {@link CPDFAnnotationType.ARROW}
 * * {@link CPDFAnnotationType.LINE}
 */
export const CPDFBorderStyle = {

    SOLID: 'solid',

    DASHED: 'dashed'

} as const
export type CPDFBorderStyle = ValueOf<typeof CPDFBorderStyle>;

/**
 * Arrow annotation, start and tail shapes
 */
export const CPDFLineType = {
    NONE: 'none',
    UNKNOWN: 'unknown',
    OPEN_ARROW: 'openArrow',
    CLOSE_ARROW: 'closedArrow',
    SQUARE: 'square',
    CIRCLE: 'circle',
    DIAMOND: 'diamond'
}
export type CPDFLineType = ValueOf<typeof CPDFLineType>;

/**
 * text alignment
 */
export const CPDFAlignment = {
    LEFT: 'left',

    CENTER: 'center',

    RIGHT: 'right'
} as const
export type CPDFAlignment =  ValueOf<typeof CPDFAlignment>;

export const CPDFContentEditorType = {
    EDITOR_TEXT: 'editorText',
    EDITOR_IMAGE: 'editorImage'
}
export type CPDFContentEditorType =  ValueOf<typeof CPDFContentEditorType>;


/**
 * form types
 */
export const CPDFWidgetType = {

    TEXT_FIELD: 'textField',

    CHECKBOX: 'checkBox',

    RADIO_BUTTON: 'radioButton',

    LISTBOX: 'listBox',

    COMBOBOX: 'comboBox',

    SIGNATURES_FIELDS: 'signaturesFields',

    PUSH_BUTTON: 'pushButton',

    UNKNOWN: 'unknown'

} as const
export type CPDFWidgetType = ValueOf<typeof CPDFWidgetType>;



export const CPDFCheckStyle = {
    CHECK: 'check',
    CIRCLE: 'circle',
    CROSS:  'cross',
    DIAMOND: 'diamond',
    SQUARE: 'square',
    STAR: 'star'
}
export type CPDFCheckStyle = ValueOf<typeof CPDFCheckStyle>;

export const CPDFDisplayMode = {

    SINGLE_PAGE: 'singlePage',

    DOUBLE_PAGE: 'doublePage',

    COVER_PAGE: 'coverPage'
}
export type CPDFDisplayMode = ValueOf<typeof CPDFDisplayMode>;

export const CPDFThemes = {

    /**
     * Bright mode, readerview background is white
     */
    LIGHT: 'light',

    /**
     * dark mode, readerview background is black
     */
    DARK: 'dark',

    /**
     * brown paper color
     */
    SEPIA: 'sepia',

    /**
     * Light green, eye protection mode
     */
    RESEDA: 'reseda'

  }

export type CPDFThemes = ValueOf<typeof CPDFThemes>;

/**
 * Set UI theme modes, including light, dark, and follow system modes
 * Default: Follow system
 */
export const CPDFThemeMode = {

    /**
     * Light mode, with a primarily white UI
     */
    LIGHT: 'light',

    /**
     * Dark night mode, with a primarily black UI
     */
    DARK: 'dark',

    /**
     * Follow the current system setting
     */
    SYSTEM: 'system'
}
export type CPDFThemeMode = ValueOf<typeof CPDFThemeMode>;

/**
 * Represents the permissions available for the currently opened document.
 */
export const CPDFDocumentPermissions = {
    /**
     * No restrictions. The document does not have an open password or owner permission password.
     */
    NONE: 'none',

    /**
     * User permissions. The document can only be viewed and has an owner password set.
     */
    USER: 'user',

    /**
     * Owner permissions. The current viewer is identified as the owner of the document.
     */
    OWNER: 'owner',
};
export type CPDFDocumentPermissions = ValueOf<typeof CPDFDocumentPermissions>;

/**
 * Specifies the encryption algorithms supported for a PDF document.
 */
export const CPDFDocumentEncryptAlgo = {
    /**
     * RC4 encryption algorithm.
     */
    RC4: 'rc4',

    /**
     * AES 128-bit encryption algorithm.
     */
    AES128: 'aes128',

    /**
     * AES 256-bit encryption algorithm.
     */
    AES256: 'aes256',

    /**
     * Indicates that no encryption algorithm is applied.
     */
    NO_ENCRYPT_ALGO: 'noEncryptAlgo',
};

export type CPDFDocumentEncryptAlgo = ValueOf<typeof CPDFDocumentEncryptAlgo>;


export const CPDFBorderEffectType = {
    SOLID : 'solid',

    CLOUDY : 'cloudy',
}
export type CPDFBorderEffectType = ValueOf<typeof CPDFBorderEffectType>;

export const CPDFActionType = {
    UNKNOWN: 'unknown',
    GOTO: 'goTo',
    GOTOR: 'goToR',
    GOTOE: 'goToE',
    LAUNCH: 'launch',
    THREAD: 'thread',
    URI: 'uri',
    SOUND: 'sound',
    MOVIE: 'movie',
    HIDE: 'hide',
    NAMED: 'named',
    SUBMIT_FORM: 'submitForm',
    RESET_FORM: 'resetForm',
    IMPORT_DATA: 'importData',
    JAVASCRIPT: 'javaScript',
    SET_OCG_STATE: 'setOCGState',
    RENDITION: 'rendition',
    TRANS: 'trans',
    GOTO_3D_VIEW: 'goTo3DView',
    UOP: 'uop',
    ERROR: 'error',
} as const;
export type CPDFActionType = ValueOf<typeof CPDFActionType>;

/**
 * Used to configure the default signing method when signing in the form field of CPDFReaderView,
 *  including: digital signature, electronic signature, and manual selection
 */
export const CPDFSignatureType = {

    /**
     * Manually select the signature method. 
     * Configure this method. When you click the signature form field, 
     * a pop-up window will pop up to select the signature method.
     */
    MANUAL : 'manual',

    /**
     * Enter the digital signature process
     */
    DIGITAL : 'digital',
    
    /**
     * Enter the electronic signature process
     */
    ELECTRONIC : 'electronic',
} as const;
export type CPDFSignatureType = ValueOf<typeof CPDFSignatureType>;


export const CPDFUiVisibilityMode  = {

    /**
     * Always show UI
     */
    ALWAYS: 'always',

    /**
     * Auto hide UI, tap to show
     */
    AUTOMATIC: 'automatic',

    /**
     * Always hide UI, use gestures to show
     */
    NEVER: 'never'
} as const;
export type CPDFUiVisibilityMode = ValueOf<typeof CPDFUiVisibilityMode>;


export const CPDFBotaTabs = {

    BOOKMARKS: 'bookmark',

    OUTLINE: 'outline',

    ANNOTATIONS: 'annotations'
} as const;
export type CPDFBotaTabs = ValueOf<typeof CPDFBotaTabs>;

export const CPDFPageCompression = {

    JPEG: 'jpeg',

    PNG: 'png',
} as const;
export type CPDFPageCompression = ValueOf<typeof CPDFPageCompression>;

export interface CPDFAnnotationRenderOptions {
    scale?: number;

    targetWidth?: number;

    targetHeight?: number;

    compression?: CPDFPageCompression;

    quality?: number;
}


export const CPDFEditType = {
    NONE: 0,

    TEXT: 1,
    
    IMAGE: 2,

    PATH: 4
} as const;
export type CPDFEditType = ValueOf<typeof CPDFEditType>;


export const CPDFStandardStamp = {

    NOTAPPROVED: 'NotApproved',

    APPROVED: 'Approved',

    COMPLETED: 'Completed',
    
    FINAL_: 'Final',

    DRAFT: 'Draft',

    CONFIDENTIAL: 'Confidential',

    NOTFORPUBLICRELEASE: 'NotForPublicRelease',

    FORPUBLICRELEASE: 'ForPublicRelease',

    FORCOMMENT: 'ForComment',

    VOID_: 'Void',

    PRELIMINARYRESULTS: 'PreliminaryResults',

    INFORMATIONONLY: 'InformationOnly',

    ACCEPTED: 'Accepted',

    REJECTED: 'Rejected',

    WITNESS: 'Witness',

    INITIALHERE: 'InitialHere',

    SIGNHERE: 'SignHere',

    REVISED: 'Revised',

    PRIVATEACCEPTED: 'PrivateMark#1',

    PRIVATEREJECTED: 'PrivateMark#2',

    PRIVATERADIOMARK: 'PrivateMark#3',
    
    UNKNOWN: 'Unknown',
} as const;
export type CPDFStandardStamp = ValueOf<typeof CPDFStandardStamp>;

export const CPDFStampType = {

    UNKNOWN: 'unknown',

    STANDARD: 'standard',

    TEXT: 'text',

    IMAGE: 'image',
} as const;
export type CPDFStampType = ValueOf<typeof CPDFStampType>;



export const CPDFEvent = {
    /**
     * Fired when an annotation is created.
     * Data type: CPDFAnnotation and its subclasses.
     */
    ANNOTATIONS_CREATED: 'annotationsCreated',

    /**
     * Fired when an annotation is selected.
     * Data type: CPDFAnnotation and its subclasses.
     */
    ANNOTATIONS_SELECTED: 'annotationsSelected',

    /**
     * Fired when an annotation is deselected.
     * Data type: CPDFAnnotation and its subclasses.
     * Data may be null.
     */
    ANNOTATIONS_DESELECTED: 'annotationsDeselected',

    /**
     * Fired when a form field is created.
     * Data type: CPDFWidget and its subclasses.
     */
    FORM_FIELDS_CREATED: 'formFieldsCreated',

    /**
     * Fired when a form field is selected.
     * Data type: CPDFWidget and its subclasses.
     */
    FORM_FIELDS_SELECTED: 'formFieldsSelected',

    /**
     * Fired when a form field is deselected.
     * Data type: CPDFWidget and its subclasses.
     * Data may be null.
     */
    FORM_FIELDS_DESELECTED: 'formFieldsDeselected',

    /**
     * Fired when a content editor element is selected.
     * Data type: CPDFEditArea and its subclasses.
     * image: CPDFEditImageArea
     * text: CPDFEditTextArea
     */
    EDITOR_SELECTION_SELECTED: 'editorSelectionSelected',

    /**
     * Fired when a content editor element is deselected.
     * No data returned.
     */
    EDITOR_SELECTION_DESELECTED: 'editorSelectionDeselected',
} as const;
export type CPDFEvent = ValueOf<typeof CPDFEvent>;

/**
 * Event data type mapping for type-safe event listeners
 */
export interface CPDFEventDataMap {
  /**
   * Fired when an annotation is created.
   * Returns the created annotation instance.
   */
  [CPDFEvent.ANNOTATIONS_CREATED]: CPDFAnnotation;

  /**
   * Fired when an annotation is selected.
   * Returns the selected annotation instance.
   */
  [CPDFEvent.ANNOTATIONS_SELECTED]: CPDFAnnotation;

  /**
   * Fired when an annotation is deselected.
   * Returns the deselected annotation instance or null.
   */
  [CPDFEvent.ANNOTATIONS_DESELECTED]: CPDFAnnotation | null;

  /**
   * Fired when a form field is created.
   * Returns the created form widget instance.
   */
  [CPDFEvent.FORM_FIELDS_CREATED]: CPDFWidget;

  /**
   * Fired when a form field is selected.
   * Returns the selected form widget instance.
   */
  [CPDFEvent.FORM_FIELDS_SELECTED]: CPDFWidget;

  /**
   * Fired when a form field is deselected.
   * Returns the deselected form widget instance or null.
   */
  [CPDFEvent.FORM_FIELDS_DESELECTED]: CPDFWidget | null;

  /**
   * Fired when a content editor element is selected.
   * Returns the selected edit area instance (image or text).
   */
  [CPDFEvent.EDITOR_SELECTION_SELECTED]: CPDFEditArea;

  /**
   * Fired when a content editor element is deselected.
   * Returns the deselected edit area instance or null.
   */
  [CPDFEvent.EDITOR_SELECTION_DESELECTED]: CPDFEditArea | null;
}

export type CPDFPrepareNextStampOptions =
  | { imagePath: string; standardStamp?: never; textStamp?: never }
  | { imagePath?: never; standardStamp: CPDFStandardStamp; textStamp?: never }
  | { imagePath?: never; standardStamp?: never; textStamp: CPDFTextStamp };


export type AnyCase<T extends string> =
    string extends T ? string :
    T extends `${infer F1}${infer F2}${infer R}` ? (
        `${Uppercase<F1> | Lowercase<F1>}${Uppercase<F2> | Lowercase<F2>}${AnyCase<R>}`
    ) :
    T extends `${infer F}${infer R}` ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}` :
    "";

export type ValueOf<T> = T[keyof T];


/** @hidden */
type BuildPowersOf2LengthArrays<N extends number, R extends never[][]> =
  R[0][N] extends never ? R : BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>;

/** @hidden */
type ConcatLargestUntilDone<N extends number, R extends never[][], B extends never[]> =
  B["length"] extends N ? B : [...R[0], ...B][N] extends never
    ? ConcatLargestUntilDone<N, R extends [R[0], ...infer U] ? U extends never[][] ? U : never : never, B>
    : ConcatLargestUntilDone<N, R extends [R[0], ...infer U] ? U extends never[][] ? U : never : never, [...R[0], ...B]>;

/** @hidden */
type Replace<R extends any[], T> = { [K in keyof R]: T }

/** @hidden */
type TupleOf<T, N extends number> = number extends N ? T[] : {
  [K in N]:
  BuildPowersOf2LengthArrays<K, [[never]]> extends infer U ? U extends never[][]
  ? Replace<ConcatLargestUntilDone<K, U, []>, T> : never : never;
}[N]

/** @hidden */
type RangeOf<N extends number> = Partial<TupleOf<unknown, N>>["length"];

/** @hidden */
type RangeOf2<From extends number, To extends number> = Exclude<RangeOf<To>, RangeOf<From>> | From;

/** @hidden */
export type ColorAlpha = RangeOf2<0,255>

/** @hidden */
export type BorderWidth = RangeOf2<1, 10>

/** @hidden */
export type DashGap = RangeOf2<0.0, 10.0>

/** 
 * @hidden 
 * Represents hexadecimal color values.
 * Format: "#RRGGBB" or "#AARRGGBB"
 * @example "#FF0000" // Red
 * @example "#80FF0000" // Semi-transparent red
 */
export type HexColor = `#${string}`;

/**
 * @hidden 
 * Represents font size values.
 * Valid range: 0-100 points
 */
export type FontSize = RangeOf2<0,100>
