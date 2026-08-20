export interface Language {
  code: string;
  locale: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  enabled: boolean;
}

export const LANGUAGES: Language[] = [
  { code: 'en', locale: 'en-US', nativeName: 'English', direction: 'ltr', enabled: true },
  { code: 'es', locale: 'es-ES', nativeName: 'Español', direction: 'ltr', enabled: true },
  { code: 'fr', locale: 'fr-FR', nativeName: 'Français', direction: 'ltr', enabled: true },
  { code: 'de', locale: 'de-DE', nativeName: 'Deutsch', direction: 'ltr', enabled: true },
  { code: 'it', locale: 'it-IT', nativeName: 'Italiano', direction: 'ltr', enabled: true },
  { code: 'pt', locale: 'pt-BR', nativeName: 'Português', direction: 'ltr', enabled: true },
  { code: 'ja', locale: 'ja-JP', nativeName: '日本語', direction: 'ltr', enabled: true },
  { code: 'ru', locale: 'ru-RU', nativeName: 'Русский', direction: 'ltr', enabled: true },
  { code: 'ko', locale: 'ko-KR', nativeName: '한국어', direction: 'ltr', enabled: true },
  { code: 'zh-CN', locale: 'zh-CN', nativeName: '中文（简体）', direction: 'ltr', enabled: true },
  { code: 'zh-TW', locale: 'zh-TW', nativeName: '中文（繁體）', direction: 'ltr', enabled: true },
  { code: 'ar', locale: 'ar-SA', nativeName: 'العربية', direction: 'rtl', enabled: true },
  { code: 'bg', locale: 'bg-BG', nativeName: 'Български', direction: 'ltr', enabled: true },
  { code: 'ca', locale: 'ca-ES', nativeName: 'Català', direction: 'ltr', enabled: true },
  { code: 'nl', locale: 'nl-NL', nativeName: 'Nederlands', direction: 'ltr', enabled: true },
  { code: 'el', locale: 'el-GR', nativeName: 'Ελληνικά', direction: 'ltr', enabled: true },
  { code: 'hi', locale: 'hi-IN', nativeName: 'हिन्दी', direction: 'ltr', enabled: true },
  { code: 'id', locale: 'id-ID', nativeName: 'Bahasa Indonesia', direction: 'ltr', enabled: true },
  { code: 'ms', locale: 'ms-MY', nativeName: 'Bahasa Melayu', direction: 'ltr', enabled: true },
  { code: 'pl', locale: 'pl-PL', nativeName: 'Polski', direction: 'ltr', enabled: true },
  { code: 'sv', locale: 'sv-SE', nativeName: 'Svenska', direction: 'ltr', enabled: true },
  { code: 'th', locale: 'th-TH', nativeName: 'ภาษาไทย', direction: 'ltr', enabled: true },
  { code: 'tr', locale: 'tr-TR', nativeName: 'Türkçe', direction: 'ltr', enabled: true },
  { code: 'uk', locale: 'uk-UA', nativeName: 'Українська', direction: 'ltr', enabled: true },
  { code: 'vi', locale: 'vi-VN', nativeName: 'Tiếng Việt', direction: 'ltr', enabled: true },
  { code: 'sw', locale: 'sw-KE', nativeName: 'Kiswahili', direction: 'ltr', enabled: true },
  { code: 'pa', locale: 'pa-IN', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', enabled: true }
];

export const DEFAULT_LANGUAGE = 'en';

export const getLanguageByCode = (code: string) => {
  return LANGUAGES.find(lang => lang.code === code) || LANGUAGES[0];
};

export const getSupportedLanguageCodes = () => LANGUAGES.filter(l => l.enabled).map(l => l.code);
