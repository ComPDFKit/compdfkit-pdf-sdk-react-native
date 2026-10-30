export const CPDFCertificateUsage = { DIGITAL_SIGNATURE: 1, DATA_ENCRYPTION: 2, ALL: 3 } as const;
export type CPDFCertificateUsage = (typeof CPDFCertificateUsage)[keyof typeof CPDFCertificateUsage];
export type CPDFCertificateSubject = { country?: string; state?: string; locality?: string; organization?: string; organizationalUnit?: string; commonName: string; email?: string };
export type CPDFCertificateRequest = { subject: CPDFCertificateSubject; password: string; outputPath: string; usage?: CPDFCertificateUsage };
export type CPDFCertificateInfo = { version?: string; serialNumber?: string; keyType?: string; signatureAlgorithm?: string; issuer?: string; subject?: string; validFrom?: string; validTo?: string; sha1Digest?: string; md5Digest?: string; isTrusted: boolean; isExpired?: boolean };
export function toNativeCertificateRequest(request: CPDFCertificateRequest): Record<string, unknown> {
  if (!request.subject.commonName.trim()) throw new Error("A certificate request requires commonName.");
  if (!request.password) throw new Error("A certificate request requires a password.");
  if (!request.outputPath) throw new Error("A certificate request requires outputPath.");
  const subject: Record<string, string> = {};
  const fields: [keyof CPDFCertificateSubject, string][] = [["country", "country"], ["state", "state"], ["locality", "locality"], ["organization", "organization"], ["organizationalUnit", "organizational_unit"], ["commonName", "common_name"], ["email", "email"]];
  fields.forEach(([key, nativeKey]) => { const value = request.subject[key]; if (value) subject[nativeKey] = value; });
  return { subject, password: request.password, output_path: request.outputPath, usage: request.usage ?? CPDFCertificateUsage.DIGITAL_SIGNATURE };
}
export function fromNativeCertificateInfo(json: any): CPDFCertificateInfo { const value = json ?? {}; return { version: value.version, serialNumber: value.serial_number, keyType: value.key_type, signatureAlgorithm: value.signature_algorithm, issuer: value.issuer, subject: value.subject, validFrom: value.valid_from, validTo: value.valid_to, sha1Digest: value.sha1_digest, md5Digest: value.md5_digest, isTrusted: value.is_trusted === true, isExpired: typeof value.is_expired === 'boolean' ? value.is_expired : undefined }; }
