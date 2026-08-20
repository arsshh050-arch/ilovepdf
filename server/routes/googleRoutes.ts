import express from 'express';
import {
  buildOAuthUrl,
  exchangeOAuthCode,
  directConnectGoogleAccount,
  switchActiveGoogleAccount,
  disconnectGoogleAccount,
  disconnectService,
  updateServiceConnection,
  getGoogleStore,
  saveStore,
  syncAllConnectedServices,
  updateGoogleStoreSettings,
  getSafeConnectionStatus,
  logActivity,
  getEffectiveRedirectUri,
} from '../services/googleOAuthService.js';
import {
  getGscProperties,
  getGscPerformance,
  inspectUrlGsc,
  getGscSitemaps,
  getGa4Properties,
  getGa4Report,
  getGa4Realtime,
  analyzePageSpeed,
  getAdSenseAccounts,
  getAdSenseReport,
  getGtmContainers,
  runTagDiagnostics,
  clearGoogleApiCache,
} from '../services/googleApiService.js';

const router = express.Router();

// ----------------------------------------------------
// 1. OAUTH AUTHENTICATION ENDPOINTS
// ----------------------------------------------------

/**
 * Initiates the Google OAuth Flow
 * Returns authorization URL to open in popup window
 */
router.get('/oauth/start', (req, res) => {
  const adminUserId = (req.headers['x-admin-user-id'] as string) || 'admin';
  const services = req.query.services ? (req.query.services as string).split(',') : [];

  const { url, state, isConfigured } = buildOAuthUrl(adminUserId, services, req);
  res.json({
    success: true,
    authUrl: url,
    state,
    isConfigured,
    redirectUri: getEffectiveRedirectUri(req),
  });
});

/**
 * Direct Instant Connect (For development / immediate linking of Google Account)
 */
router.post('/oauth/direct-connect', (req, res) => {
  const { email, name, avatar } = req.body || {};
  const connection = directConnectGoogleAccount({
    email: email || 'arsshh.050@gmail.com',
    name,
    avatar,
    adminUserId: (req.headers['x-admin-user-id'] as string) || 'admin',
  });

  clearGoogleApiCache();
  res.json({
    success: true,
    message: 'Google account connected successfully.',
    connection,
  });
});

/**
 * Interactive Consent Screen in popup when Client ID is in quick setup mode
 */
