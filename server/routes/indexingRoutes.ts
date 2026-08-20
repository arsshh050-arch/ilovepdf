import express from 'express';
import {
  getIndexingConfig,
  saveIndexingConfig,
  getIndexingLogs,
  submitToGoogleIndexing,
  submitToIndexNow,
  ensureIndexNowKey,
} from '../googleIndexing.js';

const router = express.Router();

let isIndexingInProgress = false;
let autoIndexingTimer: NodeJS.Timeout | null = null;
const ONE_MINUTE_MS = 60 * 1000;

export async function runAutoIndexingJob(): Promise<{ totalUrls: number; indexNowResult: any }> {
  if (isIndexingInProgress) {
    console.log('[AUTO-INDEXER 1-MIN] Indexing job already in progress, skipping tick.');
    return { totalUrls: 0, indexNowResult: { success: false, message: 'Already in progress' } };
  }

  isIndexingInProgress = true;
  const allUrls = TOOL_SLUGS.map(s => `https://ilovepdf.in${s}`);

  try {
    console.log(`[AUTO-INDEXER 1-MIN] Starting automated 1-minute indexing sweep for ${allUrls.length} URLs...`);
    
    // 1. Submit all URLs to IndexNow in a single fast request
    const indexNowResult = await submitToIndexNow(allUrls);

    // 2. Submit all URLs to Google Indexing API
    for (const u of allUrls) {
      await submitToGoogleIndexing(u, 'URL_UPDATED');
    }

    const currentConfig = getIndexingConfig();
    currentConfig.lastRunTimestamp = new Date().toISOString();
    saveIndexingConfig(currentConfig);

    console.log(`[AUTO-INDEXER 1-MIN] Auto-indexing completed successfully at ${currentConfig.lastRunTimestamp}`);
    return { totalUrls: allUrls.length, indexNowResult };
  } catch (err: any) {
    console.error('[AUTO-INDEXER 1-MIN] Error during automatic indexing run:', err?.message || err);
    return { totalUrls: allUrls.length, indexNowResult: { success: false, message: err?.message || 'Error' } };
  } finally {
    isIndexingInProgress = false;
  }
}

export function initAutoIndexingScheduler(): void {
  if (autoIndexingTimer) {
    clearInterval(autoIndexingTimer);
  }

  console.log('[AUTO-INDEXER 1-MIN] Initializing 1-minute automatic indexing scheduler (Interval: 60s)...');

  // Initial trigger after 5s warm-up
  setTimeout(() => {
    const config = getIndexingConfig();
    if (config.autoIndexOnPublish !== false) {
      runAutoIndexingJob().catch(err => console.error('[AUTO-INDEXER 1-MIN] Initial run failed:', err));
    }
  }, 5000);

  // Recurring 1-minute schedule
  autoIndexingTimer = setInterval(() => {
    const config = getIndexingConfig();
    if (config.autoIndexOnPublish !== false) {
      runAutoIndexingJob().catch(err => console.error('[AUTO-INDEXER 1-MIN] Scheduled run failed:', err));
    } else {
      console.log('[AUTO-INDEXER 1-MIN] Auto-indexing is disabled in config.');
    }
  }, ONE_MINUTE_MS);
}

router.get('/config', (req, res) => {
  const config = getIndexingConfig();
  res.json({
    hasServiceAccount: !!config.serviceAccountJson,
    indexNowKey: config.indexNowKey || ensureIndexNowKey(),
    autoIndexOnPublish: config.autoIndexOnPublish ?? true,
    autoIndexIntervalMinutes: 1,
    lastRunTimestamp: config.lastRunTimestamp || null,
    isIndexingInProgress,
  });
});

router.post('/config', (req, res) => {
  const { serviceAccountJson, indexNowKey, autoIndexOnPublish } = req.body || {};
  const current = getIndexingConfig();

  if (serviceAccountJson !== undefined) current.serviceAccountJson = serviceAccountJson;
  if (indexNowKey !== undefined) current.indexNowKey = indexNowKey;
  if (autoIndexOnPublish !== undefined) current.autoIndexOnPublish = autoIndexOnPublish;

  saveIndexingConfig(current);
  res.json({ success: true, message: 'Indexing settings saved successfully.' });
});

router.get('/logs', (req, res) => {
  res.json(getIndexingLogs());
});

router.post('/publish-single', async (req, res) => {
  const { url } = req.body || {};
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  const googleRes = await submitToGoogleIndexing(url, 'URL_UPDATED');
  const indexNowRes = await submitToIndexNow([url]);

  res.json({
    url,
    google: googleRes,
    indexNow: indexNowRes,
  });
});

const TOOL_SLUGS = [
  '/',
  '/pdf-tools',
  '/merge-pdf',
  '/split-pdf',
  '/compress-pdf',
  '/pdf-to-word',
  '/pdf-to-powerpoint',
  '/pdf-to-excel',
  '/word-to-pdf',
  '/powerpoint-to-pdf',
  '/excel-to-pdf',
  '/edit-pdf',
  '/pdf-to-jpg',
  '/jpg-to-pdf',
  '/sign-pdf',
  '/watermark-pdf',
  '/rotate-pdf',
  '/html-to-pdf',
  '/unlock-pdf',
  '/protect-pdf',
  '/organize-pdf',
  '/pdf-to-pdfa',
  '/repair-pdf',
  '/add-page-numbers',
  '/scan-to-pdf',
  '/ocr-pdf',
  '/compare-pdf',
  '/redact-pdf',
  '/crop-pdf',
  '/pdf-forms',
  '/ai-pdf-summarizer',
  '/translate-pdf',
  '/pdf-to-markdown',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

router.post('/publish-all', async (req, res) => {
  const result = await runAutoIndexingJob();
  res.json(result);
});

export default router;
