/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import {
  CPDFAnnotation,
  CPDFReplyAnnotation,
} from '@compdfkit_pdf_sdk/react_native';

export type AnnotationReplyPanelMode = 'empty' | 'picker' | 'thread';

export type ReplyCounts = Record<string, number>;

export type StatePickerConfig = {
  title: string;
  values: string[];
  onSelect: (value: string) => void;
};

export type ReplyEditData = {
  title: string;
  content: string;
};

export type ThreadAction = 'mark' | 'review' | 'clearReplies' | 'printJson';

export type ReplyAction = 'edit' | 'delete' | 'mark' | 'review';

export const ANNOTATION_REPLY_AUTHOR = 'ComPDFKit';

export function annotationDisplayTitle(annotation: CPDFAnnotation) {
  return annotation.title.trim() || `${annotation.type}`;
}

export function annotationDisplaySummary(annotation: CPDFAnnotation) {
  return annotation.content.trim() || `Page ${annotation.page + 1} - ${annotation.type}`;
}

export function formatReplyMeta(reply: CPDFReplyAnnotation) {
  return `${formatReplyDate(reply.modifyDate ?? reply.createDate)} - ${reply.markState} - ${reply.reviewState}`;
}

export function formatReplyDate(date: Date | null) {
  if (!date) {
    return 'No date';
  }
  const pad = (value: number) => value.toString().padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + ` ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
