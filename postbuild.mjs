import fs from 'fs';
import path from 'path';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// A simple local definition since we can't easily import TS files here without tsx
const LANGUAGES = [
  { code: 'en', enabled: true },
  { code: 'es', enabled: true },
  { code: 'fr', enabled: true },
  { code: 'de', enabled: true },
  { code: 'it', enabled: true },
  { code: 'pt', enabled: true },
  { code: 'ja', enabled: true },
  { code: 'ru', enabled: true },
  { code: 'ko', enabled: true },
  { code: 'zh-CN', enabled: true },
  { code: 'zh-TW', enabled: true },
  { code: 'ar', enabled: true },
  { code: 'bg', enabled: true },
  { code: 'ca', enabled: true },
  { code: 'nl', enabled: true },
  { code: 'el', enabled: true },
  { code: 'hi', enabled: true },
  { code: 'id', enabled: true },
  { code: 'ms', enabled: true },
  { code: 'pl', enabled: true },
  { code: 'sv', enabled: true },
  { code: 'th', enabled: true },
  { code: 'tr', enabled: true },
  { code: 'uk', enabled: true },
  { code: 'vi', enabled: true },
  { code: 'sw', enabled: true },
  { code: 'pa', enabled: true }
];


// Load CMS Data
let cmsData = { pages: [], tools: [], blogs: [], redirects: [], robotsTxt: '' };

let toolsSeoData = {};
try {
  toolsSeoData = JSON.parse(fs.readFileSync('src/content/seo/toolsSeoData.json', 'utf8'));
} catch (e) {
  console.log('Could not load toolsSeoData.json');
}

