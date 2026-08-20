import firebaseConfig from '../../firebase-applet-config.json';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

let pickerScriptLoadingPromise: Promise<void> | null = null;

/**
 * Loads the Google API script (https://apis.google.com/js/api.js) and initializes 'picker'
 */
export const loadGooglePickerApi = (): Promise<void> => {
  if (pickerScriptLoadingPromise) {
    return pickerScriptLoadingPromise;
  }

  pickerScriptLoadingPromise = new Promise((resolve, reject) => {
    // Check if gapi.picker is already ready
    if (window.gapi && window.google?.picker) {
      resolve();
      return;
    }

    const onGapiLoaded = () => {
      window.gapi.load('picker', {
        callback: () => {
          resolve();
        },
        onerror: () => {
          pickerScriptLoadingPromise = null;
          reject(new Error('Failed to load Google Picker component.'));
        },
      });
    };

    if (window.gapi) {
      onGapiLoaded();
    } else {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = onGapiLoaded;
      script.onerror = () => {
        pickerScriptLoadingPromise = null;
        reject(new Error('Failed to load Google API script.'));
      };
      document.body.appendChild(script);
    }
  });

  return pickerScriptLoadingPromise;
};

export interface SelectedPickerDoc {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes?: number;
}

/**
 * Opens the native Google Picker UI dialog using gapi.picker
 */
export const launchGooglePicker = async (options: {
  accessToken: string;
  multiSelect?: boolean;
  onSelect: (docs: SelectedPickerDoc[]) => void;
  onCancel?: () => void;
  onError?: (err: any) => void;
}) => {
  try {
    await loadGooglePickerApi();

    if (!window.google?.picker) {
      throw new Error('Google Picker API is not available.');
    }

    const docsView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
      .setMimeTypes('application/pdf')
      .setSelectFolderEnabled(false);

    const pickerBuilder = new window.google.picker.PickerBuilder()
      .addView(docsView)
      .setOAuthToken(options.accessToken)
      .setCallback((data: any) => {
        if (data.action === window.google.picker.Action.PICKED) {
          const docs: SelectedPickerDoc[] = (data.docs || []).map((d: any) => ({
            id: d.id,
            name: d.name,
            mimeType: d.mimeType || 'application/pdf',
            sizeBytes: d.sizeBytes,
          }));
          options.onSelect(docs);
        } else if (data.action === window.google.picker.Action.CANCEL) {
          if (options.onCancel) options.onCancel();
        }
      });

    if (options.multiSelect !== false) {
      pickerBuilder.enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED);
    }

    if (firebaseConfig.apiKey) {
      pickerBuilder.setDeveloperKey(firebaseConfig.apiKey);
    }

    if (firebaseConfig.messagingSenderId) {
      pickerBuilder.setAppId(firebaseConfig.messagingSenderId);
    }

    const picker = pickerBuilder.build();
    picker.setVisible(true);
  } catch (err: any) {
    console.error('Launch Google Picker error:', err);
    if (options.onError) {
      options.onError(err);
    } else {
      throw err;
    }
  }
};