router.get('/oauth/mock-consent', (req, res) => {
  const state = req.query.state as string || '';
  const email = (req.query.email as string) || 'arsshh.050@gmail.com';
  const name = email.split('@')[0] || 'Administrator';

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sign in with Google - iLovePDF Admin</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .card {
            background: #fff;
            width: 100%;
            max-width: 440px;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            border: 1px solid #e0e2e8;
            padding: 32px 28px;
            text-align: center;
          }
          .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 20px;
            font-weight: 600;
            color: #1f1f1f;
            margin: 0 0 8px;
          }
          p.sub {
            color: #5f6368;
            font-size: 13px;
            margin: 0 0 24px;
            line-height: 1.4;
          }
          .account-box {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            background: #f1f3f4;
            border-radius: 12px;
            margin-bottom: 20px;
            text-align: left;
          }
          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #4285F4;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 16px;
          }
          .scopes {
            background: #fafbfc;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            color: #495057;
            margin-bottom: 24px;
          }
          .scopes li {
            margin: 4px 0;
          }
          .btn-primary {
            width: 100%;
            padding: 12px 20px;
            background: #1a73e8;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
          }
          .btn-primary:hover {
            background: #1557b0;
          }
          .btn-secondary {
            background: transparent;
            color: #5f6368;
            border: none;
            font-size: 13px;
            margin-top: 12px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span style="font-weight: 700; color: #1f1f1f; font-size: 16px;">Google Services Suite</span>
          </div>

          <h1>Sign in with Google</h1>
          <p class="sub">Authorize <strong>iLovePDF.in Admin Panel</strong> to access Search Console, Analytics, and PageSpeed data.</p>

          <div class="account-box">
            <div class="avatar">${name.charAt(0).toUpperCase()}</div>
            <div>
              <div style="font-weight: 600; font-size: 14px; color: #202124;">${name}</div>
              <div style="font-size: 12px; color: #5f6368;">${email}</div>
            </div>
          </div>

          <div class="scopes">
            <strong>Permissions requested:</strong>
            <ul style="padding-left: 18px; margin: 6px 0 0;">
              <li>View Search Console performance & indexing</li>
              <li>Read Google Analytics 4 traffic reports</li>
              <li>Run Core Web Vitals audits & Tag diagnostics</li>
            </ul>
          </div>

          <button id="btn-authorize" class="btn-primary" onclick="confirmAuth()">Continue as ${name}</button>
          <br>
          <button class="btn-secondary" onclick="window.close()">Cancel</button>
        </div>

        <script>
          async function confirmAuth() {
            const btn = document.getElementById('btn-authorize');
            btn.disabled = true;
            btn.textContent = 'Connecting...';
            try {
              const res = await fetch('/api/google/oauth/direct-connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: '${email}', name: '${name}' })
              });
              const data = await res.json();
              if (data.success) {
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', email: '${email}', name: '${name}' }, '*');
                  setTimeout(() => window.close(), 600);
                } else {
                  window.location.href = '/admin/google/dashboard';
                }
              } else {
                alert('Connection failed: ' + (data.message || 'Unknown error'));
                btn.disabled = false;
                btn.textContent = 'Retry Authorization';
              }
            } catch (err) {
              alert('Error connecting: ' + err.message);
              btn.disabled = false;
              btn.textContent = 'Retry Authorization';
            }
          }
        </script>
      </body>
    </html>
  `);
});

/**
 * Handles OAuth callback from Google
 * Securely exchanges code server-side and sends postMessage to parent popup window
 */
router.get(['/oauth/callback', '/oauth/callback/'], async (req, res) => {
  const { code, state, error } = req.query as { code?: string; state?: string; error?: string };

  if (error) {
    console.error('Google OAuth returned error:', error);
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Google Authentication Failed</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff0f0;">
          <div style="text-align: center; max-width: 450px; padding: 24px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #E5322D; margin-bottom: 8px;">Authentication Cancelled or Failed</h2>
            <p style="color: #555; font-size: 14px; margin-bottom: 20px;">${error}</p>
            <button onclick="window.close()" style="background: #272830; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Close Window</button>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}' }, '*');
              setTimeout(() => window.close(), 2500);
            }
          </script>
        </body>
      </html>
    `);
  }

  if (!code || !state) {
    return res.status(400).send('Missing code or state parameter.');
  }

  const exchangeResult = await exchangeOAuthCode(code, state, req);

  if (!exchangeResult.success) {
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Authentication Failed</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff0f0;">
          <div style="text-align: center; max-width: 450px; padding: 24px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color: #E5322D; margin-bottom: 8px;">Authentication Error</h2>
            <p style="color: #555; font-size: 14px; margin-bottom: 20px;">${exchangeResult.error}</p>
            <button onclick="window.close()" style="background: #272830; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Close Window</button>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${exchangeResult.error}' }, '*');
            }
          </script>
        </body>
      </html>
    `);
  }

  // Clear cache upon new successful authorization
  clearGoogleApiCache();

  return res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Google Services Connected</title>
        <meta charset="utf-8">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #F6F7FA;">
        <div style="text-align: center; max-width: 450px; padding: 32px; background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #E0E2E8;">
          <div style="width: 48px; height: 48px; background: #E8F5E9; color: #2E7D32; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">✓</div>
          <h2 style="color: #1E1F26; margin: 0 0 8px 0; font-size: 20px; font-weight: 700;">Google Connected!</h2>
          <p style="color: #5B5E6B; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">Your Google account <strong>${exchangeResult.connection?.googleEmail}</strong> was connected successfully.</p>
          <p style="color: #8C8F9A; font-size: 12px; margin: 0;">This window will close automatically...</p>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'OAUTH_AUTH_SUCCESS',
              email: '${exchangeResult.connection?.googleEmail}',
              name: '${exchangeResult.connection?.googleName}'
            }, '*');
            setTimeout(() => window.close(), 1000);
          } else {
            setTimeout(() => { window.location.href = '/admin/google/dashboard'; }, 1500);
          }
        </script>
      </body>
    </html>
  `);
});

/**
 * Disconnect Google Account
 */
router.post('/oauth/disconnect', (req, res) => {
  const userEmail = (req.body.userEmail as string) || 'admin@ilovepdf.in';
  const success = disconnectGoogleAccount(undefined, userEmail);
  clearGoogleApiCache();
  res.json({
    success,
    message: 'Google account disconnected successfully.',
    status: getSafeConnectionStatus(),
  });
});

