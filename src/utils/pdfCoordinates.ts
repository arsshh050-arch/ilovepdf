export interface ViewportRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface NormalizedRect {
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
}

export interface PdfNativePoint {
  x: number;
  y: number;
}

export interface PdfNativeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Converts screen/canvas click coordinate (relative to the rendered page element) to normalized 0..1 coordinate
 */
export function screenToNormalized(
  clientX: number,
  clientY: number,
  containerRect: DOMRect
): { xPct: number; yPct: number } {
  const x = clientX - containerRect.left;
  const y = clientY - containerRect.top;
  const xPct = Math.max(0, Math.min(1, x / containerRect.width));
  const yPct = Math.max(0, Math.min(1, y / containerRect.height));
  return { xPct, yPct };
}

/**
 * Converts normalized 0..1 coordinate to screen pixels inside the page container
 */
export function normalizedToScreen(
  norm: NormalizedRect,
  containerWidth: number,
  containerHeight: number
): ViewportRect {
  return {
    left: norm.xPct * containerWidth,
    top: norm.yPct * containerHeight,
    width: norm.widthPct * containerWidth,
    height: norm.heightPct * containerHeight,
  };
}

/**
 * Converts normalized 0..1 (top-left origin) to PDF native points (bottom-left origin standard in PDF-lib)
 */
export function normalizedToPdfNative(
  norm: NormalizedRect,
  pdfPageWidth: number,
  pdfPageHeight: number,
  rotation: number = 0
): PdfNativeRect {
  // In normalized coords, (0,0) is top-left.
  // In standard PDF-lib, (0,0) is bottom-left.
  const w = norm.widthPct * pdfPageWidth;
  const h = norm.heightPct * pdfPageHeight;
  const x = norm.xPct * pdfPageWidth;
  const y = pdfPageHeight - (norm.yPct * pdfPageHeight) - h;

  return { x, y, width: w, height: h };
}

/**
 * Converts PDF native points (bottom-left origin) to normalized 0..1
 */
export function pdfNativeToNormalized(
  pdfRect: PdfNativeRect,
  pdfPageWidth: number,
  pdfPageHeight: number
): NormalizedRect {
  const widthPct = pdfRect.width / pdfPageWidth;
  const heightPct = pdfRect.height / pdfPageHeight;
  const xPct = pdfRect.x / pdfPageWidth;
  // Convert from bottom-left to top-left
  const yPct = (pdfPageHeight - (pdfRect.y + pdfRect.height)) / pdfPageHeight;

  return { xPct, yPct, widthPct, heightPct };
}

/**
 * Snapping helper for alignment guides
 */
export function snapToGuides(
  xPct: number,
  yPct: number,
  widthPct: number,
  heightPct: number,
  tolerancePct: number = 0.015
): {
  xPct: number;
  yPct: number;
  snappedX: boolean;
  snappedY: boolean;
  guideX?: number;
  guideY?: number;
} {
  let finalX = xPct;
  let finalY = yPct;
  let snappedX = false;
  let snappedY = false;
  let guideX: number | undefined;
  let guideY: number | undefined;

  const centerX = xPct + widthPct / 2;
  const centerY = yPct + heightPct / 2;

  // Snap to center X (0.5)
  if (Math.abs(centerX - 0.5) < tolerancePct) {
    finalX = 0.5 - widthPct / 2;
    snappedX = true;
    guideX = 0.5;
  } else if (Math.abs(xPct - 0.05) < tolerancePct) {
    // Left margin snap
    finalX = 0.05;
    snappedX = true;
    guideX = 0.05;
  } else if (Math.abs(xPct + widthPct - 0.95) < tolerancePct) {
    // Right margin snap
    finalX = 0.95 - widthPct;
    snappedX = true;
    guideX = 0.95;
  }

  // Snap to center Y (0.5)
  if (Math.abs(centerY - 0.5) < tolerancePct) {
    finalY = 0.5 - heightPct / 2;
    snappedY = true;
    guideY = 0.5;
  } else if (Math.abs(yPct - 0.05) < tolerancePct) {
    // Top margin snap
    finalY = 0.05;
    snappedY = true;
    guideY = 0.05;
  } else if (Math.abs(yPct + heightPct - 0.95) < tolerancePct) {
    // Bottom margin snap
    finalY = 0.95 - heightPct;
    snappedY = true;
    guideY = 0.95;
  }

  return { xPct: finalX, yPct: finalY, snappedX, snappedY, guideX, guideY };
}
