import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANGUAGE } from '../i18n/languages';

export function LocalizedLink({ to, ...props }: LinkProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || DEFAULT_LANGUAGE;

  let localizedPath = to.toString();

  if (localizedPath.startsWith('/')) {
    if (currentLang !== DEFAULT_LANGUAGE) {
      localizedPath = `/${currentLang}${localizedPath === '/' ? '' : localizedPath}`;
    }
  }

  return <RouterLink to={localizedPath} {...props} />;
}
