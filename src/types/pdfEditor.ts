export type EditorMode =
  | 'select'
  | 'hand'
  | 'annotate'
  | 'shapes'
  | 'insert'
  | 'edit-text'
  | 'forms'
  | 'sign'
  | 'whiteout';

export type AnnotateSubTool =
  | 'highlight'
  | 'underline'
  | 'strikeout'
  | 'squiggly'
  | 'freehand'
  | 'marker'
  | 'comment'
  | 'callout'
  | 'caret'
  | 'eraser';

export type ShapeSubTool =
  | 'rectangle'
  | 'circle'
  | 'polygon'
  | 'cloud'
  | 'line'
  | 'arrow'
  | 'polyline';

export type InsertSubTool =
  | 'stamp'
  | 'custom-stamp'
  | 'image'
  | 'signature'
  | 'initials'
  | 'company-stamp'
  | 'attachment'
  | 'page-number'
  | 'watermark';

export type FormSubTool =
  | 'text-field'
  | 'multiline-text'
  | 'checkbox'
  | 'radio'
  | 'dropdown'
  | 'signature-field';

export interface BaseEditorObject {
  id: string;
  pageIndex: number; // 0-indexed
  type: string;
  xPct: number; // 0..1 (X as percentage of page width)
  yPct: number; // 0..1 (Y as percentage of page height)
  widthPct: number; // 0..1 (Width as percentage of page width)
  heightPct: number; // 0..1 (Height as percentage of page height)
  rotation?: number; // 0, 90, 180, 270 or arbitrary degree
  opacity?: number; // 0..1
  zIndex?: number;
  locked?: boolean;
  visible?: boolean;
}

export interface TextEditorObject extends BaseEditorObject {
  type: 'text';
  text: string;
  fontSize: number; // in pt (e.g. 14, 18, 24)
  fontFamily: string; // 'Helvetica' | 'Times' | 'Courier' | 'Roboto' | 'Arial' | etc.
  color: string; // Hex e.g. '#000000'
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  isOriginalEdit?: boolean;
  originalText?: string;
  originalBounds?: { x: number; y: number; width: number; height: number };
}

export interface DrawingPoint {
  xPct: number;
  yPct: number;
  pressure?: number;
}

export interface DrawingEditorObject extends BaseEditorObject {
  type: 'drawing';
  points: DrawingPoint[];
  strokeColor: string;
  strokeWidth: number; // in px
  isMarker?: boolean;
}

export interface ShapeEditorObject extends BaseEditorObject {
  type: 'shape';
  shapeType: ShapeSubTool;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  cornerRadius?: number;
  arrowHead?: 'single' | 'double' | 'none';
  points?: Array<{ xPct: number; yPct: number }>; // for polygon/polyline/cloud
}

export interface AnnotationMarkupObject extends BaseEditorObject {
  type: 'annotation';
  annotationType: 'highlight' | 'underline' | 'strikeout' | 'squiggly' | 'caret';
  rects: Array<{ xPct: number; yPct: number; widthPct: number; heightPct: number }>;
  color: string;
  textSnippet?: string;
}

export interface StickyNoteObject extends BaseEditorObject {
  type: 'comment';
  author: string;
  text: string;
  date: string;
  status: 'open' | 'resolved';
  color: string; // Icon/note color
}

export interface ImageEditorObject extends BaseEditorObject {
  type: 'image';
  dataUrl: string;
  mimeType: string;
  aspectRatio: number;
  maintainAspect: boolean;
}

export interface StampEditorObject extends BaseEditorObject {
  type: 'stamp';
  stampType: string; // 'APPROVED' | 'CONFIDENTIAL' | 'VOID' | 'CUSTOM' | etc.
  label: string;
  customText?: string;
  date?: string;
  color: string;
  borderStyle?: 'solid' | 'dashed' | 'double';
  dataUrl?: string; // If image-based stamp
}

export interface SignatureEditorObject extends BaseEditorObject {
  type: 'signature';
  sigType: 'draw' | 'type' | 'upload' | 'initials' | 'company-stamp';
  dataUrl: string;
  color?: string;
}

export interface WhiteoutEditorObject extends BaseEditorObject {
  type: 'whiteout';
  color: string; // Default '#FFFFFF'
}

export interface FormFieldEditorObject extends BaseEditorObject {
  type: 'form-field';
  fieldType: 'text' | 'multiline' | 'checkbox' | 'radio' | 'dropdown' | 'signature';
  name: string;
  defaultValue?: string | boolean;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  options?: string[]; // for dropdown
  groupName?: string; // for radio button
  fontSize?: number;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
}

export interface LinkEditorObject extends BaseEditorObject {
  type: 'link';
  url?: string;
  targetPage?: number;
  openNewTab?: boolean;
}

export type EditorObject =
  | TextEditorObject
  | DrawingEditorObject
  | ShapeEditorObject
  | AnnotationMarkupObject
  | StickyNoteObject
  | ImageEditorObject
  | StampEditorObject
  | SignatureEditorObject
  | WhiteoutEditorObject
  | FormFieldEditorObject
  | LinkEditorObject;

export interface PageInfo {
  id?: string;
  pageIndex: number;
  pageNumber: number; // 1-indexed
  originalIndex: number;
  width: number; // in PDF points (72pt/inch)
  height: number;
  rotation: number; // 0, 90, 180, 270
  thumbnailUrl?: string;
  isCustomBlank?: boolean;
  pageSizePreset?: 'A4' | 'Letter' | 'Custom';
}

export interface PdfBookmark {
  id: string;
  title: string;
  pageNumber: number;
  children?: PdfBookmark[];
}

export interface PdfAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  data: Uint8Array;
}

export interface DetectedTextBlock {
  id: string;
  pageIndex: number;
  text: string;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  pdfPoints: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface EditorHistoryStep {
  description: string;
  objects: EditorObject[];
  pages: PageInfo[];
  bookmarks: PdfBookmark[];
  attachments: PdfAttachment[];
  selectedObjectId: string | null;
}
