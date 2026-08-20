export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr' }
];

export const DEFAULT_LANGUAGE = 'en';

export function getLanguageByCode(code: string): Language {
  const lang = LANGUAGES.find(l => l.code === code);
  if (lang) return lang;
  if (code.includes('-')) {
    const baseCode = code.split('-')[0];
    const baseLang = LANGUAGES.find(l => l.code === baseCode);
    if (baseLang) return baseLang;
  }
  return LANGUAGES[0];
}
