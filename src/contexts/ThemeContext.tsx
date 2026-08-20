import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeConfig, ThemeRevision } from '../types/theme';
import { DEFAULT_THEME, THEME_PRESETS } from '../config/defaultTheme';
import { generateCssVariables, updateGoogleFonts, updateDynamicHeadTags } from '../utils/themeTokens';
import { safeFetchJson } from '../utils/safeFetch';

interface ThemeContextType {
  theme: ThemeConfig;
  draftTheme: ThemeConfig;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  revisions: ThemeRevision[];
  updateDraft: (updater: (prev: ThemeConfig) => ThemeConfig) => void;
  setDraftDirect: (newTheme: ThemeConfig) => void;
  saveDraft: () => Promise<{ success: boolean; message?: string; error?: string }>;
  publishTheme: (changeSummary?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetSection: (section: keyof ThemeConfig) => void;
  resetEntireTheme: () => Promise<{ success: boolean; message?: string }>;
  applyPreset: (presetKey: string) => void;
  restoreRevision: (revisionId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  importThemeJson: (jsonString: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  exportThemeJson: () => string;
  refreshTheme: () => Promise<void>;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  previewDark: boolean;
  setPreviewDark: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_THEME_KEY = 'ilovepdf_published_theme_cache';
const LOCAL_DRAFT_KEY = 'ilovepdf_draft_theme_cache';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from cache or default to ensure immediate rendering without FOUC
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_THEME_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    return DEFAULT_THEME;
  });

  const [draftTheme, setDraftTheme] = useState<ThemeConfig>(() => {
    try {
      const cachedDraft = localStorage.getItem(LOCAL_DRAFT_KEY);
      if (cachedDraft) {
        return JSON.parse(cachedDraft);
      }
    } catch {}
    return theme;
  });

  const [revisions, setRevisions] = useState<ThemeRevision[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewDark, setPreviewDark] = useState<boolean>(false);

  // Compute dirty state
  const isDirty = useMemo(() => {
    try {
      return JSON.stringify(draftTheme) !== JSON.stringify(theme);
    } catch {
      return false;
    }
  }, [draftTheme, theme]);

  // Apply theme tokens to DOM immediately
  const applyThemeToDOM = useCallback((activeTheme: ThemeConfig, isDark: boolean = false) => {
    if (typeof document === 'undefined') return;

    const css = generateCssVariables(activeTheme, isDark);
    let styleEl = document.getElementById('dynamic-theme-vars') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-theme-vars';
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = css;

    updateGoogleFonts(activeTheme);
    updateDynamicHeadTags(activeTheme);
  }, []);

  // Sync theme to DOM when published theme changes
  useEffect(() => {
    applyThemeToDOM(theme, previewDark);
  }, [theme, previewDark, applyThemeToDOM]);

  // Fetch initial theme from server
  const fetchPublishedTheme = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await safeFetchJson<{ success: boolean; theme?: ThemeConfig }>(
        '/api/theme/public',
        {},
        { success: true, theme: DEFAULT_THEME }
      );

      if (data && data.theme) {
        setTheme(data.theme);
        try {
          localStorage.setItem(LOCAL_THEME_KEY, JSON.stringify(data.theme));
        } catch {}
      }
    } catch (err) {
      console.warn('Could not fetch server theme, using local fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublishedTheme();
  }, [fetchPublishedTheme]);

