import { ThemeConfig } from '../types/theme';

export function calculateLuminance(hexColor: string): number {
  let cleanHex = hexColor.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length !== 6) return 0.5;

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = calculateLuminance(hex1);
  const lum2 = calculateLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function generateCssVariables(theme: ThemeConfig, isDark = false): string {
  const {
    colors,
    typography,
    header,
    footer,
    buttons,
    cards,
    pdfTools,
    forms,
    darkMode,
    layout,
    advanced
  } = theme;

  const shadowMap = {
    none: 'none',
    subtle: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    medium: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    strong: '0 10px 15px -3px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.08)'
  };

  const currentColors = isDark && darkMode.enabled
    ? {
        primary: darkMode.primary || colors.primary,
        secondary: colors.secondary,
        accent: darkMode.primary || colors.accent,
        pageBackground: darkMode.background,
        surfaceBackground: darkMode.surface,
        heading: darkMode.heading,
        bodyText: darkMode.text,
        mutedText: darkMode.mutedText,
        link: darkMode.link,
        linkHover: darkMode.link,
        border: darkMode.border,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info
      }
    : colors;

  const currentHeaderBg = isDark && darkMode.enabled ? darkMode.headerBg : header.background;
  const currentFooterBg = isDark && darkMode.enabled ? darkMode.footerBg : footer.background;

  const fontFallback = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

  const getFontFamily = (fontName: string) => {
    if (!fontName || fontName === 'System') return fontFallback;
    return `'${fontName}', ${fontFallback}`;
  };

  let css = `
:root {
  /* Brand & Core Colors */
  --color-primary: ${currentColors.primary};
  --color-secondary: ${currentColors.secondary};
  --color-accent: ${currentColors.accent};
  --color-background: ${currentColors.pageBackground};
  --color-surface: ${currentColors.surfaceBackground};
  --color-heading: ${currentColors.heading};
  --color-text: ${currentColors.bodyText};
  --color-muted: ${currentColors.mutedText};
  --color-link: ${currentColors.link};
  --color-link-hover: ${currentColors.linkHover};
  --color-border: ${currentColors.border};
  --color-success: ${currentColors.success};
  --color-warning: ${currentColors.warning};
  --color-error: ${currentColors.error};
  --color-info: ${currentColors.info};

  /* Typography */
  --font-body: ${getFontFamily(typography.bodyFont)};
  --font-heading: ${getFontFamily(typography.headingFont)};
  --font-nav: ${getFontFamily(typography.navFont)};
  --font-button: ${getFontFamily(typography.buttonFont)};

  --font-weight-body: ${typography.bodyWeight};
  --font-weight-heading: ${typography.headingWeight};
  --font-weight-nav: ${typography.navWeight};
  --font-weight-button: ${typography.buttonWeight};

  --font-size-body-desktop: ${typography.bodySizeDesktop}px;
  --font-size-small-desktop: ${typography.smallSizeDesktop}px;
  --font-size-h1-desktop: ${typography.h1SizeDesktop}px;
  --font-size-h2-desktop: ${typography.h2SizeDesktop}px;
  --font-size-h3-desktop: ${typography.h3SizeDesktop}px;
  --font-size-h4-desktop: ${typography.h4SizeDesktop}px;
  --font-size-h5-desktop: ${typography.h5SizeDesktop}px;
  --font-size-h6-desktop: ${typography.h6SizeDesktop}px;

  --font-size-body-mobile: ${typography.bodySizeMobile}px;
  --font-size-h1-mobile: ${typography.h1SizeMobile}px;
  --font-size-h2-mobile: ${typography.h2SizeMobile}px;
  --font-size-h3-mobile: ${typography.h3SizeMobile}px;

  --line-height-body: ${typography.bodyLineHeight};
  --line-height-heading: ${typography.headingLineHeight};
  --letter-spacing-nav: ${typography.navLetterSpacing};
  --letter-spacing-button: ${typography.buttonLetterSpacing};

  /* Layout & Radii Tokens */
  --container-max-width: ${layout.containerWidth};
  --radius-sm: ${layout.radiusSm}px;
  --radius-md: ${layout.radiusMd}px;
  --radius-lg: ${layout.radiusLg}px;
  --radius-xl: ${layout.radiusXl}px;
  --radius-pill: ${layout.radiusPill}px;

  /* Header */
  --header-bg: ${currentHeaderBg};
  --header-text: ${header.textColor};
  --header-nav-color: ${header.navColor};
  --header-nav-hover: ${header.navHoverColor};
  --header-nav-active: ${header.navActiveColor};
  --header-height: ${header.height}px;
  --header-mobile-height: ${header.mobileHeight}px;
  --header-shadow: ${shadowMap[header.shadow] || shadowMap.subtle};
  --header-border-color: ${header.borderColor};

  /* Footer */
  --footer-bg: ${currentFooterBg};
  --footer-heading: ${footer.headingColor};
  --footer-text: ${footer.textColor};
  --footer-link: ${footer.linkColor};
  --footer-link-hover: ${footer.linkHoverColor};
  --footer-border: ${footer.borderColor};
  --footer-social-icon: ${footer.socialIconColor};
  --footer-social-icon-hover: ${footer.socialIconHoverColor};

  /* Buttons */
  --btn-primary-bg: ${buttons.primaryBg};
  --btn-primary-text: ${buttons.primaryText};
  --btn-primary-hover-bg: ${buttons.primaryHoverBg};
  --btn-primary-hover-text: ${buttons.primaryHoverText};

  --btn-secondary-bg: ${buttons.secondaryBg};
  --btn-secondary-text: ${buttons.secondaryText};
  --btn-secondary-hover-bg: ${buttons.secondaryHoverBg};
  --btn-secondary-hover-text: ${buttons.secondaryHoverText};

  --btn-outline-color: ${buttons.outlineColor};
  --btn-outline-hover-bg: ${buttons.outlineHoverBg};
  --btn-outline-hover-text: ${buttons.outlineHoverText};

  --btn-radius: ${buttons.borderRadius}px;
  --btn-height: ${buttons.height}px;
  --btn-padding-x: ${buttons.horizontalPadding}px;
  --btn-font-size: ${buttons.fontSize}px;
  --btn-font-weight: ${buttons.fontWeight};
  --btn-shadow: ${shadowMap[buttons.shadow] || shadowMap.none};
  --btn-hover-shadow: ${shadowMap[buttons.hoverShadow] || shadowMap.medium};
  --btn-transition-speed: ${buttons.transitionSpeed}ms;

  /* Cards & Tools */
  --card-bg: ${cards.background};
  --card-border: ${cards.border};
  --card-border-width: ${cards.borderWidth}px;
  --card-radius: ${cards.borderRadius}px;
  --card-shadow: ${shadowMap[cards.shadow] || shadowMap.subtle};
  --card-hover-shadow: ${shadowMap[cards.hoverShadow] || shadowMap.medium};
  --card-heading: ${cards.headingColor};
  --card-desc: ${cards.descriptionColor};
  --card-icon-color: ${cards.iconColor};
  --card-icon-bg: ${cards.iconBg};
  --card-padding: ${cards.padding}px;

  /* PDF Tools & Upload */
  --upload-bg: ${pdfTools.uploadBg};
  --upload-border: ${pdfTools.uploadBorder};
  --upload-dashed-border: ${pdfTools.uploadDashedBorderColor};
  --upload-icon-color: ${pdfTools.uploadIconColor};
  --upload-heading-color: ${pdfTools.uploadHeadingColor};
  --upload-text-color: ${pdfTools.uploadTextColor};
  --upload-btn-color: ${pdfTools.uploadButtonColor};
  --upload-btn-text: ${pdfTools.uploadButtonText};
  --upload-drag-bg: ${pdfTools.dragOverBg};
  --upload-radius: ${pdfTools.borderRadius}px;

  --result-card-bg: ${pdfTools.resultCardBg};
  --result-heading-color: ${pdfTools.resultHeadingColor};
  --result-download-btn-bg: ${pdfTools.downloadButtonColor};
  --result-download-btn-text: ${pdfTools.downloadButtonText};

  /* Forms */
  --input-bg: ${forms.inputBg};
  --input-text: ${forms.inputText};
  --input-placeholder: ${forms.inputPlaceholder};
  --input-border: ${forms.inputBorder};
  --input-focus-border: ${forms.inputFocusBorder};
  --input-focus-ring: ${forms.inputFocusRing};
  --input-label: ${forms.labelColor};
  --input-radius: ${forms.inputRadius}px;
  --input-height: ${forms.inputHeight}px;
}

/* Global Font & Body Settings */
body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: var(--line-height-body);
  font-weight: var(--font-weight-body);
  font-size: var(--font-size-body-desktop);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-heading);
  color: var(--color-heading);
  line-height: var(--line-height-heading);
}

h1 { font-size: var(--font-size-h1-desktop); }
h2 { font-size: var(--font-size-h2-desktop); }
h3 { font-size: var(--font-size-h3-desktop); }
h4 { font-size: var(--font-size-h4-desktop); }
h5 { font-size: var(--font-size-h5-desktop); }
h6 { font-size: var(--font-size-h6-desktop); }

@media (max-width: 768px) {
  body {
    font-size: var(--font-size-body-mobile);
  }
  h1 { font-size: var(--font-size-h1-mobile); }
  h2 { font-size: var(--font-size-h2-mobile); }
  h3 { font-size: var(--font-size-h3-mobile); }
}

/* Dynamic Primary Button */
.btn-theme-primary {
  background-color: var(--btn-primary-bg) !important;
  color: var(--btn-primary-text) !important;
  border-radius: var(--btn-radius) !important;
  font-size: var(--btn-font-size) !important;
  font-weight: var(--btn-font-weight) !important;
  box-shadow: var(--btn-shadow);
  transition: all var(--btn-transition-speed) ease-in-out;
}
.btn-theme-primary:hover {
  background-color: var(--btn-primary-hover-bg) !important;
  color: var(--btn-primary-hover-text) !important;
  box-shadow: var(--btn-hover-shadow);
}

/* Dynamic Outline Button */
.btn-theme-outline {
  border: 1px solid var(--btn-outline-color) !important;
  color: var(--btn-outline-color) !important;
  border-radius: var(--btn-radius) !important;
  background-color: transparent !important;
  transition: all var(--btn-transition-speed) ease-in-out;
}
.btn-theme-outline:hover {
  background-color: var(--btn-outline-hover-bg) !important;
  color: var(--btn-outline-hover-text) !important;
}

/* Dynamic Tool Card */
.tool-theme-card {
  background-color: var(--card-bg);
  border: var(--card-border-width) solid var(--card-border);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  padding: var(--card-padding);
  transition: all 0.2s ease-in-out;
}
.tool-theme-card:hover {
  box-shadow: var(--card-hover-shadow);
  transform: translateY(-2px);
}
`;

  // Append validated custom CSS if present
  if (advanced && advanced.customCss && advanced.customCss.trim()) {
    css += `\n/* --- Custom Admin CSS --- */\n${advanced.customCss}\n`;
  }

  return css;
}

