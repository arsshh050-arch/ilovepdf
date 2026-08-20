import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees,
  PDFName,
  PDFDict,
  PDFArray,
  PDFString,
  PDFNumber,
  PDFHexString,
} from 'pdf-lib';
import {
  EditorObject,
  PageInfo,
  PdfAttachment,
  PdfBookmark,
  TextEditorObject,
  DrawingEditorObject,
  ShapeEditorObject,
  AnnotationMarkupObject,
  ImageEditorObject,
  StampEditorObject,
  SignatureEditorObject,
  WhiteoutEditorObject,
  FormFieldEditorObject,
  LinkEditorObject,
} from '../types/pdfEditor';
import { normalizedToPdfNative } from './pdfCoordinates';

// Color conversion helpers
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }
  const num = parseInt(clean, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
  };
}

export function hexToPdfRgb(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return rgb(r, g, b);
}

export interface ExportPdfOptions {
  originalPdfBytes: ArrayBuffer | Uint8Array;
  objects: EditorObject[];
  pages: PageInfo[];
  bookmarks?: PdfBookmark[];
  attachments?: PdfAttachment[];
  compress?: boolean;
}

export async function exportEditedPdf(options: ExportPdfOptions): Promise<Uint8Array> {
  const { originalPdfBytes, objects, pages, attachments = [] } = options;

  let inputBytes: Uint8Array;
  if (originalPdfBytes instanceof ArrayBuffer) {
    if (originalPdfBytes.byteLength === 0) {
      throw new Error('Original PDF ArrayBuffer is detached or empty.');
    }
    inputBytes = new Uint8Array(originalPdfBytes.slice(0));
  } else if (originalPdfBytes instanceof Uint8Array) {
    if (originalPdfBytes.buffer.byteLength === 0) {
      throw new Error('Original PDF byte buffer is detached or empty.');
    }
    inputBytes = new Uint8Array(
      originalPdfBytes.buffer.slice(
        originalPdfBytes.byteOffset,
        originalPdfBytes.byteOffset + originalPdfBytes.byteLength
      )
    );
  } else {
    inputBytes = originalPdfBytes as any;
  }

  // 1. Load original document
  const srcDoc = await PDFDocument.load(inputBytes, { ignoreEncryption: true });

  // 2. Create destination document to support clean page reordering, deletions, and insertions
  const outDoc = await PDFDocument.create();

  // Pre-embed standard fonts
  const fontHelvetica = await outDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await outDoc.embedFont(StandardFonts.HelveticaBold);
  const fontHelveticaOblique = await outDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontHelveticaBoldOblique = await outDoc.embedFont(StandardFonts.HelveticaBoldOblique);
  const fontTimes = await outDoc.embedFont(StandardFonts.TimesRoman);
  const fontTimesBold = await outDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontCourier = await outDoc.embedFont(StandardFonts.Courier);
  const fontCourierBold = await outDoc.embedFont(StandardFonts.CourierBold);

  const getFont = (family: string, bold?: boolean, italic?: boolean) => {
    const f = (family || '').toLowerCase();
    if (f.includes('times') || f.includes('serif') || f.includes('roman')) {
      return bold ? fontTimesBold : fontTimes;
    }
    if (f.includes('courier') || f.includes('mono')) {
      return bold ? fontCourierBold : fontCourier;
    }
    if (bold && italic) return fontHelveticaBoldOblique;
    if (bold) return fontHelveticaBold;
    if (italic) return fontHelveticaOblique;
    return fontHelvetica;
  };

  // Helper to copy/create pages based on PageInfo
  const outPagesMap = new Map<number, any>(); // newPageIndex -> PDFPage

  for (let i = 0; i < pages.length; i++) {
    const pageInfo = pages[i];
    let newPage: any;

    if (pageInfo.isCustomBlank) {
      // Blank page preset
      const w = pageInfo.width || 595.28;
      const h = pageInfo.height || 841.89;
      newPage = outDoc.addPage([w, h]);
    } else {
      // Copy from original
      const origIndex = pageInfo.originalIndex;
      if (origIndex >= 0 && origIndex < srcDoc.getPageCount()) {
        const [copiedPage] = await outDoc.copyPages(srcDoc, [origIndex]);
        newPage = outDoc.addPage(copiedPage);
      } else {
        newPage = outDoc.addPage([595.28, 841.89]);
      }
    }

    // Apply rotation
    if (pageInfo.rotation) {
      const currentRot = newPage.getRotation().angle;
      newPage.setRotation(degrees((currentRot + pageInfo.rotation) % 360));
    }

    outPagesMap.set(i, newPage);
  }

  // 3. Process Editor Objects grouped by page
  // Sort by zIndex to preserve layer ordering
  const sortedObjects = [...objects].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  for (const obj of sortedObjects) {
    if (obj.visible === false) continue;
    const page = outPagesMap.get(obj.pageIndex);
    if (!page) continue;

    const { width: pageWidth, height: pageHeight } = page.getSize();
    const pdfRect = normalizedToPdfNative(obj, pageWidth, pageHeight);

    switch (obj.type) {
      case 'whiteout': {
        const wo = obj as WhiteoutEditorObject;
        page.drawRectangle({
          x: pdfRect.x,
          y: pdfRect.y,
          width: pdfRect.width,
          height: pdfRect.height,
          color: hexToPdfRgb(wo.color || '#FFFFFF'),
          opacity: 1,
        });
        break;
      }

      case 'text': {
        const txt = obj as TextEditorObject;
        const font = getFont(txt.fontFamily, txt.bold, txt.italic);
        const fontSize = Math.max(6, txt.fontSize || 14);
        const textColor = hexToPdfRgb(txt.color || '#000000');
        const opacity = txt.opacity !== undefined ? txt.opacity : 1;

        // If this is an edited original text block, draw a solid background cover-up first
        if (txt.isOriginalEdit) {
          page.drawRectangle({
            x: pdfRect.x - 2,
            y: pdfRect.y - 2,
            width: pdfRect.width + 4,
            height: pdfRect.height + 4,
            color: hexToPdfRgb(txt.backgroundColor || '#FFFFFF'),
            opacity: 1,
          });
        } else if (txt.backgroundColor && txt.backgroundColor !== 'transparent') {
          page.drawRectangle({
            x: pdfRect.x,
            y: pdfRect.y,
            width: pdfRect.width,
            height: pdfRect.height,
            color: hexToPdfRgb(txt.backgroundColor),
            opacity,
          });
        }

        // Draw text lines
        const lines = (txt.text || '').split('\n');
        const lineHeight = fontSize * (txt.lineHeight || 1.25);
        let currentY = pdfRect.y + pdfRect.height - fontSize;

        for (const line of lines) {
          if (!line) {
            currentY -= lineHeight;
            continue;
          }

          let drawX = pdfRect.x;
          const textWidth = font.widthOfTextAtSize(line, fontSize);

          if (txt.align === 'center') {
            drawX = pdfRect.x + (pdfRect.width - textWidth) / 2;
          } else if (txt.align === 'right') {
            drawX = pdfRect.x + pdfRect.width - textWidth;
          }

          page.drawText(line, {
            x: Math.max(0, drawX),
            y: Math.max(0, currentY),
            size: fontSize,
            font,
            color: textColor,
            opacity,
            rotate: txt.rotation ? degrees(txt.rotation) : undefined,
          });

          // Underline if requested
          if (txt.underline) {
            page.drawLine({
              start: { x: drawX, y: currentY - 2 },
              end: { x: drawX + textWidth, y: currentY - 2 },
              thickness: Math.max(1, fontSize / 14),
              color: textColor,
              opacity,
            });
          }

          // Strikethrough if requested
          if (txt.strikethrough) {
            page.drawLine({
              start: { x: drawX, y: currentY + fontSize * 0.35 },
              end: { x: drawX + textWidth, y: currentY + fontSize * 0.35 },
              thickness: Math.max(1, fontSize / 14),
              color: textColor,
              opacity,
            });
          }

          currentY -= lineHeight;
        }
        break;
      }

      case 'annotation': {
        const annot = obj as AnnotationMarkupObject;
        const annotColor = hexToPdfRgb(annot.color || '#FFD600');
        const opacity = annot.opacity !== undefined ? annot.opacity : 0.35;

        for (const r of annot.rects) {
          const rectNative = normalizedToPdfNative(r, pageWidth, pageHeight);

          if (annot.annotationType === 'highlight') {
            page.drawRectangle({
              x: rectNative.x,
              y: rectNative.y,
              width: rectNative.width,
              height: rectNative.height,
              color: annotColor,
              opacity,
            });
          } else if (annot.annotationType === 'underline') {
            page.drawLine({
              start: { x: rectNative.x, y: rectNative.y },
              end: { x: rectNative.x + rectNative.width, y: rectNative.y },
              thickness: 1.5,
              color: annotColor,
              opacity: 1,
            });
          } else if (annot.annotationType === 'strikeout') {
            page.drawLine({
              start: { x: rectNative.x, y: rectNative.y + rectNative.height / 2 },
              end: { x: rectNative.x + rectNative.width, y: rectNative.y + rectNative.height / 2 },
              thickness: 1.5,
              color: annotColor,
              opacity: 1,
            });
          } else if (annot.annotationType === 'squiggly') {
            // Draw squiggly wave line along bottom
            const startX = rectNative.x;
            const endX = rectNative.x + rectNative.width;
            const y = rectNative.y;
            const step = 3;
            let up = true;
            for (let sx = startX; sx < endX; sx += step) {
              const nx = Math.min(endX, sx + step);
              page.drawLine({
                start: { x: sx, y: up ? y - 1 : y + 1 },
                end: { x: nx, y: up ? y + 1 : y - 1 },
                thickness: 1.2,
                color: annotColor,
                opacity: 1,
              });
              up = !up;
            }
          }
        }
        break;
      }

      case 'shape': {
        const shp = obj as ShapeEditorObject;
        const strokeColor = hexToPdfRgb(shp.strokeColor || '#E5322D');
        const fillColor = shp.fillColor && shp.fillColor !== 'transparent' ? hexToPdfRgb(shp.fillColor) : undefined;
        const borderWidth = shp.strokeWidth || 2;
        const opacity = shp.opacity !== undefined ? shp.opacity : 1;

        if (shp.shapeType === 'rectangle') {
          page.drawRectangle({
            x: pdfRect.x,
            y: pdfRect.y,
            width: pdfRect.width,
            height: pdfRect.height,
            borderColor: strokeColor,
            borderWidth,
            color: fillColor,
            opacity,
            borderOpacity: opacity,
            rotate: shp.rotation ? degrees(shp.rotation) : undefined,
          });
        } else if (shp.shapeType === 'circle') {
          page.drawEllipse({
            x: pdfRect.x + pdfRect.width / 2,
            y: pdfRect.y + pdfRect.height / 2,
            xScale: pdfRect.width / 2,
            yScale: pdfRect.height / 2,
            borderColor: strokeColor,
            borderWidth,
            color: fillColor,
            opacity,
            borderOpacity: opacity,
          });
        } else if (shp.shapeType === 'line') {
          page.drawLine({
            start: { x: pdfRect.x, y: pdfRect.y + pdfRect.height },
            end: { x: pdfRect.x + pdfRect.width, y: pdfRect.y },
            thickness: borderWidth,
            color: strokeColor,
            opacity,
          });
        } else if (shp.shapeType === 'arrow') {
          const startX = pdfRect.x;
          const startY = pdfRect.y + pdfRect.height;
          const endX = pdfRect.x + pdfRect.width;
          const endY = pdfRect.y;

          // Main line
          page.drawLine({
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            thickness: borderWidth,
            color: strokeColor,
            opacity,
          });

          // Arrowhead lines
          const angle = Math.atan2(endY - startY, endX - startX);
          const headLen = Math.max(8, borderWidth * 3.5);
          const leftX = endX - headLen * Math.cos(angle - Math.PI / 6);
          const leftY = endY - headLen * Math.sin(angle - Math.PI / 6);
          const rightX = endX - headLen * Math.cos(angle + Math.PI / 6);
          const rightY = endY - headLen * Math.sin(angle + Math.PI / 6);

          page.drawLine({
            start: { x: endX, y: endY },
            end: { x: leftX, y: leftY },
            thickness: borderWidth,
            color: strokeColor,
            opacity,
          });
          page.drawLine({
            start: { x: endX, y: endY },
            end: { x: rightX, y: rightY },
            thickness: borderWidth,
            color: strokeColor,
            opacity,
          });
        } else {
          // Fallback polygon/cloud rectangle
          page.drawRectangle({
            x: pdfRect.x,
            y: pdfRect.y,
            width: pdfRect.width,
            height: pdfRect.height,
            borderColor: strokeColor,
            borderWidth,
            color: fillColor,
            opacity,
          });
        }
        break;
      }

      case 'drawing': {
        const drw = obj as DrawingEditorObject;
        if (!drw.points || drw.points.length < 2) continue;

        const strokeColor = hexToPdfRgb(drw.strokeColor || '#000000');
        const thickness = drw.strokeWidth || 2;
        const opacity = drw.isMarker ? 0.35 : (drw.opacity !== undefined ? drw.opacity : 1);

        for (let p = 0; p < drw.points.length - 1; p++) {
          const pt1 = drw.points[p];
          const pt2 = drw.points[p + 1];

          const x1 = pt1.xPct * pageWidth;
          const y1 = pageHeight - (pt1.yPct * pageHeight);
          const x2 = pt2.xPct * pageWidth;
          const y2 = pageHeight - (pt2.yPct * pageHeight);

          page.drawLine({
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 },
            thickness,
            color: strokeColor,
            opacity,
          });
        }
        break;
      }

      case 'image':
      case 'signature': {
        const imgObj = obj as (ImageEditorObject | SignatureEditorObject);
        if (!imgObj.dataUrl) continue;

        try {
          const base64Data = imgObj.dataUrl.split(',')[1];
          if (!base64Data) continue;
          const binary = atob(base64Data);
          const bytes = new Uint8Array(binary.length);
          for (let b = 0; b < binary.length; b++) {
            bytes[b] = binary.charCodeAt(b);
          }

          const isPng = imgObj.dataUrl.includes('image/png') || imgObj.dataUrl.startsWith('data:image/png');
          let embeddedImage: any;

          if (isPng) {
            embeddedImage = await outDoc.embedPng(bytes);
          } else {
            embeddedImage = await outDoc.embedJpg(bytes);
          }

          const opacity = imgObj.opacity !== undefined ? imgObj.opacity : 1;

          page.drawImage(embeddedImage, {
            x: pdfRect.x,
            y: pdfRect.y,
            width: pdfRect.width,
            height: pdfRect.height,
            opacity,
            rotate: imgObj.rotation ? degrees(imgObj.rotation) : undefined,
          });
        } catch (imgErr) {
          console.warn('Failed to embed image in PDF export:', imgErr);
        }
        break;
      }

      case 'stamp': {
        const stamp = obj as StampEditorObject;
        const stampColor = hexToPdfRgb(stamp.color || '#E5322D');
        const opacity = stamp.opacity !== undefined ? stamp.opacity : 0.9;
        const stampFont = fontHelveticaBold;

        // Draw stamp border
        page.drawRectangle({
          x: pdfRect.x,
          y: pdfRect.y,
          width: pdfRect.width,
          height: pdfRect.height,
          borderColor: stampColor,
          borderWidth: 3,
          color: rgb(1, 1, 1),
          opacity: 0.85,
          borderOpacity: opacity,
          rotate: stamp.rotation ? degrees(stamp.rotation) : undefined,
        });

        // Inner dashed border
        page.drawRectangle({
          x: pdfRect.x + 3,
          y: pdfRect.y + 3,
          width: pdfRect.width - 6,
          height: pdfRect.height - 6,
          borderColor: stampColor,
          borderWidth: 1,
          opacity: 0,
          borderOpacity: opacity,
        });

        // Stamp text
        const label = (stamp.label || stamp.customText || stamp.stampType || 'APPROVED').toUpperCase();
        const stampFontSize = Math.min(24, Math.max(10, pdfRect.height * 0.45));
        const textWidth = stampFont.widthOfTextAtSize(label, stampFontSize);

        page.drawText(label, {
          x: pdfRect.x + (pdfRect.width - textWidth) / 2,
          y: pdfRect.y + (pdfRect.height - stampFontSize) / 2 + (stamp.date ? 4 : 0),
          size: stampFontSize,
          font: stampFont,
          color: stampColor,
          opacity,
        });

        // Optional date on stamp
        if (stamp.date) {
          const dateStr = stamp.date;
          const dateFontSize = Math.max(7, stampFontSize * 0.45);
          const dateWidth = fontHelvetica.widthOfTextAtSize(dateStr, dateFontSize);
          page.drawText(dateStr, {
            x: pdfRect.x + (pdfRect.width - dateWidth) / 2,
            y: pdfRect.y + 6,
            size: dateFontSize,
            font: fontHelvetica,
            color: stampColor,
            opacity,
          });
        }
        break;
      }

      case 'comment': {
        const note = obj as any;
        // Draw comment icon indicator
        const iconColor = hexToPdfRgb(note.color || '#F59E0B');
        page.drawRectangle({
          x: pdfRect.x,
          y: pdfRect.y,
          width: 18,
          height: 18,
          color: iconColor,
          borderColor: rgb(1, 1, 1),
          borderWidth: 1.5,
          opacity: 0.95,
        });
        page.drawText('💬', {
          x: pdfRect.x + 2,
          y: pdfRect.y + 3,
          size: 10,
          font: fontHelvetica,
          color: rgb(1, 1, 1),
        });
        break;
      }

      case 'form-field': {
        const ff = obj as FormFieldEditorObject;
        try {
          const form = outDoc.getForm();
          const fieldName = ff.name || `field_${ff.id}`;

          if (ff.fieldType === 'text' || ff.fieldType === 'multiline') {
            const textField = form.createTextField(fieldName);
            textField.addToPage(page, {
              x: pdfRect.x,
              y: pdfRect.y,
              width: pdfRect.width,
              height: pdfRect.height,
              borderWidth: 1,
              borderColor: hexToPdfRgb(ff.borderColor || '#9CA3AF'),
              backgroundColor: hexToPdfRgb(ff.backgroundColor || '#F9FAFB'),
            });
            if (ff.defaultValue) {
              textField.setText(String(ff.defaultValue));
            }
            if (ff.readOnly) textField.enableReadOnly();
            if (ff.required) textField.enableRequired();
            if (ff.fieldType === 'multiline') textField.enableMultiline();
          } else if (ff.fieldType === 'checkbox') {
            const checkBox = form.createCheckBox(fieldName);
            checkBox.addToPage(page, {
              x: pdfRect.x,
              y: pdfRect.y,
              width: Math.min(pdfRect.width, pdfRect.height, 20),
              height: Math.min(pdfRect.width, pdfRect.height, 20),
              borderWidth: 1,
              borderColor: hexToPdfRgb(ff.borderColor || '#4B5563'),
              backgroundColor: rgb(1, 1, 1),
            });
            if (ff.defaultValue === true || ff.defaultValue === 'true') {
              checkBox.check();
            }
            if (ff.readOnly) checkBox.enableReadOnly();
            if (ff.required) checkBox.enableRequired();
          } else if (ff.fieldType === 'dropdown') {
            const dropdown = form.createDropdown(fieldName);
            dropdown.addToPage(page, {
              x: pdfRect.x,
              y: pdfRect.y,
              width: pdfRect.width,
              height: pdfRect.height,
              borderWidth: 1,
              borderColor: hexToPdfRgb(ff.borderColor || '#9CA3AF'),
              backgroundColor: hexToPdfRgb(ff.backgroundColor || '#FFFFFF'),
            });
            const opts = ff.options && ff.options.length > 0 ? ff.options : ['Option 1', 'Option 2', 'Option 3'];
            dropdown.setOptions(opts);
            if (ff.defaultValue && opts.includes(String(ff.defaultValue))) {
              dropdown.select(String(ff.defaultValue));
            }
            if (ff.readOnly) dropdown.enableReadOnly();
            if (ff.required) dropdown.enableRequired();
          } else if (ff.fieldType === 'signature') {
            // Draw placeable signature form box with prompt
            page.drawRectangle({
              x: pdfRect.x,
              y: pdfRect.y,
              width: pdfRect.width,
              height: pdfRect.height,
              borderColor: hexToPdfRgb('#E5322D'),
              borderWidth: 1.5,
              color: hexToPdfRgb('#FFF5F5'),
              opacity: 0.9,
            });
            page.drawText('Sign Here ✍️', {
              x: pdfRect.x + 8,
              y: pdfRect.y + pdfRect.height / 2 - 4,
              size: 11,
              font: fontHelveticaBold,
              color: hexToPdfRgb('#E5322D'),
            });
          }
        } catch (formErr) {
          console.warn('Could not add interactive form field to PDF:', formErr);
        }
        break;
      }

      case 'link': {
        const link = obj as LinkEditorObject;
        if (link.url) {
          try {
            // Validate safe scheme
            const cleanUrl = link.url.trim();
            if (/^(https?|mailto):/i.test(cleanUrl)) {
              // Create PDF Link Annotation
              const linkAnnot = outDoc.context.obj({
                Type: 'Annot',
                Subtype: 'Link',
                Rect: [pdfRect.x, pdfRect.y, pdfRect.x + pdfRect.width, pdfRect.y + pdfRect.height],
                Border: [0, 0, 0],
                C: [0.2, 0.4, 0.9],
                A: {
                  Type: 'Action',
                  S: 'URI',
                  URI: PDFString.of(cleanUrl),
                },
              });
              const linkRef = outDoc.context.register(linkAnnot);
              page.node.addAnnot(linkRef);
            }
          } catch (linkErr) {
            console.warn('Failed to add PDF link annotation:', linkErr);
          }
        }
        break;
      }
    }
  }

  // 4. Attachments Embedding
  if (attachments.length > 0) {
    for (const att of attachments) {
      try {
        await outDoc.attach(att.data, att.name, {
          mimeType: att.type || 'application/octet-stream',
          description: `Attached via iLovePDF Editor - ${att.name}`,
        });
      } catch (attErr) {
        console.warn(`Failed to embed attachment ${att.name}:`, attErr);
      }
    }
  }

  // 5. Save and validate output
  const outputBytes = await outDoc.save();

  // Basic validation check
  if (!outputBytes || outputBytes.length < 50) {
    throw new Error('Generated PDF document is empty or invalid.');
  }

  return outputBytes;
}
