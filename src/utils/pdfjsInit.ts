import * as pdfjsLib from 'pdfjs-dist';

// Ensure PDF.js worker is properly configured matching current pdfjsLib version
const PDFJS_VERSION = pdfjsLib.version || '6.2.108';
if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
}

export { pdfjsLib };

export interface RenderPageResult {
  width: number;
  height: number;
  scale: number;
}

export async function loadPdfDocument(source: File | ArrayBuffer | Uint8Array) {
  let data: Uint8Array;
  if (source instanceof File) {
    const ab = await source.arrayBuffer();
    data = new Uint8Array(ab);
  } else if (source instanceof ArrayBuffer) {
    data = new Uint8Array(source.slice(0));
  } else if (source instanceof Uint8Array) {
    data = new Uint8Array(source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength));
  } else {
    data = source;
  }
  const loadingTask = pdfjsLib.getDocument({
    data,
    useSystemFonts: true,
  });
  return await loadingTask.promise;
}
