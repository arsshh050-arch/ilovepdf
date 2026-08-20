import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CONFIG_FILE = path.join(process.cwd(), 'data', 'indexing_config.json');
const LOGS_FILE = path.join(process.cwd(), 'data', 'indexing_logs.json');
const INDEXNOW_KEY_FILE = path.join(process.cwd(), 'public', 'indexnow_key.txt');

export interface IndexingConfig {
  serviceAccountJson?: string;
  indexNowKey?: string;
  autoIndexOnPublish?: boolean;
  lastRunTimestamp?: string;
}

export interface IndexingLogEntry {
  id: string;
  timestamp: string;
  url: string;
  target: 'google' | 'indexnow' | 'ping';
  status: 'success' | 'failed' | 'pending';
  statusCode?: number;
  message: string;
}

export function ensureIndexNowKey(): string {
  try {
    if (fs.existsSync(INDEXNOW_KEY_FILE)) {
      const key = fs.readFileSync(INDEXNOW_KEY_FILE, 'utf-8').trim();
      if (key) return key;
    }
    const newKey = crypto.randomBytes(16).toString('hex');
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(INDEXNOW_KEY_FILE, newKey, 'utf-8');
    return newKey;
  } catch (err) {
    console.error('Failed to initialize IndexNow key:', err);
    return 'e93ffdf6d131f6df9433ee3c9075ceee';
  }
}

export function getIndexingConfig(): IndexingConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading indexing config:', err);
  }

  return {
    serviceAccountJson: process.env.GOOGLE_SEARCH_CONSOLE_JSON_KEY || '',
    indexNowKey: process.env.INDEXNOW_KEY || ensureIndexNowKey(),
    autoIndexOnPublish: true,
  };
}

export function saveIndexingConfig(config: IndexingConfig): void {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');

    if (config.indexNowKey) {
      const publicDir = path.join(process.cwd(), 'public');
      fs.writeFileSync(path.join(publicDir, 'indexnow_key.txt'), config.indexNowKey, 'utf-8');
    }
  } catch (err) {
    console.error('Error saving indexing config:', err);
  }
}

export function getIndexingLogs(): IndexingLogEntry[] {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading indexing logs:', err);
  }
  return [];
}

export function addIndexingLog(entry: Omit<IndexingLogEntry, 'id' | 'timestamp'>): IndexingLogEntry {
  const logs = getIndexingLogs();
  const newEntry: IndexingLogEntry = {
    ...entry,
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newEntry);
  const trimmed = logs.slice(0, 100);
  try {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving indexing log:', err);
  }
  return newEntry;
}

async function getGoogleAccessToken(saJsonString: string): Promise<string> {
  const sa = JSON.parse(saJsonString);
  if (!sa.client_email || !sa.private_key) {
    throw new Error('Invalid Service Account JSON: client_email and private_key are required.');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64Url = (str: string) =>
    Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedClaimSet = base64Url(JSON.stringify(claimSet));
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

  let privateKey = sa.private_key;
  if (typeof privateKey === 'string') {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${signatureInput}.${signature}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errText = await tokenResponse.text();
    console.error(`Google OAuth token fetch failed (${tokenResponse.status}):`, errText);
    throw new Error(`Google OAuth error (${tokenResponse.status}): ${errText.slice(0, 200)}`);
  }

  const data = await tokenResponse.json() as { access_token?: string };
  if (!data.access_token) {
    throw new Error('Google OAuth token response missing access_token');
  }
  return data.access_token;
}

export async function submitToGoogleIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED') {
  const config = getIndexingConfig();
  const saJson = config.serviceAccountJson || process.env.GOOGLE_SEARCH_CONSOLE_JSON_KEY;

  if (!saJson) {
    const msg = 'Google Search Console Service Account JSON key is not configured.';
    addIndexingLog({ url, target: 'google', status: 'failed', message: msg });
    return { success: false, message: msg };
  }

  try {
    const accessToken = await getGoogleAccessToken(saJson);
    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ url, type }),
    });

    let resData: any;
    const resText = await response.text();
    try {
      resData = JSON.parse(resText);
    } catch {
      resData = { error: { message: resText } };
    }

    if (response.ok) {
      const msg = `Successfully submitted ${url} to Google Search Console Indexing API`;
      addIndexingLog({ url, target: 'google', status: 'success', statusCode: response.status, message: msg });
      return { success: true, message: msg, response: resData };
    } else {
      const msg = `Google Indexing API rejected ${url} (${response.status}): ${resData?.error?.message || response.statusText}`;
      addIndexingLog({ url, target: 'google', status: 'failed', statusCode: response.status, message: msg });
      return { success: false, message: msg, response: resData };
    }
  } catch (err: any) {
    const msg = `Google Indexing API error for ${url}: ${err.message || err}`;
    addIndexingLog({ url, target: 'google', status: 'failed', message: msg });
    return { success: false, message: msg };
  }
}

export async function submitToIndexNow(urls: string[]) {
  const config = getIndexingConfig();
  const key = config.indexNowKey || ensureIndexNowKey();
  const host = 'ilovepdf.in';
  const keyLocation = `https://${host}/indexnow_key.txt`;

  if (!urls || urls.length === 0) {
    return { success: false, message: 'No URLs provided for IndexNow submission' };
  }

  try {
    const payload = {
      host,
      key,
      keyLocation,
      urlList: urls,
    };

    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      const msg = `Successfully submitted ${urls.length} URL(s) to IndexNow (Bing/Yandex/Naver)`;
      for (const u of urls) {
        addIndexingLog({ url: u, target: 'indexnow', status: 'success', statusCode: response.status, message: msg });
      }
      return { success: true, message: msg };
    } else {
      const resText = await response.text();
      const msg = `IndexNow API failed (${response.status}): ${resText}`;
      for (const u of urls) {
        addIndexingLog({ url: u, target: 'indexnow', status: 'failed', statusCode: response.status, message: msg });
      }
      return { success: false, message: msg };
    }
  } catch (err: any) {
    const msg = `IndexNow request error: ${err.message || err}`;
    for (const u of urls) {
      addIndexingLog({ url: u, target: 'indexnow', status: 'failed', message: msg });
    }
    return { success: false, message: msg };
  }
}
