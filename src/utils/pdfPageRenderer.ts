import { loadPdfDocument } from './pdfjsInit';

export interface PageThumbnail {
  pageNumber: number;
  thumbnailUrl: string | null;
}

const pageThumbnailCache = new Map<string, string>();

export async function renderSinglePageThumbnail(
  file: File,
  pageNumber: number,
  targetWidth: number = 150
): Promise<string | null> {
  const cacheKey = `${file.name}-${file.size}-${file.lastModified}-page-${pageNumber}`;
  if (pageThumbnailCache.has(cacheKey)) {
    return pageThumbnailCache.get(cacheKey)!;
  }

  try {
    const pdfDoc = await loadPdfDocument(file);

    if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
      return null;
    }

    const page = await pdfDoc.getPage(pageNumber);
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const scale = targetWidth / (unscaledViewport.width || 1);
    const viewport = page.getViewport({ scale: Math.max(scale, 0.3) });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };

    await page.render(renderContext as any).promise;
    const dataUrl = canvas.toDataURL('image/png');
    pageThumbnailCache.set(cacheKey, dataUrl);
    return dataUrl;
  } catch (err) {
    console.warn(`Failed to render thumbnail for page ${pageNumber}:`, err);
    return null;
  }
}

export async function getAllPagesMetadata(file: File): Promise<{
  pageCount: number;
  fileSize: number;
}> {
  try {
    const pdfDoc = await loadPdfDocument(file);
    return {
      pageCount: pdfDoc.numPages,
      fileSize: file.size,
    };
  } catch {
    return {
      pageCount: 1,
      fileSize: file.size,
    };
  }
}