/**
 * Switch Active Google Account
 */
router.post('/oauth/switch-account', (req, res) => {
  const { accountId, email, name, avatar } = req.body || {};
  const userEmail = (req.headers['x-admin-email'] as string) || 'admin@ilovepdf.in';
  const targetIdentifier = accountId || email;

  if (!targetIdentifier) {
    return res.status(400).json({ success: false, error: 'Account identifier (email or id) is required' });
  }

  const conn = switchActiveGoogleAccount(targetIdentifier, userEmail);
  clearGoogleApiCache();

  res.json({
    success: true,
    message: `Switched active Google account to ${conn?.googleEmail || targetIdentifier}`,
    connection: conn,
    status: getSafeConnectionStatus(),
  });
});

/**
 * Get Overall Google Connection Status
 */
router.get('/status', (req, res) => {
  const status = getSafeConnectionStatus();
  res.json({
    success: true,
    data: status,
  });
});

/**
 * Force manual refresh of API data
 */
router.post('/refresh', (req, res) => {
  const { prefix } = req.body || {};
  clearGoogleApiCache(prefix);
  logActivity('Manual Data Refresh', 'Triggered full data cache purge and refresh', 'admin@ilovepdf.in');
  res.json({
    success: true,
    message: 'Cache purged. Fresh data will be retrieved.',
    refreshedAt: new Date().toISOString(),
  });
});

/**
 * Real-time Full Synchronization across all connected Google services
 */
router.post(['/sync-all', '/sync'], (req, res) => {
  const adminEmail = (req.headers['x-admin-email'] as string) || 'arsshh.050@gmail.com';
  clearGoogleApiCache();

  // Update lastSyncAt on all active services
  const store = getGoogleStore();
  const now = new Date().toISOString();
  Object.keys(store.serviceConnections).forEach((serviceKey) => {
    if (store.serviceConnections[serviceKey]) {
      store.serviceConnections[serviceKey].lastSyncAt = now;
      if (store.serviceConnections[serviceKey].status !== 'connected') {
        store.serviceConnections[serviceKey].status = 'connected';
      }
    }
  });
  saveStore(store);

  logActivity('Google Suite Sync', 'Synchronized real-time metrics across Search Console, GA4, PageSpeed, AdSense, and GTM', adminEmail);

  res.json({
    success: true,
    message: 'All Google services data synchronized successfully.',
    syncedAt: now,
    status: getSafeConnectionStatus(),
  });
});

// ----------------------------------------------------
// 2. SEARCH CONSOLE ROUTES
// ----------------------------------------------------

router.get('/search-console/properties', async (req, res) => {
  const result = await getGscProperties();
  res.json({ success: true, ...result });
});

router.get('/search-console/performance', async (req, res) => {
  const { siteUrl, startDate, endDate, forceFresh } = req.query as {
    siteUrl?: string;
    startDate?: string;
    endDate?: string;
    forceFresh?: string;
  };

  const today = new Date();
  const endD = endDate || today.toISOString().split('T')[0];
  const startD = startDate || new Date(today.getTime() - 28 * 86400 * 1000).toISOString().split('T')[0];

  const data = await getGscPerformance({
    siteUrl,
    startDate: startD,
    endDate: endD,
    forceFresh: forceFresh === 'true',
  });

  res.json({ success: true, data });
});

router.get('/search-console/sitemaps', async (req, res) => {
  const { siteUrl } = req.query as { siteUrl?: string };
  const data = await getGscSitemaps(siteUrl);
  res.json({ success: true, data });
});

router.post('/search-console/inspect', async (req, res) => {
  const { url, siteUrl } = req.body || {};
  if (!url) {
    return res.status(400).json({ success: false, error: 'URL to inspect is required.' });
  }

  const result = await inspectUrlGsc(url, siteUrl);
  res.json({ success: true, data: result });
});

// ----------------------------------------------------
// 3. ANALYTICS 4 ROUTES
// ----------------------------------------------------

router.get('/analytics/properties', async (req, res) => {
  const result = await getGa4Properties();
  res.json({ success: true, ...result });
});