try {
  const dataPath = path.join(process.cwd(), 'data', 'cms_db.json');
  if (fs.existsSync(dataPath)) {
    cmsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
} catch (e) {
  console.log('No cms_db.json found, using defaults.');
}

const KNOWN_TOOLS = [
  'pdf-to-word', 'compress-pdf', 'merge-pdf', 'jpg-to-pdf', 'split-pdf', 'edit-pdf', 'sign-pdf', 'word-to-pdf', 'pdf-to-jpg',
  'pdf-to-powerpoint', 'pdf-to-excel', 'powerpoint-to-pdf', 'excel-to-pdf', 'watermark-pdf', 'rotate-pdf', 'html-to-pdf', 'unlock-pdf', 'protect-pdf', 'organize-pdf', 'pdf-to-pdfa', 'repair-pdf', 'add-page-numbers', 'scan-to-pdf', 'ocr-pdf', 'compare-pdf', 'redact-pdf', 'crop-pdf', 'pdf-forms', 'ai-pdf-summarizer', 'translate-pdf', 'pdf-to-markdown', 'remove-pages', 'extract-pages', 'png-to-pdf', 'pdf-to-png', 'pdf-to-txt', 'txt-to-pdf', 'pdf-to-html', 'remove-pdf-metadata', 'flatten-pdf', 'extract-pdf-text', 'pdf-question-answer', 'extract-pdf-tables', 'annotate-pdf', 'add-text-pdf', 'add-image-pdf', 'draw-on-pdf'
];

const KNOWN_PAGES = [
  '', 'faq', 'about', 'contact', 'contact-us', 'features', 'security', 
  'privacy-policy', 'privacy', 'terms', 'terms-and-conditions', 
  'cookie-policy', 'cookies', 'pricing', 'business', 
  'api', 'developer-api', 'pdf-api', 'developers', 
  'pdf-tools', 'all-pdf-tools', 'pdf_tools', 'all-tools', 
  'convert-pdf', 'organize-pdf-tools', 'edit-pdf-tools', 'pdf-security', 'pdf-ai-tools', 'tools'
];

// 1. Generate Static HTML Routes
const baseHtml = fs.existsSync('dist/index.html') ? fs.readFileSync('dist/index.html', 'utf8') : '';
if (baseHtml) {
  



const routes = [
    { slug: '', title: 'Online PDF Tools for Everyday Document Tasks | iLovePDF.in', desc: 'Use browser-based tools to merge, split, compress, convert, edit and prepare PDF documents for everyday work.', h1: 'Online PDF Tools for Everyday Document Tasks' },
    { slug: 'merge-pdf', title: 'Merge PDF', desc: 'Combine PDFs in the order you want.' },
    { slug: 'split-pdf', title: 'Split PDF', desc: 'Separate one page or a whole set for easy conversion.' },
    { slug: 'compress-pdf', title: 'Compress PDF', desc: 'Reduce file size while optimizing for maximal PDF quality.' },
    { slug: 'protect-pdf', title: 'Protect PDF', desc: 'Encrypt your PDF with a password.' },
    { slug: 'unlock-pdf', title: 'Unlock PDF', desc: 'Remove PDF password security.' },

    { slug: 'pdf-to-word', title: 'PDF to Word', desc: 'Convert PDF to editable Word document.' },
    { slug: 'pdf-to-jpg', title: 'PDF to JPG', desc: 'Convert PDF to JPG images.' },
    { slug: 'jpg-to-pdf', title: 'JPG to PDF', desc: 'Convert JPG images to PDF.' },
    { slug: 'convert-pdf', title: 'Convert PDF', desc: 'Convert to and from PDF.' },
    { slug: 'organize-pdf-tools', title: 'Organize PDF Tools', desc: 'Organize your PDF files.' },
    { slug: 'edit-pdf-tools', title: 'Edit PDF Tools', desc: 'Tools to edit PDFs.' },
    { slug: 'pdf-security', title: 'PDF Security Tools', desc: 'Secure your PDFs.' },
    { slug: 'pdf-ai-tools', title: 'AI PDF Tools', desc: 'AI-powered PDF tools.' },

    { slug: 'faq', title: 'FAQ', desc: 'Frequently Asked Questions.' },
    { slug: 'about', title: 'About Us', desc: 'Learn more about iLovePDF.in' },
    { slug: 'contact', title: 'Contact', desc: 'Get in touch with us.' },
    { slug: 'features', title: 'Features', desc: 'Discover all features.' },
    { slug: 'security', title: 'Security', desc: 'We care about your privacy.' },
    { slug: 'privacy-policy', title: 'Privacy Policy', desc: 'Our privacy policy.' },
    { slug: 'terms', title: 'Terms of Service', desc: 'Our terms and conditions.' },
    { slug: 'cookie-policy', title: 'Cookie Policy', desc: 'How we use cookies.' },
    { slug: 'pricing', title: 'Pricing', desc: 'Plans and pricing.' },
    { slug: 'business', title: 'Business', desc: 'Solutions for business.' },
    { slug: 'api', title: 'Developer API', desc: 'Automate your PDF tasks.' },
    { slug: 'blog', title: 'Blog', desc: 'PDF guides and tips.' },
    { slug: 'pdf-tools', title: 'All PDF Tools', desc: 'All the tools you need.' },
  ];


  KNOWN_TOOLS.forEach(slug => {
    if (!routes.find(r => r.slug === slug)) {
      let title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (title.toLowerCase().includes('pdf')) title = title.replace(/pdf/i, 'PDF');
      routes.push({ slug, title: `${title} - iLovePDF.in`, desc: `Use our ${title} tool online.` });
    }
  });

  KNOWN_PAGES.forEach(slug => {
    if (slug && !routes.find(r => r.slug === slug)) {
      let title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      routes.push({ slug, title: `${title} - iLovePDF.in`, desc: `${title} page of iLovePDF.in` });
    }
  });

  // Add dynamic tools
  if (cmsData.tools) {
    cmsData.tools.forEach(t => {
      if (!routes.find(r => r.slug === t.slug)) {
        routes.push({ slug: t.slug, title: t.seoTitle || t.name, desc: t.seoDescription || t.shortDescription });
      }
    });
  }

  // Add dynamic pages
  if (cmsData.pages) {
    cmsData.pages.forEach(p => {
      if (!routes.find(r => r.slug === p.slug) && p.slug !== '/') {
        routes.push({ slug: p.slug.startsWith('/') ? p.slug.substring(1) : p.slug, title: p.seoTitle || p.title, desc: p.seoDescription || p.title });
      }
    });
  }

  // Add blogs
  if (cmsData.blogs) {
    cmsData.blogs.filter(b => b.status === 'published').forEach(b => {
      routes.push({ slug: `blog/${b.slug}`, title: b.seoTitle || b.title, desc: b.seoDescription || b.excerpt });
    });
  }

  
  
  // Update routes with seoData
  routes.forEach(route => {
    const seoItem = toolsSeoData['/' + route.slug];
    if (seoItem) {
      if (seoItem.title) route.title = seoItem.title;
      if (seoItem.description) route.desc = seoItem.description;
      if (seoItem.h1) route.h1 = seoItem.h1;
    }
  });

  routes.forEach(route => {

    LANGUAGES.filter(l => l.enabled).forEach(lang => {
      const isDefault = lang.code === 'en';
      let langSlug = route.slug;
      if (!isDefault) {
         langSlug = langSlug ? `${lang.code}/${langSlug}` : lang.code;
      }
      
      const routeDir = path.join('dist', langSlug);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      
      let modifiedHtml = baseHtml;
      if (route.title) {
        modifiedHtml = modifiedHtml.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);
        modifiedHtml = modifiedHtml.replace(/<meta property="og:title" content=".*?"/i, `<meta property="og:title" content="${route.title}"`);
      }
      
      let routeUrl = `https://www.ilovepdf.in${langSlug === '/' || langSlug === '' ? '/' : `/${langSlug}`}`;
      if (/<link rel="canonical"/i.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${routeUrl}" />`);
      } else {
        modifiedHtml = modifiedHtml.replace(/<head>/i, `<head>\n    <link rel="canonical" href="${routeUrl}" />`);
      }
      
      if (route.desc) {
        modifiedHtml = modifiedHtml.replace(/<meta name="description" content=".*?"/i, `<meta name="description" content="${route.desc}"`);
        modifiedHtml = modifiedHtml.replace(/<meta property="og:description" content=".*?"/i, `<meta property="og:description" content="${route.desc}"`);
      }
      
      
      let linksHtml = '';
      if (route.slug === '' || route.slug === '/') {
        linksHtml = `
        <nav>
          <ul>
            <li><a href="/pdf-to-word">PDF to Word</a></li>
            <li><a href="/compress-pdf">Compress PDF</a></li>
            <li><a href="/merge-pdf">Merge PDF</a></li>
            <li><a href="/jpg-to-pdf">JPG to PDF</a></li>
            <li><a href="/edit-pdf">PDF Editor</a></li>
            <li><a href="/split-pdf">Split PDF</a></li>
          </ul>
        </nav>`;
      }
      
      const seoShell = `    <noscript>
      <header>
        <h1>${route.h1 || route.title}</h1>
        <p>${route.desc || ''}</p>
        ${linksHtml}
      </header>
    </noscript>`;
      modifiedHtml = modifiedHtml.replace(/<body(.*?)>/i, `<body$1>${seoShell}`);
      
      fs.writeFileSync(path.join(routeDir, 'index.html'), modifiedHtml);
    });
  });
  console.log(`Generated ${routes.length} static HTML routes for 200 OK indexing.`);
}


