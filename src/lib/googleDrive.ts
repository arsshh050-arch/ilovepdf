import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';

// Ensure Firebase App is initialized
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

/**
 * Initialize Google Auth listener
 */
export const initGoogleDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Trigger Google Sign In Popup with Drive Scopes
 */
export const signInWithGoogleDrive = async (): Promise<{
  user: User;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    let result;
    try {
      result = await signInWithPopup(auth, provider);
    } catch (popupErr: any) {
      if (
        popupErr?.code === 'auth/popup-blocked' ||
        popupErr?.code === 'auth/popup-closed-by-user' ||
        popupErr?.code === 'auth/cancelled-popup-request'
      ) {
        console.warn('Popup blocked/closed for Drive sign-in, redirecting...');
        await signInWithRedirect(auth, provider);
        throw new Error('Redirecting to Google for authentication...');
      }
      throw popupErr;
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Drive access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Drive Sign-In Error:', error);
    const domain = window.location.hostname;
    if (error?.code === 'auth/unauthorized-domain') {
      throw new Error(`Domain "${domain}" is not authorized in Firebase Console. Add "${domain}" to Firebase Auth -> Settings -> Authorized Domains.`);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current Google Drive Access Token
 */
export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Sign out user and clear cached token
 */
export const signOutGoogleDrive = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
  iconLink?: string;
}

/**
 * List PDF files from user's Google Drive
 */
export const listDrivePdfFiles = async (accessToken: string): Promise<DriveFileItem[]> => {
  const query = encodeURIComponent("mimeType = 'application/pdf' and trashed = false");
  const fields = encodeURIComponent('files(id, name, mimeType, size, modifiedTime, thumbnailLink, iconLink)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=50&orderBy=modifiedTime%20desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Drive API error: ${response.statusText} (${errText})`);
  }

  const data = await response.json();
  return data.files || [];
};

/**
 * Download a PDF file from Google Drive as a File object
 */
export const downloadFileFromDrive = async (
  fileId: string,
  fileName: string,
  accessToken: string
): Promise<File> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download file from Google Drive: ${response.statusText}`);
  }

  const blob = await response.blob();
  return new File([blob], fileName, { type: 'application/pdf' });
};

/**
 * Save a File/Blob directly to user's Google Drive
 */
export const uploadFileToDrive = async (
  blobUrlOrBlob: Blob | string,
  fileName: string,
  accessToken: string,
  mimeType: string = 'application/pdf'
): Promise<{ id: string; webViewLink?: string }> => {
  let blob: Blob;

  if (typeof blobUrlOrBlob === 'string') {
    const fetchRes = await fetch(blobUrlOrBlob);
    blob = await fetchRes.blob();
  } else {
    blob = blobUrlOrBlob;
  }

  const metadata = {
    name: fileName,
    mimeType: mimeType,
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', blob);

  const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to upload to Google Drive: ${response.statusText} (${errText})`);
  }

  return await response.json();
};
