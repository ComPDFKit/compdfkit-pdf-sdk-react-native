/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */


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
     * Back button, exits the displayed PDF interface when clicked.
     * for Android platform, it will be shown only on the far left of the toolbar.
     * for iOS platform, it will be displayed according to the configuration position.
     */
    BACK: 'back',

    /**
     * Thumbnail list
     */
    THUMBNAIL: 'thumbnail',
    /**
     * PDF text search functionality
     */
    SEARCH: 'search',
    /**
     * Display related content in the PDF document
     *
     * b: Bookmark list
     * o: Outline list
     * t: Thumbnail list
     * a: Annotation list
     */
    BOTA: 'bota',
    /**
     * Menu button
     */
    MENU: 'menu'

} as const
export type CPDFToolbarAction = ValueOf<typeof CPDFToolbarAction>;

/**
 * Configure the menu options opened in the top toolbar {@link CPDFToolbarAction.MENU}
 *
 */
export const CPDFToolbarMenuAction = {

    /**
     * Open the settings view and set the scrolling direction,
     * display mode, theme color and other related settings for reading PDF.
     */
    VIEW_SETTINGS: 'viewSettings',

    /**
     * Open the document thumbnail list, and you can delete, rotate, and add document pages in the view.
     */
    DOCUMENT_EDITOR: 'documentEditor',

    /**
     * Open the document information view to display basic document information and permission information.
     */
    DOCUMENT_INFO: 'documentInfo',
    /**
     * Open the watermark editing view to add text and image watermarks and save them as a new document.
     */
    WATERMARK: 'watermark',
    /**
     * Open the security settings view, set the document opening password and set the permission password
     */
    SECURITY: 'security',
    /**
     * Flatten the annotations in the document, and the annotations will not be editable.
     */
    FLATTENED: 'flattened',
    /**
     * save pdf document.
     */
    SAVE: 'save',
    /**
     * Turn on system sharing function.
     */
    SHARE: 'share',
    /**
     * Open the system file selector and open a new pdf document.
     */
    OPEN_DOCUMENT: 'openDocument',

    /**
     * The PDF capture function allows you to capture an area
     * in the PDF document and convert it into an image.
     */
    SNIP: 'snip'

} as const
export type CPDFToolbarMenuAction = ValueOf<typeof CPDFToolbarMenuAction>;


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
    ARROW : 'arrow',
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


export const CPDFTypeface  = {
    COURIER: 'Courier',
    HELVETICA: 'Helvetica',
    TIMES_ROMAN: 'Times-Roman'
} as const
export type CPDFTypeface =  ValueOf<typeof CPDFTypeface>;


export const CPDFContentEditorType = {
    EDITOR_TEXT: 'editorText',
    EDITOR_IMAGE: 'editorImage'
}
export type CPDFContentEditorType =  ValueOf<typeof CPDFContentEditorType>;


/**
 * form types
 * @deprecated please use 'CPDFWidgetType' instead.
 */
export const CPDFFormType = {

    TEXT_FIELD: 'textField',

    CHECKBOX: 'checkBox',

    RADIO_BUTTON: 'radioButton',

    LISTBOX: 'listBox',

    COMBOBOX: 'comboBox',

    SIGNATURES_FIELDS: 'signaturesFields',

    PUSH_BUTTON: 'pushButton',

    UNKNOWN: 'unknown'

} as const
/**
 * @deprecated Please use `CPDFWidgetType` instead.
 */
export type CPDFFormType = ValueOf<typeof CPDFFormType>;
/** 
 * New widget type definition, recommended for use.
 */
export const CPDFWidgetType = { ...CPDFFormType } as const;

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

export type AnyCase<T extends string> =
    string extends T ? string :
    T extends `${infer F1}${infer F2}${infer R}` ? (
        `${Uppercase<F1> | Lowercase<F1>}${Uppercase<F2> | Lowercase<F2>}${AnyCase<R>}`
    ) :
    T extends `${infer F}${infer R}` ? `${Uppercase<F> | Lowercase<F>}${AnyCase<R>}` :
    "";

export type ValueOf<T> = T[keyof T];


type BuildPowersOf2LengthArrays<N extends number, R extends never[][]> =
  R[0][N] extends never ? R : BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>;

type ConcatLargestUntilDone<N extends number, R extends never[][], B extends never[]> =
  B["length"] extends N ? B : [...R[0], ...B][N] extends never
    ? ConcatLargestUntilDone<N, R extends [R[0], ...infer U] ? U extends never[][] ? U : never : never, B>
    : ConcatLargestUntilDone<N, R extends [R[0], ...infer U] ? U extends never[][] ? U : never : never, [...R[0], ...B]>;

type Replace<R extends any[], T> = { [K in keyof R]: T }

type TupleOf<T, N extends number> = number extends N ? T[] : {
  [K in N]:
  BuildPowersOf2LengthArrays<K, [[never]]> extends infer U ? U extends never[][]
  ? Replace<ConcatLargestUntilDone<K, U, []>, T> : never : never;
}[N]

type RangeOf<N extends number> = Partial<TupleOf<unknown, N>>["length"];

type RangeOf2<From extends number, To extends number> = Exclude<RangeOf<To>, RangeOf<From>> | From;


export type ColorAlpha = RangeOf2<0,255>

export type BorderWidth = RangeOf2<1, 10>

export type DashGap = RangeOf2<0.0, 10.0>

export type HexColor = `#${string}`;

export type FontSize = RangeOf2<0,100>
