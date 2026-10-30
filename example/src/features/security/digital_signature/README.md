# Digital Signature example

This example follows the Flutter Digital Signature flow: tap an unsigned field to sign it, then tap the signed field to inspect its metadata, certificate, verification, timestamp, and LTV evidence.

## Try the flow

1. Open **Security → Digital Signature**. The bundled `unsigned_signature.pdf` contains a real unsigned field.
2. Tap that field. Choose an existing `.p12`/`.pfx` certificate and verify its password, or create a certificate using your identity information.
3. Edit the signer name, reason, location, permission, and appearance. The information preview updates as you type; it is not an exact rendering of the native appearance.
4. Optionally enable the RFC 3161 timestamp and supply an HTTP(S) TSA URL. This requires network access. A timestamp failure is reported instead of silently signing without one.
5. Select **Sign and open PDF**. The example writes a unique copy and opens it only after native success and an output file existence check.
6. Tap the signed field for **Signature information**. Verification availability, cryptographic validity, document integrity, certificate trust/expiry, and document-level evidence are separate signals.
7. **Trust certificate** is available only when the displayed signer certificate fingerprint matches the certificate used in this page session and it is not already trusted. Missing fingerprints disable this action. Trusting refreshes verification; it does not repair an invalid signature.
8. To collect LTV evidence, select **Add LTV with a trusted root (PEM)** and choose the PEM root of the signer chain. Optionally request a document timestamp (LTA). The saved source is preserved and the final successful copy is opened. Network/evidence failures and warnings remain visible.
9. Use **Open PDF** to inspect another local signed PDF. This clears the previous certificate session.

The demo does not add a certificate to the trust store automatically. A self-signed demo certificate may remain untrusted until you explicitly trust it. An unrelated PEM certificate does not establish the signer chain.

## Find the reusable code

| File or directory | Responsibility |
| --- | --- |
| `../examples/DigitalSignatureExampleScreen.tsx` | Toolbar, reader, modal host, and status composition |
| `DigitalSignatureController.ts` | Field actions, document generation, busy lock, async lifetime and flow coordination |
| `useDigitalSignatureController.ts` | React subscription and cleanup |
| `services/DigitalSignatureService.ts` | Actual `writeSignature`, `getDigitalSignatures`, and `verifyDigitalSignature` calls |
| `services/CertificateService.ts` | Password validation, certificate creation/loading and explicit trust |
| `services/SignatureLtvService.ts` | Save current reader, add LTV/LTA, validate output and return diagnostics |
| `services/SignatureFileService.ts` | System file selection, readable local copies, sample extraction and unique outputs |
| `models/` | Typed certificate session, form request, details and page state |
| `components/` | Separate signing, password, certificate creation, appearance, preview, details and evidence components |
| `utils/` | Pure field matching, native appearance content and human-readable status |

Each major dialog and service has its own file. Presentation components receive callbacks or typed requests. Native signature operations are separated into dedicated Android classes and iOS bridge/service files.

## Lifecycle and errors

- Native widget `isSigned` determines which flow opens. An absent value is unavailable, never assumed unsigned.
- Matching uses page and field name, then bounds within 1.5 page-coordinate units. An ambiguous match is rejected. Verification uses the native `signatureIndex`, not filtered array position.
- Image selection blocks submission until copying finishes; the selected path is merged into the latest appearance state. Cancellation and failures release the lock.
- A synchronous busy lock rejects duplicate submissions. A one-second event guard handles repeated actions on the same field.
- A document generation guards late async results and readiness callbacks. Leaving the page releases reader references and the in-memory certificate session.
- Certificate passwords are never persisted, logged, included in filenames or displayed in metadata. Certificate files remain in the application cache.
- Cancellation preserves the document and form. Verification/evidence inspection failures leave available metadata visible and show **Unavailable**, rather than inventing a negative result.
- LTV readiness is a document-level material assessment; it is not proof that every signature is valid or trusted.

## Platform requirements

Use matching ComPDFKit 3.2.0 native SDK builds exposing RFC 3161 and PAdES/LTV APIs. The development iOS setup uses the repository's existing `COMPDFKIT_IOS_LOCAL=1` Podfile option and local SDK artifacts; the default 3.0.2 pods do not provide these new APIs. No native dependency version is silently upgraded by this change.

Android reports no iOS-style modification records. The existing Android reason/location metadata issue is tracked separately as GitLab #39. Native file choosers follow system UI conventions; business fields and flow are shared with Flutter.

The dedicated legacy signature-status example remains separate. This example replaces its old path-entry form and action menu with the field-driven flow.

## Verify

From the repository root:

```sh
yarn lint
yarn typecheck
yarn test --runInBand
# Optional focused run of the signature example tests.
yarn test:signature-example --runInBand
yarn docs:check
yarn prepare
yarn --cwd example build:android
yarn --cwd example ios
```

Build success does not verify certificate trust, TSA network access or LTV collection. Exercise those on Android and iOS using the acceptance matrix in `plans/digital-signature-flutter-parity-plan.md` and record any unavailable checks.
