import { loadPdfDocument } from './pdfjsInit';

export interface PdfMetadata {
  pageCount: number;
  thumbnailUrl: string | null;
}

const thumbnailCache = new Map<string, PdfMetadata>();

export async function getPdfMetadataAndThumbnail(file: File): Promise<PdfMetadata> {
  const cacheKey = `${file.name}-${file.size}-${file.lastModified}`;
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey)!;
  }

  try {
    const pdfDoc = await loadPdfDocument(file);
    const pageCount = pdfDoc.numPages;

    // Render Page 1
    const page = await pdfDoc.getPage(1);
    // Aim for approx 165px width preview
    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const desiredWidth = 165;
    const scale = desiredWidth / (unscaledViewport.width || 1);
    const viewport = page.getViewport({ scale: Math.max(scale, 0.4) });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      return { pageCount, thumbnailUrl: null };
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    };

    await page.render(renderContext as any).promise;
    const thumbnailUrl = canvas.toDataURL('image/png');

    const result: PdfMetadata = {
      pageCount,
      thumbnailUrl
    };

    thumbnailCache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.warn('Error generating PDF preview via pdfjs, using fallback metadata:', error);
    return {
      pageCount: 1,
      thumbnailUrl: null
    };
  }
}

export interface PageThumbnailData {
  pageNumber: number;
  thumbnailUrl: string;
  width: number;
  height: number;
}

export async function getAllPdfPageThumbnails(file: File, desiredWidth = 180): Promise<PageThumbnailData[]> {
  try {
    const pdfDoc = await loadPdfDocument(file);
    const pageCount = pdfDoc.numPages;
    const results: PageThumbnailData[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdfDoc.getPage(i);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const scale = desiredWidth / (unscaledViewport.width || 1);
      const viewport = page.getViewport({ scale: Math.max(scale, 0.4) });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        };

        await page.render(renderContext as any).promise;
        results.push({
          pageNumber: i,
          thumbnailUrl: canvas.toDataURL('image/png'),
          width: viewport.width,
          height: viewport.height
        });
      }
    }
    return results;
  } catch (err) {
    console.warn('Error extracting all PDF page thumbnails:', err);
    return [];
  }
}

export async function getImagePreviewUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  return `${val.toFixed(val < 10 && i > 0 ? 2 : 1)} ${sizes[i]}`;
}
