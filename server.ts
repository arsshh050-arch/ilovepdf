import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { registerPdfRoutes } from './server/routes/pdfRoutes.js';
import indexingRoutes, { initAutoIndexingScheduler } from './server/routes/indexingRoutes.js';
import googleRoutes from './server/routes/googleRoutes.js';
import publicAuthRoutes from './server/routes/publicAuthRoutes.js';
import { registerPublicDynamicRoutes } from './server/routes/publicDynamicRoutes.js';

async function startServer() {
  const app = express();
  app.set('trust proxy', true);
  const PORT = 3000;

  // Enforce WWW canonical domain redirect
  app.use((req, res, next) => {
    let host = req.headers['x-forwarded-host'] || req.headers.host || req.hostname || '';
    if (Array.isArray(host)) host = host[0];
    const primaryHost = host.split(',')[0].trim();
    
    // Check if we need to redirect host
    const needsHostRedirect = (primaryHost === 'ilovepdf.in' || primaryHost.startsWith('ilovepdf.in:'));
    
    // Check if we need to redirect path (remove /index.html or trailing slash)
    let newPath = req.path;
    if (newPath === '/index.html') {
      newPath = '/';
    } else if (newPath.endsWith('.html') && newPath !== '/404.html') {
      newPath = newPath.substring(0, newPath.length - 5);
    } else if (newPath !== '/' && newPath.endsWith('/')) {
      newPath = newPath.replace(/\/+$/, '');
    }

    const needsPathRedirect = newPath !== req.path;
    
    if (needsHostRedirect || needsPathRedirect) {
      const targetHost = needsHostRedirect ? 'www.ilovepdf.in' : primaryHost;
      // We assume https if they are using the custom domain, otherwise keep relative if no host redirect
      if (needsHostRedirect) {
        const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
        return res.redirect(301, `https://${targetHost}${newPath === '/' && query === '' ? '' : newPath}${query}`);
      } else {
        const query = req.url.slice(req.path.length);
        return res.redirect(301, `${newPath === '/' && query === '' ? '/' : newPath}${query}`);
      }
    }
    
    next();
  });

  // Middleware
  app.use(cors());
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(express.json());

  // Setup temporary storage for processing
  const TEMP_DIR = process.env.TEMP_STORAGE_PATH || path.join(os.tmpdir(), 'ilovepdf-results');
  const SESSION_DIR = process.env.SESSION_STORAGE_PATH || path.join(os.tmpdir(), 'ilovepdf-sessions');

  [TEMP_DIR, SESSION_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Basic API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ilovepdf.in',
      timestamp: new Date().toISOString()
    });
  });

  // Serve ads.txt directly for AdSense crawlers
  app.get('/ads.txt', (req, res) => {
    const adsTxtPath = path.join(process.cwd(), 'public', 'ads.txt');
    if (fs.existsSync(adsTxtPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.sendFile(adsTxtPath);
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send('google.com, pub-8425835801067277, DIRECT, f08c47fec0942fa0\n');
  });

  // Business Contact Endpoint
  const contactRateLimits = new Map<string, number[]>();

  app.post('/api/business/contact', (req, res) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 mins
    const recentRequests = (contactRateLimits.get(clientIp) || []).filter(ts => now - ts < windowMs);

    if (recentRequests.length >= 5) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a few minutes before trying again.'
      });
    }

    const { firstName, lastName, company, email, teamSize, country, message, honeypot } = req.body || {};

    // Anti-spam honeypot
    if (honeypot) {
      return res.json({
        success: true,
        message: 'Thanks. Your request has been received.'
      });
    }

    // Server-side validation
    if (!firstName?.trim() || !lastName?.trim() || !company?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        error: 'Please complete all required fields (First Name, Last Name, Company, Email, Message).'
      });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        error: 'Please enter a valid business email address.'
      });
    }

    recentRequests.push(now);
    contactRateLimits.set(clientIp, recentRequests);

    console.log(`[BUSINESS LEAD RECEIVED] Name: ${firstName} ${lastName} | Company: ${company} | Email: ${email} | Team: ${teamSize} | Country: ${country} | Msg: ${message}`);

    return res.json({
      success: true,
      message: 'Thanks. Your request has been received.'
    });
  });

  // Register dynamic public routes & redirects
  registerPublicDynamicRoutes(app);

  // Register Google Services / Site Kit Suite API routes
  app.use('/api/google', googleRoutes);

  // Register Public Auth routes (Google Sign-In verification)
  app.use('/api/auth', publicAuthRoutes);

  // Register Google & IndexNow Auto Indexing routes
  app.use('/api/indexing', indexingRoutes);

  // Import tool routes
  registerPdfRoutes(app);

  // API Express Error Handler (catches multer errors & unhandled route errors)
  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', err);
    if (res.headersSent) {
      return next(err);
    }
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      error: err.message || 'An error occurred while processing the PDF request.'
    });
  });

  // Catch-all 404 for unhandled API endpoints so they don't fall through to Vite SPA index.html
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: `API endpoint ${req.originalUrl} not found.` });
  });

  // Vite middleware for development or Static files for production
  if (process.env.NODE_ENV !== "production") {
    // Explicitly serve public static assets
    app.use(express.static(path.join(process.cwd(), 'public')));

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for SPA routing in development
    app.get('*', async (req, res, next) => {
      if (req.path.includes('.')) return next();
      try {
        const indexPath = path.join(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Disable directory redirects to prevent canonical mismatch
    app.use(express.static(distPath, { redirect: false }));
    
    app.get('*', (req, res) => {
      if (req.path.includes('.')) {
        return res.status(404).send('File not found');
      }
      
      const cleanPath = req.path.replace(/\/+$/, '');
      const prerenderedPath = path.join(distPath, cleanPath, 'index.html');
      
      if (cleanPath !== '' && fs.existsSync(prerenderedPath)) {
        return res.sendFile(prerenderedPath);
      }
      
      // Known SPA routes that aren't prerendered but should return 200 OK
      const isKnownSpaRoute = /^\/(login|signup|forgot-password|admin|result|download|session)(\/|$)/.test(req.path) || req.path === '/';
      
      if (!isKnownSpaRoute) {
        // Send actual 404 HTTP status for unknown routes to avoid soft-404 index pollution
        // But still serve the 404.html payload (or index.html fallback) so React can render the friendly Not Found page
        const notFoundPath = path.join(distPath, '404.html');
        if (fs.existsSync(notFoundPath)) {
          return res.status(404).sendFile(notFoundPath);
        }
        return res.status(404).sendFile(path.join(distPath, 'index.html'));
      }
      
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    initAutoIndexingScheduler();
  });
}

startServer().catch(console.error);