// 2. Generate Sitemap Index and Individual Sitemaps
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
const domain = 'https://www.ilovepdf.in';





const today = new Date().toISOString().split('T')[0];
const addedUrls = new Set();

// A. sitemap-pages.xml
let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
KNOWN_PAGES.forEach(p => {
  const loc = p ? `${domain}/${p}` : domain;
  if (!addedUrls.has(loc)) {
    addedUrls.add(loc);
    pagesXml += `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(today)}</lastmod>\n    <changefreq>${p === '' ? 'daily' : 'weekly'}</changefreq>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  }
});
if (cmsData.pages) {
  cmsData.pages.filter(p => p.status === 'published' && (!p.indexStatus || !p.indexStatus.includes('noindex'))).forEach(p => {
    let clean = p.slug.startsWith('/') ? p.slug.substring(1) : p.slug;
    const loc = clean ? `${domain}/${clean}` : domain;
    if (!addedUrls.has(loc)) {
      addedUrls.add(loc);
      const mod = (p.updatedAt || today).split('T')[0];
      pagesXml += `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(mod)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }
  });
}
pagesXml += '</urlset>';
fs.writeFileSync('dist/sitemap-pages.xml', pagesXml);

// B. sitemap-tools.xml
let toolsXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
KNOWN_TOOLS.forEach(t => {
  const loc = `${domain}/${t}`;
  if (!addedUrls.has(loc)) {
    addedUrls.add(loc);
    toolsXml += `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(today)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }
});
if (cmsData.tools) {
  cmsData.tools.filter(t => t.status === 'active' && (!t.indexStatus || !t.indexStatus.includes('noindex'))).forEach(t => {
    let clean = t.slug.startsWith('/') ? t.slug.substring(1) : t.slug;
    const loc = `${domain}/${clean}`;
    if (!addedUrls.has(loc)) {
      addedUrls.add(loc);
      const mod = (t.updatedAt || today).split('T')[0];
      toolsXml += `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(mod)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    }
  });
}
toolsXml += '</urlset>';
fs.writeFileSync('dist/sitemap-tools.xml', toolsXml);

