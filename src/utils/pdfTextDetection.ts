import { DetectedTextBlock } from '../types/pdfEditor';
import { pdfjsLib } from './pdfjsInit';

export interface PageTextExtractionResult {
  blocks: DetectedTextBlock[];
  hasTextLayer: boolean;
  rawText: string;
}

export async function extractPageTextBlocks(
  pdfDoc: any,
  pageIndex: number
): Promise<PageTextExtractionResult> {
  try {
    const page = await pdfDoc.getPage(pageIndex + 1);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });
    const pageWidth = viewport.width;
    const pageHeight = viewport.height;

    const items = textContent.items as Array<{
      str: string;
      dir: string;
      width: number;
      height: number;
      transform: number[]; // [scaleX, skewY, skewX, scaleY, transX, transY]
      fontName: string;
      hasEOL?: boolean;
    }>;

    if (!items || items.length === 0) {
      return {
        blocks: [],
        hasTextLayer: false,
        rawText: '',
      };
    }

    const blocks: DetectedTextBlock[] = [];
    let currentLine: {
      str: string;
      x: number;
      y: number;
      width: number;
      height: number;
      fontSize: number;
      fontName: string;
    } | null = null;

    const flushCurrentLine = () => {
      if (currentLine && currentLine.str.trim().length > 0) {
        // In PDF coordinates: (x, y) is bottom-left
        // Convert to normalized 0..1 (top-left origin)
        const xPct = Math.max(0, Math.min(1, currentLine.x / pageWidth));
        const yTop = pageHeight - (currentLine.y + currentLine.height);
        const yPct = Math.max(0, Math.min(1, yTop / pageHeight));
        const widthPct = Math.min(1 - xPct, Math.max(0.01, currentLine.width / pageWidth));
        const heightPct = Math.min(1 - yPct, Math.max(0.01, (currentLine.height * 1.25) / pageHeight));

        // Clean up font name
        let cleanFont = 'Helvetica';
        const fn = currentLine.fontName.toLowerCase();
        if (fn.includes('times') || fn.includes('roman') || fn.includes('serif')) {
          cleanFont = 'Times New Roman';
        } else if (fn.includes('courier') || fn.includes('mono')) {
          cleanFont = 'Courier';
        } else if (fn.includes('arial') || fn.includes('sans') || fn.includes('helvetica')) {
          cleanFont = 'Helvetica';
        }

        blocks.push({
          id: `tb_${pageIndex}_${blocks.length}_${Date.now()}`,
          pageIndex,
          text: currentLine.str,
          xPct,
          yPct,
          widthPct,
          heightPct,
          fontSize: Math.round(currentLine.fontSize || 12),
          fontFamily: cleanFont,
          color: '#000000',
          pdfPoints: {
            x: currentLine.x,
            y: currentLine.y,
            width: currentLine.width,
            height: currentLine.height,
          },
        });
      }
      currentLine = null;
    };

    let fullRaw = '';

    for (const item of items) {
      if (!item.str) continue;
      fullRaw += item.str + ' ';

      const itemX = item.transform[4];
      const itemY = item.transform[5];
      const fontSize = Math.hypot(item.transform[2], item.transform[3]) || Math.abs(item.transform[0]) || 12;
      const itemHeight = item.height || fontSize;
      const itemWidth = item.width || item.str.length * (fontSize * 0.55);

      if (!currentLine) {
        currentLine = {
          str: item.str,
          x: itemX,
          y: itemY,
          width: itemWidth,
          height: itemHeight,
          fontSize,
          fontName: item.fontName,
        };
      } else {
        // If on same baseline (Y within ~3px), append
        const yDiff = Math.abs(currentLine.y - itemY);
        const xGap = itemX - (currentLine.x + currentLine.width);

        if (yDiff < fontSize * 0.4 && xGap < fontSize * 2.0) {
          const space = xGap > fontSize * 0.15 ? ' ' : '';
          currentLine.str += space + item.str;
          currentLine.width = (itemX + itemWidth) - currentLine.x;
          currentLine.height = Math.max(currentLine.height, itemHeight);
        } else {
          flushCurrentLine();
          currentLine = {
            str: item.str,
            x: itemX,
            y: itemY,
            width: itemWidth,
            height: itemHeight,
            fontSize,
            fontName: item.fontName,
          };
        }
      }

      if (item.hasEOL) {
        flushCurrentLine();
      }
    }

    flushCurrentLine();

    return {
      blocks,
      hasTextLayer: blocks.length > 0,
      rawText: fullRaw.trim(),
    };
  } catch (err) {
    console.warn(`Failed to extract text for page ${pageIndex}:`, err);
    return {
      blocks: [],
      hasTextLayer: false,
      rawText: '',
    };
  }
}
