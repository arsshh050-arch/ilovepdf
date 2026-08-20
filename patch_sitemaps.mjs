import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

// Replace the unified sitemap generation with sitemap index and individual sitemaps
const sitemapsReplacement = `
// 2. Generate Sitemap Index and Individual Sitemaps
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
const domain = 'https://www.ilovepdf.in';

const KNOWN_TOOLS = [
  'pdf-to-word', 'compress-pdf', 'merge-pdf', 'jpg-to-pdf', 'split-pdf', 'edit-pdf', 'sign-pdf', 'word-to-pdf', 'pdf-to-jpg',
  'pdf-to-powerpoint', 'pdf-to-excel', 'powerpoint-to-pdf', 'excel-to-pdf', 'watermark-pdf', 'rotate-pdf', 'html-to-pdf', 'unlock-pdf', 'protect-pdf', 'organize-pdf', 'pdf-to-pdfa', 'repair-pdf', 'add-page-numbers', 'scan-to-pdf', 'ocr-pdf', 'compare-pdf', 'redact-pdf', 'crop-pdf', 'pdf-forms', 'ai-pdf-summarizer', 'translate-pdf', 'pdf-to-markdown', 'remove-pages', 'extract-pages', 'png-to-pdf', 'pdf-to-png', 'pdf-to-txt', 'txt-to-pdf', 'pdf-to-html', 'remove-pdf-metadata', 'flatten-pdf', 'extract-pdf-text', 'pdf-question-answer', 'extract-pdf-tables', 'annotate-pdf', 'add-text-pdf', 'add-image-pdf', 'draw-on-pdf'
];

const KNOWN_PAGES = [
  '', 'faq', 'about', 'contact', 'features', 'security', 
  'privacy-policy', 'terms', 'cookie-policy', 'pricing', 
  'business', 'api', 'pdf-tools', 'convert-pdf', 
  'organize-pdf-tools', 'edit-pdf-tools', 'pdf-security', 'pdf-ai-tools'
];

const today = new Date().toISOString().split('T')[0];
const addedUrls = new Set();

// A. sitemap-pages.xml
let pagesXml = \`<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n\`;
KNOWN_PAGES.forEach(p => {
  const loc = p ? \`\${domain}/\${p}\` : domain;
  if (!addedUrls.has(loc)) {
    addedUrls.add(loc);
    pagesXml += \`  <url>\\n    <loc>\${escapeXml(loc)}</loc>\\n    <lastmod>\${escapeXml(today)}</lastmod>\\n    <changefreq>\${p === '' ? 'daily' : 'weekly'}</changefreq>\\n    <priority>\${p === '' ? '1.0' : '0.8'}</priority>\\n  </url>\\n\`;
  }
});
if (cmsData.pages) {
  cmsData.pages.filter(p => p.status === 'published' && (!p.indexStatus || !p.indexStatus.includes('noindex'))).forEach(p => {
    let clean = p.slug.startsWith('/') ? p.slug.substring(1) : p.slug;
    const loc = clean ? \`\${domain}/\${clean}\` : domain;
    if (!addedUrls.has(loc)) {
      addedUrls.add(loc);
      const mod = (p.updatedAt || today).split('T')[0];
      pagesXml += \`  <url>\\n    <loc>\${escapeXml(loc)}</loc>\\n    <lastmod>\${escapeXml(mod)}</lastmod>\\n    <changefreq>monthly</changefreq>\\n    <priority>0.7</priority>\\n  </url>\\n\`;
    }
  });
}
pagesXml += '</urlset>';
fs.writeFileSync('dist/sitemap-pages.xml', pagesXml);

// B. sitemap-tools.xml
let toolsXml = \`<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n\`;
KNOWN_TOOLS.forEach(t => {
  const loc = \`\${domain}/\${t}\`;
  if (!addedUrls.has(loc)) {
    addedUrls.add(loc);
    toolsXml += \`  <url>\\n    <loc>\${escapeXml(loc)}</loc>\\n    <lastmod>\${escapeXml(today)}</lastmod>\\n    <changefreq>weekly</changefreq>\\n    <priority>0.9</priority>\\n  </url>\\n\`;
  }
});
if (cmsData.tools) {
  cmsData.tools.filter(t => t.status === 'active' && (!t.indexStatus || !t.indexStatus.includes('noindex'))).forEach(t => {
    let clean = t.slug.startsWith('/') ? t.slug.substring(1) : t.slug;
    const loc = \`\${domain}/\${clean}\`;
    if (!addedUrls.has(loc)) {
      addedUrls.add(loc);
      const mod = (t.updatedAt || today).split('T')[0];
      toolsXml += \`  <url>\\n    <loc>\${escapeXml(loc)}</loc>\\n    <lastmod>\${escapeXml(mod)}</lastmod>\\n    <changefreq>weekly</changefreq>\\n    <priority>0.9</priority>\\n  </url>\\n\`;
    }
  });
}
toolsXml += '</urlset>';
fs.writeFileSync('dist/sitemap-tools.xml', toolsXml);

// C. sitemap-posts.xml
let postsXml = \`<?xml version="1.0" encoding="UTF-8"?>\\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n\`;
let hasPosts = false;
if (cmsData.blogs && cmsData.blogs.length > 0) {
  cmsData.blogs.filter(b => b.status === 'published' && (!b.indexStatus || !b.indexStatus.includes('noindex'))).forEach(b => {
    const loc = \`\${domain}/blog/\${b.slug}\`;
    if (!addedUrls.has(loc)) {
      hasPosts = true;
      addedUrls.add(loc);
      const mod = (b.updatedAt || today).split('T')[0];
      postsXml += \`  <url>\\n    <loc>\${escapeXml(loc)}</loc>\\n    <lastmod>\${escapeXml(mod)}</lastmod>\\n    <changefreq>monthly</changefreq>\\n    <priority>0.6</priority>\\n  </url>\\n\`;
    }
  });
} else {
  // Add blog index at least if no posts
  const loc = \`\${domain}/blog\`;
  if (!addedUrls.has(loc)) {
    hasPosts = true;
    addedUrls.add(loc);
    postsXml += \`  <url>\\n    <loc>\${escapeXml(loc)}</loc>\\n    <lastmod>\${escapeXml(today)}</lastmod>\\n    <changefreq>weekly</changefreq>\\n    <priority>0.8</priority>\\n  </url>\\n\`;
  }
}
postsXml += '</urlset>';
fs.writeFileSync('dist/sitemap-posts.xml', postsXml);

// D. Sitemap Index
let indexXml = \`<?xml version="1.0" encoding="UTF-8"?>\\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n\`;
indexXml += \`  <sitemap>\\n    <loc>\${domain}/sitemap-pages.xml</loc>\\n    <lastmod>\${escapeXml(today)}</lastmod>\\n  </sitemap>\\n\`;
indexXml += \`  <sitemap>\\n    <loc>\${domain}/sitemap-tools.xml</loc>\\n    <lastmod>\${escapeXml(today)}</lastmod>\\n  </sitemap>\\n\`;
if (hasPosts) {
  indexXml += \`  <sitemap>\\n    <loc>\${domain}/sitemap-posts.xml</loc>\\n    <lastmod>\${escapeXml(today)}</lastmod>\\n  </sitemap>\\n\`;
}
indexXml += '</sitemapindex>';
fs.writeFileSync('dist/sitemap.xml', indexXml);

console.log('Generated sitemap index and split sitemaps');

// 3. Generate Static robots.txt
const robotsText = \`User-agent: *\\nAllow: /\\nAllow: /assets/\\nDisallow: /admin/\\nDisallow: /user/\\nDisallow: /api/\\nDisallow: /download/\\nDisallow: /result/\\nDisallow: /session/\\n\\nSitemap: \${domain}/sitemap.xml\`;
fs.writeFileSync('dist/robots.txt', robotsText);
console.log('Generated static robots.txt');
`;

content = content.replace(/\/\/ 2\. Generate Static Sitemap[\s\S]*/, sitemapsReplacement);

// Also replace canonical URLs in HTML generation to include www.
content = content.replace(/let routeUrl = \`https:\/\/ilovepdf\.in\$\{langSlug === '\/' \|\| langSlug === '' \? '' : \`\/\$\{langSlug\}\`\}\`;/g, 
  "let routeUrl = `https://www.ilovepdf.in${langSlug === '/' || langSlug === '' ? '' : `/${langSlug}`}`;");

fs.writeFileSync('postbuild.mjs', content);
console.log('Patched postbuild.mjs');