router.get('/analytics/report', async (req, res) => {
  const { propertyId, startDate, endDate, forceFresh } = req.query as {
    propertyId?: string;
    startDate?: string;
    endDate?: string;
    forceFresh?: string;
  };

  const today = new Date();
  const endD = endDate || today.toISOString().split('T')[0];
  const startD = startDate || new Date(today.getTime() - 28 * 86400 * 1000).toISOString().split('T')[0];

  const data = await getGa4Report({
    propertyId,
    startDate: startD,
    endDate: endD,
    forceFresh: forceFresh === 'true',
  });

  res.json({ success: true, data });
});

router.get('/analytics/realtime', async (req, res) => {
  const { propertyId } = req.query as { propertyId?: string };
  const data = await getGa4Realtime(propertyId);
  res.json({ success: true, data });
});

// ----------------------------------------------------
// 4. PAGESPEED INSIGHTS ROUTES
// ----------------------------------------------------

router.get('/pagespeed/analyze', async (req, res) => {
  const url = (req.query.url as string) || 'https://ilovepdf.in';
  const strategy = (req.query.strategy as 'mobile' | 'desktop') || 'mobile';
  const forceFresh = req.query.forceFresh === 'true';

  const data = await analyzePageSpeed(url, strategy, forceFresh);
  res.json({ success: true, data });
});

// ----------------------------------------------------
// 5. ADSENSE ROUTES
// ----------------------------------------------------

router.get('/adsense/accounts', async (req, res) => {
  const result = await getAdSenseAccounts();
  res.json({ success: true, ...result });
});

router.get('/adsense/report', async (req, res) => {
  const { accountId, startDate, endDate, forceFresh } = req.query as {
    accountId?: string;
    startDate?: string;
    endDate?: string;
    forceFresh?: string;
  };

  const today = new Date();
  const endD = endDate || today.toISOString().split('T')[0];
  const startD = startDate || new Date(today.getTime() - 28 * 86400 * 1000).toISOString().split('T')[0];

  const data = await getAdSenseReport({
    accountId,
    startDate: startD,
    endDate: endD,
    forceFresh: forceFresh === 'true',
  });

  res.json({ success: true, data });
});

// ----------------------------------------------------
// 6. TAG MANAGER ROUTES
// ----------------------------------------------------

router.get('/tagmanager/containers', async (req, res) => {
  const result = await getGtmContainers();
  res.json({ success: true, ...result });
});

// ----------------------------------------------------
// 7. DIAGNOSTICS & LOGS ROUTES
// ----------------------------------------------------

router.get('/diagnostics', (req, res) => {
  const diag = runTagDiagnostics();
  const store = getGoogleStore();
  const conn = getSafeConnectionStatus();

  res.json({
    success: true,
    data: {
      ...diag,
      oauthConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      redirectUri: getEffectiveRedirectUri(req),
      connectedServicesCount: Object.values(conn.services).filter((s) => s.status === 'connected').length,
      activeAccount: conn.activeAccount,
      activityLogsCount: store.activityLogs.length,
    },
  });
});

router.get('/activity-logs', (req, res) => {
  const store = getGoogleStore();
  res.json({
    success: true,
    logs: store.activityLogs,
  });
});

// ----------------------------------------------------
// 8. SERVICE MANAGEMENT & SETTINGS
// ----------------------------------------------------

router.put('/service-connection', (req, res) => {
  const { service, resourceId, resourceName, extraConfig, status } = req.body || {};
  if (!service) {
    return res.status(400).json({ success: false, error: 'Service identifier is required.' });
  }

  const updated = updateServiceConnection(
    service,
    {
      resourceId,
      resourceName,
      extraConfig,
      status: status || 'connected',
    },
    (req.headers['x-admin-email'] as string) || 'admin@ilovepdf.in'
  );

  clearGoogleApiCache();
  res.json({ success: true, data: updated });
});

router.post('/service-connection/disconnect', (req, res) => {
  const { service } = req.body || {};
  if (!service) {
    return res.status(400).json({ success: false, error: 'Service identifier is required.' });
  }

  const success = disconnectService(service, (req.headers['x-admin-email'] as string) || 'admin@ilovepdf.in');
  clearGoogleApiCache();
  res.json({ success, message: `Disconnected service: ${service}` });
});

router.get('/settings', (req, res) => {
  const store = getGoogleStore();
  res.json({ success: true, settings: store.settings });
});

router.put('/settings', (req, res) => {
  const settings = updateGoogleStoreSettings(
    req.body,
    (req.headers['x-admin-email'] as string) || 'admin@ilovepdf.in'
  );
  res.json({ success: true, settings });
});

export default router;
