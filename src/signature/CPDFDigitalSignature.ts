import { fromNativeCertificateInfo, type CPDFCertificateInfo } from './CPDFCertificate';

/**
 * Document modification permission (DocMDP) attached to a digital signature.
 * Values match iOS `CPDFSignaturePermissions` and Android `PDFDocMdpP`.
 */
export const CPDFSignaturePermission = {
  /** No changes are allowed after signing. */
  FORBID_CHANGE: 1,
  /** Form filling and signing are allowed after signing. */
  FILL_AND_SIGN: 2,
  /** Annotations, form filling, and signing are allowed after signing. */
  ANNOTATION_FILL_AND_SIGN: 3,
} as const;
export type CPDFSignaturePermission = (typeof CPDFSignaturePermission)[keyof typeof CPDFSignaturePermission];

/** Page-space bounds of a signature field. */
export type CPDFSignatureBounds = { left: number; top: number; right: number; bottom: number };

/** A change made to the document after it was signed. Android always reports an empty list. */
export type CPDFDigitalModification = { type?: string; pageIndex?: number; annotationType?: string; formType?: string; info?: string };

export type CPDFDigitalSigner = { signatureVerified: boolean; certificateTrusted: boolean; certificates: CPDFCertificateInfo[] };

export type CPDFDigitalSignature = {
  signatureIndex: number;
  fieldName?: string;
  pageIndex?: number;
  bounds?: CPDFSignatureBounds;
  name?: string;
  date?: string;
  reason?: string;
  location?: string;
  filter?: string;
  subFilter?: string;
  permissions?: CPDFSignaturePermission;
  signers: CPDFDigitalSigner[];
  modifications: CPDFDigitalModification[];
};

export function fromNativeDigitalSignature(value: any): CPDFDigitalSignature {
  const bounds = value?.bounds;
  return {
    signatureIndex: value?.signature_index ?? 0,
    fieldName: value?.field_name,
    pageIndex: value?.page_index,
    bounds: bounds == null ? undefined : {
      left: Number(bounds.left ?? 0),
      top: Number(bounds.top ?? 0),
      right: Number(bounds.right ?? 0),
      bottom: Number(bounds.bottom ?? 0),
    },
    name: value?.name,
    date: value?.date,
    reason: value?.reason,
    location: value?.location,
    filter: value?.filter,
    subFilter: value?.sub_filter,
    permissions: value?.permissions,
    signers: Array.isArray(value?.signers)
      ? value.signers.map((s: any) => ({
        signatureVerified: s.signature_verified === true,
        certificateTrusted: s.certificate_trusted === true,
        certificates: Array.isArray(s.certificates) ? s.certificates.map(fromNativeCertificateInfo) : [],
      }))
      : [],
    modifications: Array.isArray(value?.modifications)
      ? value.modifications.map((m: any) => ({ type: m.type, pageIndex: m.page_index, annotationType: m.annotation_type, formType: m.form_type, info: m.info }))
      : [],
  };
}
