import express from 'express';
import path from 'path';
import fs from 'fs';
import { cmsStore } from '../db/cmsStore.js';
import {
  generateUnifiedSitemapXml,
  getCanonicalDomain
} from '../services/sitemapService.js';

export function registerPublicDynamicRoutes(app: express.Express) {
  // 1. Redirects Middleware
  app.use((req, res, next) => {
    // Skip static assets or API routes
    if (req.path.startsWith('/api') || req.path.includes('.')) {
      return next();
    }

    const redirects = cmsStore.get('redirects') || [];
    const active = redirects.find((r: any) => r.status === 'active' && r.sourceUrl === req.path);

    if (active) {
      const statusCode = parseInt(active.type, 10) || 301;
      return res.redirect(statusCode, active.destinationUrl);
    }

    next();
  });

  // 2. SINGLE UNIFIED SITEMAP XML (All Tools+ Static Pages)
  const handleUnifiedSitemap = (req: express.Request, res: express.Response) => {
    try {
      const bypassCache = req.query.fresh === '1' || req.query.bypass === 'true';
      const { xml, fromCache } = generateUnifiedSitemapXml(bypassCache);

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('X-Robots-Tag', 'noindex');
      res.setHeader('Cache-Control', fromCache ? 'public, max-age=900, stale-while-revalidate=3600' : 'public, max-age=1800, stale-while-revalidate=86400');
      return res.status(200).send(xml);
    } catch (err: any) {
      console.error('Error generating single unified sitemap:', err);
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      return res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`);
    }
  };

  // Primary Single Sitemap
  app.get('/sitemap.xml', handleUnifiedSitemap);

  // 3. Dynamic Robots.txt
  app.get('/robots.txt', (req, res) => {
    const domain = getCanonicalDomain();
    const defaultRobots = `User-agent: *
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
    const rawRobots = cmsStore.get('robotsTxt') || defaultRobots;
    const robotsContent = rawRobots.replace(/\\n/g, '\n');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(robotsContent);
  });

  // 3b. Google Search Console HTML File Verification Handler
  app.get('/google:file.html', (req, res, next) => {
    const gsc = cmsStore.get('gscSettings') || {};
    const requestedFile = `google${req.params.file}.html`;

    if (gsc.verificationHtmlFileName && (requestedFile === gsc.verificationHtmlFileName || requestedFile.startsWith('google'))) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(gsc.verificationHtmlContent || `google-site-verification: ${requestedFile}`);
    }

    next();
  });

  // 4. Public CMS Data Feed Endpoint for Frontend
  app.get('/api/public/cms-data', (req, res) => {
    const pages = cmsStore.get('pages') || [];
    const tools = cmsStore.get('tools') || [];
    const navigation = cmsStore.get('navigation') || {};
    const footer = cmsStore.get('footer') || {};
    const settings = cmsStore.get('settings') || {};

    res.json({
      pages: pages.filter((p: any) => p.status === 'published'),
      tools: tools.sort((a: any, b: any) => (a.position || 0) - (b.position || 0)),
      navigation,
      footer,
      settings
    });
  });

  // 4. Public Theme Endpoint (Central Design Tokens)
  app.get('/api/theme/public', (req, res) => {
    const theme = cmsStore.get('theme');
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({
      success: true,
      theme: theme || null
    });
  });

  // 5. SEO Safe Favicon Endpoint
  app.get('/favicon.ico', (req, res) => {
    const theme = cmsStore.get('theme');
    const customFavicon = theme?.branding?.favicon;
    if (customFavicon && customFavicon.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', customFavicon);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    }
    const defaultFavicon = path.join(process.cwd(), 'public', 'favicon.ico');
    if (fs.existsSync(defaultFavicon)) {
      return res.sendFile(defaultFavicon);
    }
    // Fallback: 1x1 transparent ICO / SVG response
    res.setHeader('Content-Type', 'image/x-icon');
    res.send(Buffer.from([0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x30, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]));
  });
}

