import { cmsStore } from '../db/cmsStore.js';


export interface SitemapEntry {
  type: 'page' | 'tool' | 'blog';
  id: string;
  slug: string;
  url: string;
  title: string;
  publishedDate?: string;
  lastmod: string;
  status: string;
  isIndexable: boolean;
  priority: string;
  changefreq: string;
  canonical: string;
  featuredImageUrl?: string;
  featuredImageTitle?: string;
  exclusionReason?: string;
}

export interface SingleSitemapDiagnostics {
  sitemapUrl: string;
  domain: string;
  status: 'healthy' | 'warning' | 'error';
  totalUrls: number;
  totalPages: number;
  totalTools: number;
  totalBlogPosts: number;
  totalExcluded: number;
  lastGenerated: string;
  lastContentChange: string;
  cacheHit: boolean;
  entries: SitemapEntry[];
}

// Memory Cache
interface CacheEntry {
  xml: string;
  generatedAt: number;
}

let unifiedSitemapCache: CacheEntry | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 min cache

export function getCanonicalDomain(): string {
  const envUrl = process.env.SITE_URL || 'https://www.ilovepdf.in';
  let clean = envUrl.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  if (clean.startsWith('http://')) {
    clean = clean.replace('http://', 'https://');
  }
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
}

export function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function formatW3CDate(dateInput: any): string {
  if (!dateInput) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      const str = String(dateInput).split('T')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
      return new Date().toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export function invalidateSitemapCache() {
  unifiedSitemapCache = null;
}

export const ALL_CANONICAL_TOOLS: { slug: string; name: string; priority: string; changefreq: string }[] = [
  { slug: 'merge-pdf', name: 'Merge PDF', priority: '1.0', changefreq: 'daily' },
  { slug: 'split-pdf', name: 'Split PDF', priority: '0.9', changefreq: 'daily' },
  { slug: 'compress-pdf', name: 'Compress PDF', priority: '1.0', changefreq: 'daily' },
  { slug: 'pdf-to-word', name: 'PDF to Word Converter', priority: '1.0', changefreq: 'daily' },
  { slug: 'pdf-to-powerpoint', name: 'PDF to PowerPoint Converter', priority: '0.9', changefreq: 'weekly' },
  { slug: 'pdf-to-excel', name: 'PDF to Excel Converter', priority: '0.9', changefreq: 'weekly' },
  { slug: 'word-to-pdf', name: 'Word to PDF Converter', priority: '0.9', changefreq: 'weekly' },
  { slug: 'powerpoint-to-pdf', name: 'PowerPoint to PDF Converter', priority: '0.9', changefreq: 'weekly' },
  { slug: 'excel-to-pdf', name: 'Excel to PDF Converter', priority: '0.9', changefreq: 'weekly' },
  { slug: 'edit-pdf', name: 'Edit PDF', priority: '1.0', changefreq: 'daily' },
  { slug: 'pdf-to-jpg', name: 'PDF to JPG Converter', priority: '0.9', changefreq: 'weekly' },
  { slug: 'jpg-to-pdf', name: 'JPG to PDF Converter', priority: '0.9', changefreq: 'weekly' },
  { slug: 'sign-pdf', name: 'Sign PDF', priority: '0.9', changefreq: 'weekly' },
  { slug: 'watermark-pdf', name: 'Watermark PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'rotate-pdf', name: 'Rotate PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'html-to-pdf', name: 'HTML to PDF Converter', priority: '0.8', changefreq: 'weekly' },
  { slug: 'unlock-pdf', name: 'Unlock PDF', priority: '0.9', changefreq: 'weekly' },
  { slug: 'protect-pdf', name: 'Protect PDF with Password', priority: '0.9', changefreq: 'weekly' },
  { slug: 'organize-pdf', name: 'Organize PDF Pages', priority: '0.9', changefreq: 'weekly' },
  { slug: 'pdf-to-pdfa', name: 'PDF to PDF/A Converter', priority: '0.8', changefreq: 'weekly' },
  { slug: 'repair-pdf', name: 'Repair Corrupted PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'add-page-numbers', name: 'Add Page Numbers to PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'scan-to-pdf', name: 'Scan to PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'ocr-pdf', name: 'OCR PDF (Text Recognition)', priority: '0.9', changefreq: 'daily' },
  { slug: 'compare-pdf', name: 'Compare PDF Files', priority: '0.8', changefreq: 'weekly' },
  { slug: 'redact-pdf', name: 'Redact PDF (Blackout Text)', priority: '0.8', changefreq: 'weekly' },
  { slug: 'crop-pdf', name: 'Crop PDF Margins', priority: '0.8', changefreq: 'weekly' },
  { slug: 'pdf-forms', name: 'Fill & Create PDF Forms', priority: '0.8', changefreq: 'weekly' },
  { slug: 'ai-pdf-summarizer', name: 'AI PDF Summarizer', priority: '0.9', changefreq: 'daily' },
  { slug: 'translate-pdf', name: 'Translate PDF Documents', priority: '0.8', changefreq: 'weekly' },
  { slug: 'pdf-to-markdown', name: 'PDF to Markdown', priority: '0.8', changefreq: 'weekly' },
  { slug: 'remove-pages', name: 'Remove Pages from PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'extract-pages', name: 'Extract Pages from PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'png-to-pdf', name: 'PNG to PDF Converter', priority: '0.8', changefreq: 'weekly' },
  { slug: 'pdf-to-png', name: 'PDF to PNG Converter', priority: '0.8', changefreq: 'weekly' },
  { slug: 'pdf-to-txt', name: 'PDF to TXT Converter', priority: '0.8', changefreq: 'weekly' },
  { slug: 'txt-to-pdf', name: 'TXT to PDF Converter', priority: '0.8', changefreq: 'weekly' },
  { slug: 'pdf-to-html', name: 'PDF to HTML Converter', priority: '0.8', changefreq: 'weekly' },
  { slug: 'remove-pdf-metadata', name: 'Remove PDF Metadata', priority: '0.8', changefreq: 'weekly' },
  { slug: 'flatten-pdf', name: 'Flatten PDF Form Fields', priority: '0.8', changefreq: 'weekly' },
  { slug: 'extract-pdf-text', name: 'Extract PDF Text', priority: '0.8', changefreq: 'weekly' },
  { slug: 'pdf-question-answer', name: 'Ask PDF with AI', priority: '0.9', changefreq: 'daily' },
  { slug: 'extract-pdf-tables', name: 'Extract Tables from PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'annotate-pdf', name: 'Annotate & Markup PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'add-text-pdf', name: 'Add Text to PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'add-image-pdf', name: 'Add Image to PDF', priority: '0.8', changefreq: 'weekly' },
  { slug: 'draw-on-pdf', name: 'Draw & Freehand on PDF', priority: '0.8', changefreq: 'weekly' }
];

export const ALL_CANONICAL_PAGES: { slug: string; name: string; priority: string; changefreq: string }[] = [
  { slug: '', name: 'iLovePDF - Online PDF Tools for PDF Lovers', priority: '1.0', changefreq: 'daily' },
  { slug: 'pdf-tools', name: 'All PDF Tools Directory', priority: '0.9', changefreq: 'weekly' },
  { slug: 'convert-pdf', name: 'Convert PDF Tools', priority: '0.9', changefreq: 'weekly' },
  { slug: 'organize-pdf-tools', name: 'Organize PDF Tools', priority: '0.8', changefreq: 'weekly' },
  { slug: 'edit-pdf-tools', name: 'Edit PDF Tools', priority: '0.8', changefreq: 'weekly' },
  { slug: 'pdf-security', name: 'PDF Security & Protection Tools', priority: '0.8', changefreq: 'weekly' },
  { slug: 'pdf-ai-tools', name: 'AI-Powered PDF Intelligence Tools', priority: '0.9', changefreq: 'weekly' },
  { slug: 'blog', name: 'iLovePDF Blog & Tutorials', priority: '0.9', changefreq: 'daily' },
  { slug: 'pricing', name: 'Pricing Plans & Premium Features', priority: '0.8', changefreq: 'monthly' },
  { slug: 'business', name: 'iLovePDF for Business & Enterprise', priority: '0.8', changefreq: 'monthly' },
  { slug: 'api', name: 'Developer REST API', priority: '0.8', changefreq: 'monthly' },
  { slug: 'features', name: 'Platform Features & Capability Overview', priority: '0.7', changefreq: 'monthly' },
  { slug: 'security', name: 'Security, Encryption & Privacy Standards', priority: '0.7', changefreq: 'monthly' },
  { slug: 'faq', name: 'Frequently Asked Questions', priority: '0.7', changefreq: 'monthly' },
  { slug: 'about', name: 'About iLovePDF', priority: '0.6', changefreq: 'monthly' },
  { slug: 'contact', name: 'Contact Support & Inquiries', priority: '0.6', changefreq: 'monthly' },
  { slug: 'privacy-policy', name: 'Privacy Policy', priority: '0.5', changefreq: 'yearly' },
  { slug: 'terms', name: 'Terms of Service', priority: '0.5', changefreq: 'yearly' },
  { slug: 'cookie-policy', name: 'Cookie Policy', priority: '0.5', changefreq: 'yearly' }
];

/**
 * Gather all website items (Pages + Tools + Blog Posts)
 */
export function getAllWebsiteSitemapEntries(): {
  eligible: SitemapEntry[];
  all: SitemapEntry[];
  counts: {
    total: number;
    pages: number;
    tools: number;
    blogPosts: number;
    excluded: number;
  };
  latestModifiedDate: string;
} {
  const domain = getCanonicalDomain();
  const todayStr = new Date().toISOString().split('T')[0];
  let latestModified = '2026-01-01';

  const allEntries: SitemapEntry[] = [];
  const eligibleEntries: SitemapEntry[] = [];

  let pagesCount = 0;
  let toolsCount = 0;
  let blogCount = 0;
  let excludedCount = 0;

  const addedUrls = new Set<string>();

  // 1. Static & CMS Pages
  const rawPages: any[] = cmsStore.get('pages') || [];
  const cmsPageMap = new Map<string, any>();
  rawPages.forEach(p => {
    if (p && p.slug) {
      cmsPageMap.set(p.slug.toLowerCase().trim().replace(/^\/+|\/+$/g, ''), p);
    }
  });

  ALL_CANONICAL_PAGES.forEach(pageDef => {
    const slug = pageDef.slug;
    const cmsOverride = cmsPageMap.get(slug);
    const url = slug ? `${domain}/${slug}` : domain;
    
    if (addedUrls.has(url)) return;
    addedUrls.add(url);

    const isNoIndex = cmsOverride?.indexStatus?.includes('noindex') || cmsOverride?.status === 'draft';
    const lastmod = formatW3CDate(cmsOverride?.updatedAt || cmsOverride?.updatedDate || todayStr);
    if (lastmod > latestModified) latestModified = lastmod;

    const entry: SitemapEntry = {
      type: 'page',
      id: `page-${slug || 'home'}`,
      slug,
      url,
      title: cmsOverride?.title || pageDef.name,
      lastmod,
      status: cmsOverride?.status || 'published',
      isIndexable: !isNoIndex,
      priority: pageDef.priority,
      changefreq: pageDef.changefreq,
      canonical: url,
      exclusionReason: isNoIndex ? 'Noindex or draft' : undefined
    };

    allEntries.push(entry);
    if (!isNoIndex) {
      eligibleEntries.push(entry);
      pagesCount++;
    } else {
      excludedCount++;
    }
  });

  // Additional custom CMS pages created in Admin
  rawPages.forEach(p => {
    const cleanSlug = (p.slug || '').toLowerCase().trim().replace(/^\/+|\/+$/g, '');
    if (!cleanSlug) return;
    const url = `${domain}/${cleanSlug}`;
    if (addedUrls.has(url)) return;
    addedUrls.add(url);

    const isEligible = p.status === 'published' && (!p.indexStatus || !p.indexStatus.includes('noindex'));
    const lastmod = formatW3CDate(p.updatedAt || todayStr);
    if (lastmod > latestModified) latestModified = lastmod;

    const entry: SitemapEntry = {
      type: 'page',
      id: p.id || `page-${cleanSlug}`,
      slug: cleanSlug,
      url,
      title: p.title || cleanSlug,
      lastmod,
      status: p.status || 'published',
      isIndexable: isEligible,
      priority: '0.7',
      changefreq: 'monthly',
      canonical: url,
      exclusionReason: isEligible ? undefined : 'CMS page inactive or noindex'
    };

    allEntries.push(entry);
    if (isEligible) {
      eligibleEntries.push(entry);
      pagesCount++;
    } else {
      excludedCount++;
    }
  });

  // 2. All 47+ PDF Tools
  const rawTools: any[] = cmsStore.get('tools') || [];
  const cmsToolMap = new Map<string, any>();
  rawTools.forEach(t => {
    if (t && t.slug) {
      cmsToolMap.set(t.slug.toLowerCase().trim().replace(/^\/+|\/+$/g, ''), t);
    }
  });

  ALL_CANONICAL_TOOLS.forEach(toolDef => {
    const slug = toolDef.slug;
    const cmsOverride = cmsToolMap.get(slug);
    const url = `${domain}/${slug}`;

    if (addedUrls.has(url)) return;
    addedUrls.add(url);

    const isNoIndex = cmsOverride?.status === 'inactive' || cmsOverride?.indexStatus?.includes('noindex');
    const lastmod = formatW3CDate(cmsOverride?.updatedAt || cmsOverride?.updatedDate || todayStr);
    if (lastmod > latestModified) latestModified = lastmod;

    const entry: SitemapEntry = {
      type: 'tool',
      id: `tool-${slug}`,
      slug,
      url,
      title: cmsOverride?.name || toolDef.name,
      lastmod,
      status: cmsOverride?.status || 'active',
      isIndexable: !isNoIndex,
      priority: toolDef.priority,
      changefreq: toolDef.changefreq,
      canonical: url,
      exclusionReason: isNoIndex ? 'Tool marked inactive or noindex' : undefined
    };

    allEntries.push(entry);
    if (!isNoIndex) {
      eligibleEntries.push(entry);
      toolsCount++;
    } else {
      excludedCount++;
    }
  });

  // 3. All Blog Posts (CMS database + seeded index)
  const rawBlogs: any[] = cmsStore.get('blogs') || [];
  const blogMap = new Map<string, any>();

  rawBlogs.forEach((b) => {
    if (b && b.slug) {
      const normSlug = b.slug.toLowerCase().trim();
      blogMap.set(normSlug, {
        ...blogMap.get(normSlug),
        ...b,
        slug: normSlug
      });
    }
  });

  const nowTime = Date.now();

  for (const blog of blogMap.values()) {
    const slug = (blog.slug || '').toLowerCase().trim().replace(/^\/+|\/+$/g, '');
    if (!slug) continue;

    const url = `${domain}/blog/${slug}`;
    if (addedUrls.has(url)) continue;
    addedUrls.add(url);

    const pubDate = blog.publishedDate || blog.publishedAt || blog.createdDate || todayStr;
    const modDate = blog.updatedDate || blog.modifiedDate || blog.lastMeaningfulUpdatedAt || pubDate;
    
    const formattedPubDate = formatW3CDate(pubDate);
    const formattedModDate = formatW3CDate(modDate);

    if (formattedModDate > latestModified) {
      latestModified = formattedModDate;
    }

    const status = (blog.status || 'draft').toLowerCase().trim();
    const isPublic = blog.public !== false && !blog.isPrivate && !blog.private;
    const isTrashed = status === 'trash' || status === 'deleted';
    const isDraft = status === 'draft' || status === 'pending' || status === 'review' || status === 'preview';
    const isPublished = status === 'published';

    // Scheduled check: date in future
    let isScheduled = false;
    try {
      const pubTimestamp = new Date(pubDate).getTime();
      if (!isNaN(pubTimestamp) && pubTimestamp > (nowTime + 60 * 1000)) {
        isScheduled = true;
      }
    } catch {
      isScheduled = false;
    }

    const rawIndexStatus = (blog.indexStatus || 'index,follow').toLowerCase();
    const isExplicitNoindex = rawIndexStatus.includes('noindex') ||
      blog.robots?.index === false ||
      blog.seo?.robots?.index === false ||
      blog.noindex === true;

    let exclusionReason: string | undefined;
    if (isTrashed || !isPublic) {
      exclusionReason = isTrashed ? 'Moved to trash' : 'Marked as private';
    } else if (isDraft) {
      exclusionReason = `Status is ${status}`;
    } else if (isScheduled) {
      exclusionReason = `Scheduled for future (${formattedPubDate})`;
    } else if (isExplicitNoindex) {
      exclusionReason = 'Meta robots set to noindex';
    } else if (!isPublished) {
      exclusionReason = `Unpublished: ${status}`;
    }

    const isEligible = !exclusionReason;

    const entry: SitemapEntry = {
      type: 'blog',
      id: blog.id || `blog-${slug}`,
      slug,
      url,
      title: blog.title || slug,
      publishedDate: formattedPubDate,
      lastmod: formattedModDate,
      status,
      isIndexable: isEligible,
      priority: '0.8',
      changefreq: 'weekly',
      canonical: blog.canonical || url,
      featuredImageUrl: blog.featuredImage?.url?.startsWith('http')
        ? blog.featuredImage.url
        : blog.featuredImage?.url
          ? `${domain}${blog.featuredImage.url.startsWith('/') ? '' : '/'}${blog.featuredImage.url}`
          : undefined,
      featuredImageTitle: blog.featuredImage?.alt || blog.title,
      exclusionReason
    };

    allEntries.push(entry);
    if (isEligible) {
      eligibleEntries.push(entry);
      blogCount++;
    } else {
      excludedCount++;
    }
  }

  return {
    eligible: eligibleEntries,
    all: allEntries,
    counts: {
      total: eligibleEntries.length,
      pages: pagesCount,
      tools: toolsCount,
      blogPosts: blogCount,
      excluded: excludedCount
    },
    latestModifiedDate: latestModified
  };
}

/**
 * GENERATE 1 SINGLE UNIFIED SITEMAP XML containing ALL tools, pages, and blog posts
 */
export function generateUnifiedSitemapXml(bypassCache = false): { xml: string; fromCache: boolean } {
  const now = Date.now();
  if (!bypassCache && unifiedSitemapCache && (now - unifiedSitemapCache.generatedAt < CACHE_TTL_MS)) {
    return { xml: unifiedSitemapCache.xml, fromCache: true };
  }

  const { eligible } = getAllWebsiteSitemapEntries();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  const seenUrls = new Set<string>();

  for (const item of eligible) {
    if (seenUrls.has(item.url)) continue;
    seenUrls.add(item.url);

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(item.url)}</loc>\n`;
    xml += `    <lastmod>${escapeXml(item.lastmod)}</lastmod>\n`;
    xml += `    <changefreq>${escapeXml(item.changefreq)}</changefreq>\n`;
    xml += `    <priority>${escapeXml(item.priority)}</priority>\n`;

    if (item.featuredImageUrl && (
      item.featuredImageUrl.endsWith('.jpg') ||
      item.featuredImageUrl.endsWith('.png') ||
      item.featuredImageUrl.endsWith('.webp') ||
      item.featuredImageUrl.endsWith('.svg') ||
      item.featuredImageUrl.includes('/assets/')
    )) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(item.featuredImageUrl)}</image:loc>\n`;
      if (item.featuredImageTitle) {
        xml += `      <image:title><![CDATA[${item.featuredImageTitle.replace(/\]\]>/g, ']]&gt;')}]]></image:title>\n`;
      }
      xml += `    </image:image>\n`;
    }

    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  unifiedSitemapCache = {
    xml,
    generatedAt: now
  };

  return { xml, fromCache: false };
}

/**
 * Single Sitemap Diagnostics for the Admin Dashboard
 */
export function getSingleSitemapDiagnostics(): SingleSitemapDiagnostics {
  const domain = getCanonicalDomain();
  const { eligible, all, counts, latestModifiedDate } = getAllWebsiteSitemapEntries();
  const isCacheActive = Boolean(unifiedSitemapCache);

  return {
    sitemapUrl: `${domain}/sitemap.xml`,
    domain,
    status: counts.total > 0 ? 'healthy' : 'warning',
    totalUrls: counts.total,
    totalPages: counts.pages,
    totalTools: counts.tools,
    totalBlogPosts: counts.blogPosts,
    totalExcluded: counts.excluded,
    lastGenerated: unifiedSitemapCache ? new Date(unifiedSitemapCache.generatedAt).toISOString() : new Date().toISOString(),
    lastContentChange: latestModifiedDate,
    cacheHit: isCacheActive,
    entries: all
  };
}