  const updateDraft = useCallback((updater: (prev: ThemeConfig) => ThemeConfig) => {
    setDraftTheme((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const setDraftDirect = useCallback((newTheme: ThemeConfig) => {
    setDraftTheme(newTheme);
    try {
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(newTheme));
    } catch {}
  }, []);

  // Save Draft locally
  const saveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      try {
        localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(draftTheme));
      } catch {}
      return { success: true, message: 'Theme draft saved locally!' };
    } finally {
      setIsSaving(false);
    }
  }, [draftTheme]);

  // Publish Theme Locally
  const publishTheme = useCallback(
    async (changeSummary: string = 'Updated site branding & colors') => {
      setIsSaving(true);
      try {
        const nextVersion = (theme.version || 1) + 1;
        const themeToPublish: ThemeConfig = {
          ...draftTheme,
          version: nextVersion,
          status: 'published',
          updatedAt: new Date().toISOString()
        };

        setTheme(themeToPublish);
        setDraftTheme(themeToPublish);
        try {
          localStorage.setItem(LOCAL_THEME_KEY, JSON.stringify(themeToPublish));
          localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(themeToPublish));
        } catch {}

        applyThemeToDOM(themeToPublish, previewDark);
        return { success: true, message: 'Theme applied successfully!' };
      } finally {
        setIsSaving(false);
      }
    },
    [draftTheme, theme, previewDark, applyThemeToDOM]
  );

  // Reset a specific section to defaults
  const resetSection = useCallback((section: keyof ThemeConfig) => {
    updateDraft((prev) => ({
      ...prev,
      [section]: JSON.parse(JSON.stringify(DEFAULT_THEME[section]))
    }));
  }, [updateDraft]);

  // Reset entire theme to standard defaults
  const resetEntireTheme = useCallback(async () => {
    const defaultCopy = JSON.parse(JSON.stringify(DEFAULT_THEME));
    setDraftTheme(defaultCopy);
    setTheme(defaultCopy);
    try {
      localStorage.setItem(LOCAL_THEME_KEY, JSON.stringify(defaultCopy));
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(defaultCopy));
    } catch {}

    return { success: true, message: 'Theme reset to default brand standards.' };
  }, []);

  // Apply a preset
  const applyPreset = useCallback((presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;

    updateDraft((prev) => {
      return {
        ...prev,
        ...preset,
        name: preset.name || prev.name,
        colors: {
          ...prev.colors,
          ...(preset.colors || {})
        },
        buttons: {
          ...prev.buttons,
          ...(preset.buttons || {})
        },
        typography: {
          ...prev.typography,
          ...(preset.typography || {})
        },
        header: {
          ...prev.header,
          ...(preset.header || {})
        }
      };
    });
  }, [updateDraft]);

  // Restore previous revision
  const restoreRevision = useCallback(async (revisionId: string) => {
    const targetRev = revisions.find(r => r.id === revisionId);
    if (targetRev && targetRev.theme) {
      setTheme(targetRev.theme);
      setDraftTheme(targetRev.theme);
      try {
        localStorage.setItem(LOCAL_THEME_KEY, JSON.stringify(targetRev.theme));
        localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(targetRev.theme));
      } catch {}
      return { success: true, message: `Restored theme to version ${targetRev.version} successfully.` };
    }
    return { success: false, error: 'Revision not found' };
  }, [revisions]);

  // Import theme JSON with validation
  const importThemeJson = useCallback(async (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON payload.' };
      }
      if (!parsed.branding || !parsed.colors || !parsed.typography) {
        return { success: false, error: 'Theme format missing required branding, colors, or typography keys.' };
      }

      // Merge on top of default theme to prevent missing field errors
      const validTheme: ThemeConfig = {
        ...DEFAULT_THEME,
        ...parsed,
        id: `imported-${Date.now()}`,
        status: 'draft',
        updatedAt: new Date().toISOString()
      };

      setDraftTheme(validTheme);
      try {
        localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(validTheme));
      } catch {}

      return { success: true, message: 'Theme settings imported into draft workspace!' };
    } catch (err: any) {
      return { success: false, error: `Import failed: ${err.message}` };
    }
  }, []);

  // Export theme clean JSON
  const exportThemeJson = useCallback(() => {
    const safeTheme = { ...draftTheme };
    return JSON.stringify(safeTheme, null, 2);
  }, [draftTheme]);

  const value = useMemo(
    () => ({
      theme,
      draftTheme,
      isLoading,
      isSaving,
      isDirty,
      revisions,
      updateDraft,
      setDraftDirect,
      saveDraft,
      publishTheme,
      resetSection,
      resetEntireTheme,
      applyPreset,
      restoreRevision,
      importThemeJson,
      exportThemeJson,
      refreshTheme: fetchPublishedTheme,
      previewMode,
      setPreviewMode,
      previewDark,
      setPreviewDark
    }),
    [
      theme,
      draftTheme,
      isLoading,
      isSaving,
      isDirty,
      revisions,
      updateDraft,
      setDraftDirect,
      saveDraft,
      publishTheme,
      resetSection,
      resetEntireTheme,
      applyPreset,
      restoreRevision,
      importThemeJson,
      exportThemeJson,
      fetchPublishedTheme,
      previewMode,
      previewDark
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