export function updateGoogleFonts(theme: ThemeConfig) {
  const fontsToLoad = new Set<string>();
  const weightsToLoad = new Set<string>(['400', '500', '600', '700']);

  if (theme.typography) {
    if (theme.typography.bodyFont && theme.typography.bodyFont !== 'System') {
      fontsToLoad.add(theme.typography.bodyFont);
    }
    if (theme.typography.headingFont && theme.typography.headingFont !== 'System') {
      fontsToLoad.add(theme.typography.headingFont);
    }
    if (theme.typography.navFont && theme.typography.navFont !== 'System') {
      fontsToLoad.add(theme.typography.navFont);
    }
    if (theme.typography.buttonFont && theme.typography.buttonFont !== 'System') {
      fontsToLoad.add(theme.typography.buttonFont);
    }

    if (theme.typography.bodyWeight) weightsToLoad.add(theme.typography.bodyWeight);
    if (theme.typography.headingWeight) weightsToLoad.add(theme.typography.headingWeight);
    if (theme.typography.navWeight) weightsToLoad.add(theme.typography.navWeight);
    if (theme.typography.buttonWeight) weightsToLoad.add(theme.typography.buttonWeight);
  }

  if (fontsToLoad.size === 0) return;

  const weightsQuery = Array.from(weightsToLoad).sort().join(';');
  const fontFamiliesQuery = Array.from(fontsToLoad)
    .map(f => `family=${f.replace(/ /g, '+')}:wght@${weightsQuery}`)
    .join('&');

  const fontUrl = `https://fonts.googleapis.com/css2?${fontFamiliesQuery}&display=swap`;

  let linkEl = document.getElementById('dynamic-google-fonts') as HTMLLinkElement;
  if (!linkEl) {
    linkEl = document.createElement('link');
    linkEl.id = 'dynamic-google-fonts';
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);
  }
  if (linkEl.href !== fontUrl) {
    linkEl.href = fontUrl;
  }
}

export function updateDynamicHeadTags(theme: ThemeConfig) {
  if (typeof document === 'undefined') return;

  // 1. Favicon
  const faviconUrl = theme.branding?.favicon || '/favicon.ico';
  let iconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (!iconLink) {
    iconLink = document.createElement('link');
    iconLink.rel = 'icon';
    document.head.appendChild(iconLink);
  }
  iconLink.href = faviconUrl;

  // 2. Apple Touch Icon
  const appleIconUrl = theme.branding?.appleTouchIcon || faviconUrl;
  let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
  if (!appleLink) {
    appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleLink);
  }
  appleLink.href = appleIconUrl;

  // 3. Browser Theme Color Meta
  const primaryColor = theme.colors?.primary || '#E5322D';
  let themeColorMeta = document.querySelector("meta[name='theme-color']") as HTMLMetaElement;
  if (!themeColorMeta) {
    themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    document.head.appendChild(themeColorMeta);
  }
  themeColorMeta.content = primaryColor;
}
