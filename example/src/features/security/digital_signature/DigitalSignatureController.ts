/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type {
  CPDFReaderView,
  CPDFSignatureWidget,
} from "@compdfkit_pdf_sdk/react_native";
import type { CertificateSession } from "./models/CertificateSession";
import type { DigitalSignatureState } from "./models/DigitalSignatureState";
import type { SignatureRequest } from "./models/SignatureRequest";
import { SignatureFileService } from "./services/SignatureFileService";
import { CertificateService } from "./services/CertificateService";
import { DigitalSignatureService } from "./services/DigitalSignatureService";
import { SignatureLtvService } from "./services/SignatureLtvService";
import { sameCertificate } from "./utils/certificateMatching";

/** Owns a single document session. UI components render state and return typed requests. */
export class DigitalSignatureController {
  readonly files = new SignatureFileService();
  readonly certificates = new CertificateService(this.files);
  private readonly signatures = new DigitalSignatureService(this.files);
  private readonly ltv = new SignatureLtvService(this.files);
  private reader: CPDFReaderView | null = null;
  private certificate: CertificateSession | null = null;
  private active = true;
  private locked = false;
  private subdialogClose: (() => void) | null = null;
  private lastAction = { uuid: "", time: 0 };
  private listeners = new Set<() => void>();
  private state: DigitalSignatureState = {
    document: null,
    generation: 0,
    ready: false,
    dialog: { type: "none" },
    busy: null,
    message: null,
    error: null,
  };

  getSnapshot = (): DigitalSignatureState => this.state;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private patch(change: Partial<DigitalSignatureState>): void {
    if (!this.active) return;
    this.state = { ...this.state, ...change };
    this.listeners.forEach((listener) => listener());
  }
  private current(generation: number): boolean {
    return this.active && this.state.generation === generation;
  }

  async initialize(): Promise<void> {
    this.active = true;
    if (this.state.document) return;
    await this.perform("Opening PDF...", async (generation) => {
      const path = await this.files.initialDocument();
      if (this.current(generation)) this.replaceDocument(path, false);
    });
  }
  dispose(): void {
    this.active = false;
    this.reader = null;
    this.certificate = null;
    this.subdialogClose = null;
    this.listeners.clear();
  }
  attachReader = (reader: CPDFReaderView | null): void => {
    this.reader = reader;
  };
  readerReady = (generation: number): void => {
    if (this.current(generation)) this.patch({ ready: true });
  };
  get canTrust(): boolean {
    const dialog = this.state.dialog;
    return (
      this.certificate !== null &&
      dialog.type === "info" &&
      sameCertificate(
        this.certificate.info,
        dialog.details.signature.signers[0]?.certificates[0]
      )
    );
  }
  dismissMessage = (): void => {
    this.patch({ message: null, error: null });
  };
  /** The active subdialog handles Android Back before the signing sheet is dismissed. */
  setSubdialogClose = (handler: (() => void) | null): void => {
    this.subdialogClose = handler;
  };
  closeDialog = (): void => {
    if (this.locked) return;
    if (this.subdialogClose) {
      this.subdialogClose();
      return;
    }
    this.patch({ dialog: { type: "none" } });
  };

  private replaceDocument(path: string, clearCertificate: boolean): void {
    this.reader = null;
    if (clearCertificate) this.certificate = null;
    this.lastAction = { uuid: "", time: 0 };
    this.patch({
      document: path,
      generation: this.state.generation + 1,
      ready: false,
      dialog: { type: "none" },
    });
  }

  /** A synchronous lock covers duplicate native events before React has rendered busy state. */
  async handleField(widget: CPDFSignatureWidget): Promise<void> {
    if (
      this.locked ||
      !this.state.ready ||
      !this.reader ||
      this.state.dialog.type !== "none"
    )
      return;
    if (
      widget.uuid === this.lastAction.uuid &&
      Date.now() - this.lastAction.time < 1000
    )
      return;
    this.lastAction = { uuid: widget.uuid, time: Date.now() };
    if (widget.isSigned === false) {
      this.patch({ dialog: { type: "sign", widget }, error: null });
      return;
    }
    if (widget.isSigned !== true) {
      this.patch({
        error:
          "The signature field state is unavailable. Reopen the PDF with an updated native SDK.",
      });
      return;
    }
    const document = this.reader._pdfDocument;
    await this.perform("Verifying signature...", async (generation) => {
      const details = await this.signatures.inspect(document, widget);
      if (this.current(generation))
        this.patch({ dialog: { type: "info", widget, details } });
    });
  }

  async openPdf(): Promise<void> {
    if (this.locked || this.state.dialog.type !== "none") return;
    await this.perform("Opening PDF...", async (generation) => {
      const path = await this.files.select("pdf");
      if (path && this.current(generation)) {
        this.replaceDocument(path, true);
        this.patch({
          message: "PDF opened. Tap a signature field for its details.",
        });
      }
    });
  }

  async sign(request: SignatureRequest): Promise<void> {
    const dialog = this.state.dialog;
    if (dialog.type !== "sign" || !this.reader) return;
    const document = this.reader._pdfDocument;
    await this.perform(
      request.timestampServerUrl
        ? "Signing PDF and requesting timestamp..."
        : "Signing PDF...",
      async (generation) => {
        const path = await this.signatures.sign(
          document,
          dialog.widget,
          request
        );
        if (this.current(generation)) {
          this.certificate = request.certificate;
          this.replaceDocument(path, false);
          this.patch({
            message: "Signed PDF opened. Tap the field again for its details.",
          });
        }
      }
    );
  }

  async trustCertificate(): Promise<void> {
    const dialog = this.state.dialog;
    if (
      dialog.type !== "info" ||
      !this.reader ||
      !this.certificate ||
      !this.canTrust
    )
      return;
    const document = this.reader._pdfDocument;
    const certificate = this.certificate;
    await this.perform("Trusting certificate...", async (generation) => {
      await this.certificates.trust(certificate);
      const details = await this.signatures.inspect(document, dialog.widget);
      if (this.current(generation))
        this.patch({
          dialog: { ...dialog, details },
          message: "Certificate added to the trust store.",
        });
    });
  }

  async addLtv(appendDocumentTimestamp: boolean): Promise<void> {
    if (this.state.dialog.type !== "info" || !this.reader) return;
    const reader = this.reader;
    await this.perform("Collecting LTV material...", async (generation) => {
      const root = await this.files.select("root");
      if (!root || !this.current(generation)) return;
      const result = await this.ltv.add(reader, root, appendDocumentTimestamp);
      if (this.current(generation)) {
        this.replaceDocument(result.finalPath, false);
        this.patch({
          message: [
            "LTV-enabled PDF opened. Tap the field to verify it.",
            ...result.warnings.map((item) => `${item.code}: ${item.message}`),
          ].join("\n"),
        });
      }
    });
  }

  private async perform(
    label: string,
    action: (generation: number) => Promise<void>
  ): Promise<void> {
    if (!this.active || this.locked) return;
    this.locked = true;
    const generation = this.state.generation;
    this.patch({ busy: label, error: null });
    try {
      await action(generation);
    } catch (error) {
      if (this.current(generation))
        this.patch({
          error: error instanceof Error ? error.message : `${label} failed.`,
        });
    } finally {
      this.locked = false;
      if (this.active) this.patch({ busy: null });
    }
  }
}