// C. sitemap-posts.xml
let postsXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
let hasPosts = false;
if (cmsData.blogs && cmsData.blogs.length > 0) {
  cmsData.blogs.filter(b => b.status === 'published' && (!b.indexStatus || !b.indexStatus.includes('noindex'))).forEach(b => {
    const loc = `${domain}/blog/${b.slug}`;
    if (!addedUrls.has(loc)) {
      hasPosts = true;
      addedUrls.add(loc);
      const mod = (b.updatedAt || today).split('T')[0];
      postsXml += `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(mod)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    }
  });
} else {
  // Add blog index at least if no posts
  const loc = `${domain}/blog`;
  if (!addedUrls.has(loc)) {
    hasPosts = true;
    addedUrls.add(loc);
    postsXml += `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${escapeXml(today)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
}
postsXml += '</urlset>';
fs.writeFileSync('dist/sitemap-posts.xml', postsXml);

// D. Sitemap Index
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
indexXml += `  <sitemap>\n    <loc>${domain}/sitemap-pages.xml</loc>\n    <lastmod>${escapeXml(today)}</lastmod>\n  </sitemap>\n`;
indexXml += `  <sitemap>\n    <loc>${domain}/sitemap-tools.xml</loc>\n    <lastmod>${escapeXml(today)}</lastmod>\n  </sitemap>\n`;
if (hasPosts) {
  indexXml += `  <sitemap>\n    <loc>${domain}/sitemap-posts.xml</loc>\n    <lastmod>${escapeXml(today)}</lastmod>\n  </sitemap>\n`;
}
indexXml += '</sitemapindex>';
fs.writeFileSync('dist/sitemap.xml', indexXml);

console.log('Generated sitemap index and split sitemaps');

// 3. Generate Static robots.txt
const robotsText = `User-agent: *
Allow: /
Allow: /favicon.ico
Allow: /favicon-*.png
Allow: /apple-touch-icon.png
Allow: /assets/

# Disallow private user/admin/session endpoints
Disallow: /admin/
Disallow: /user/
Disallow: /api/
Disallow: /download/
Disallow: /downloads/
Disallow: /result/
Disallow: /session/

User-agent: Googlebot-Image
Allow: /favicon.ico
Allow: /favicon-*.png
Allow: /apple-touch-icon.png
Allow: /ilovepdf.svg
Allow: /og-image.png

# Sitemap location
Sitemap: ${domain}/sitemap.xml`;
fs.writeFileSync('dist/robots.txt', robotsText);
console.log('Generated static robots.txt');
