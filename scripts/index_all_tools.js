import fs from 'fs';
import path from 'path';
import { submitToGoogleIndexing, submitToIndexNow } from '../server/googleIndexing.js';

// All PDF Tool slugs from PDF_TOOLS
const toolSlugs = [
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
];

const staticPages = [
  '/',
  '/pdf-tools',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
];

const allUrls = [...new Set([...staticPages, ...toolSlugs])].map(
  p => `https://ilovepdf.in${p}`
);

async function indexAll() {
  console.log(`🚀 Indexing ALL ${allUrls.length} tool and site URLs in Google Search Console & IndexNow...`);

  const results = [];
  for (const url of allUrls) {
    console.log(`Submitting to Google: ${url}`);
    const googleRes = await submitToGoogleIndexing(url, 'URL_UPDATED');
    results.push({ url, google: googleRes });
  }

  console.log(`📡 Broadcasting ${allUrls.length} URLs to IndexNow (Bing/Yandex/Naver/Seznam)...`);
  const indexNowRes = await submitToIndexNow(allUrls);

  console.log('\n==========================================');
  console.log(`✅ INDEXING COMPLETE! Total URLs: ${allUrls.length}`);
  console.log(`Google Search Console Success Count: ${results.filter(r => r.google.success).length}/${allUrls.length}`);
  console.log(`IndexNow Success: ${indexNowRes.success ? 'YES' : 'NO'}`);
  console.log('==========================================\n');
}

indexAll().catch(err => {
  console.error('Error during tool indexing:', err);
  process.exit(1);
});
