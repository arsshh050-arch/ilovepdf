import { v4 as uuidv4 } from 'uuid';

export interface ResultSessionData {
  sessionId: string;
  toolId: string;
  downloadUrl: string; // Blob URL or downloadable URL
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: number;
  isDeleted?: boolean;
  savedBytes?: number;
  savedPercent?: number;
  metadata?: {
    originalBytes?: number;
    compressedBytes?: number;
    savedBytes?: number;
    savedPercent?: number;
    pageCount?: number;
    mergedCount?: number;
    splitCount?: number;
    outputType?: string;
    mode?: string;
    language?: string;
    changesCount?: number;
    isZip?: boolean;
    [key: string]: any;
  };
}

const memorySessionMap = new Map<string, ResultSessionData>();

export function saveResultSession(
  data: Omit<ResultSessionData, 'sessionId' | 'createdAt'> & { sessionId?: string }
): ResultSessionData {
  const sessionId = data.sessionId || uuidv4();
  const sessionData: ResultSessionData = {
    ...data,
    sessionId,
    createdAt: Date.now(),
    isDeleted: false,
  };

  memorySessionMap.set(sessionId, sessionData);

  try {
    sessionStorage.setItem(`pdf_result_${sessionId}`, JSON.stringify({
      sessionId,
      toolId: data.toolId,
      filename: data.filename,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      createdAt: sessionData.createdAt,
      metadata: data.metadata,
      downloadUrl: data.downloadUrl,
    }));
    sessionStorage.setItem(`pdf_latest_result_${data.toolId}`, sessionId);
  } catch (e) {
    console.warn('Unable to persist session in sessionStorage:', e);
  }

  return sessionData;
}

export function getResultSession(sessionId: string): ResultSessionData | null {
  if (memorySessionMap.has(sessionId)) {
    const sess = memorySessionMap.get(sessionId)!;
    if (sess.isDeleted) return null;
    return sess;
  }

  try {
    const raw = sessionStorage.getItem(`pdf_result_${sessionId}`);
    if (raw) {
      const parsed = JSON.parse(raw) as ResultSessionData;
      if (parsed.isDeleted) return null;
      memorySessionMap.set(sessionId, parsed);
      return parsed;
    }
  } catch (e) {
    console.warn('Error reading result session:', e);
  }

  return null;
}

export function getLatestSessionForTool(toolId: string): ResultSessionData | null {
  try {
    const sessionId = sessionStorage.getItem(`pdf_latest_result_${toolId}`);
    if (sessionId) {
      return getResultSession(sessionId);
    }
  } catch (e) {
    console.warn('Error fetching latest session for tool:', e);
  }
  return null;
}

export function deleteResultSession(sessionId: string): void {
  const existing = getResultSession(sessionId);
  if (existing) {
    existing.isDeleted = true;
    memorySessionMap.set(sessionId, existing);
  }

  try {
    sessionStorage.removeItem(`pdf_result_${sessionId}`);
  } catch (e) {
    console.warn('Error deleting result session from sessionStorage:', e);
  }
}
