import fs from 'fs';

let content = fs.readFileSync('postbuild.mjs', 'utf8');

const replacementLogic = `
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const domain = 'https://ilovepdf.in';

const KNOWN_TOOLS = [
  'merge-pdf', 'split-pdf', 'compress-pdf', 'protect-pdf', 'unlock-pdf',
  'pdf-to-word', 'pdf-to-jpg', 'jpg-to-pdf'
];

const KNOWN_PAGES = [
  '', 'faq', 'about', 'contact', 'features', 'security', 
  'privacy-policy', 'terms', 'cookie-policy', 'pricing', 
  'business', 'api', 'blog', 'pdf-tools', 'convert-pdf', 
  'organize-pdf-tools', 'edit-pdf-tools', 'pdf-security', 'pdf-ai-tools'
];

let xml = \`<?xml version="1.0" encoding="UTF-8"?>\\n\`;
xml += \`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\\n\`;

const addedUrls = new Set();

function addUrl(slug, lastmod = null, imageUrl = null, imageTitle = null) {
  let cleanSlug = slug.startsWith('/') ? slug.substring(1) : slug;
  if (cleanSlug.endsWith('/')) cleanSlug = cleanSlug.slice(0, -1);
  
  const loc = cleanSlug ? \`\${domain}/\${cleanSlug}\` : domain;
  
  if (addedUrls.has(loc)) return;
  addedUrls.add(loc);
  
  xml += \`  <url>\\n\`;
  xml += \`    <loc>\${escapeXml(loc)}</loc>\\n\`;
  if (lastmod) {
    xml += \`    <lastmod>\${escapeXml(lastmod.split('T')[0])}</lastmod>\\n\`;
  }
  if (imageUrl) {
    xml += \`    <image:image>\\n\`;
    xml += \`      <image:loc>\${escapeXml(imageUrl)}</image:loc>\\n\`;
    if (imageTitle) {
      xml += \`      <image:title><![CDATA[\${imageTitle.replace(/\\]\\]>/g, ']]&gt;')}]]></image:title>\\n\`;
    }
    xml += \`    </image:image>\\n\`;
  }
  xml += \`  </url>\\n\`;
}

// 1. Add Known Pages
KNOWN_PAGES.forEach(p => addUrl(p));

// 2. Add CMS Pages
if (cmsData.pages) {
  cmsData.pages.filter((p) => p.status === 'published' && (!p.indexStatus || !p.indexStatus.includes('noindex'))).forEach((p) => {
    addUrl(p.slug, p.updatedAt);
  });
}

// 3. Add Known Tools
KNOWN_TOOLS.forEach(t => addUrl(t));

// 4. Add CMS Tools
if (cmsData.tools) {
  cmsData.tools.filter((t) => t.status === 'active' && (!t.indexStatus || !t.indexStatus.includes('noindex'))).forEach((t) => {
    addUrl(t.slug, t.updatedAt);
  });
}

// 5. Add Published Blogs
if (cmsData.blogs) {
  cmsData.blogs.filter((b) => b.status === 'published' && (!b.indexStatus || !b.indexStatus.includes('noindex'))).forEach((b) => {
    const lastmod = b.updatedDate || b.publishedDate;
    const imgUrl = b.featuredImage?.url;
    const imgTitle = b.title;
    addUrl(\`blog/\${b.slug}\`, lastmod, imgUrl, imgTitle);
  });
}

xml += \`</urlset>\`;
fs.writeFileSync('dist/sitemap.xml', xml);
console.log('Generated static sitemap.xml');
`;

content = content.replace(/function escapeXml[\s\S]*?console\.log\('Generated static sitemap\.xml'\);/, replacementLogic);

fs.writeFileSync('postbuild.mjs', content);
console.log('Patched postbuild.mjs');
