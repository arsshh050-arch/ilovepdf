export type FontOption = 
  | 'Inter'
  | 'Montserrat'
  | 'Poppins'
  | 'Roboto'
  | 'Open Sans'
  | 'Plus Jakarta Sans'
  | 'DM Sans'
  | 'Manrope'
  | 'Nunito Sans'
  | 'Source Sans 3'
  | 'Lato'
  | 'Playfair Display'
  | 'Merriweather'
  | 'System';

export interface ThemeBranding {
  siteName: string;
  tagline: string;
  primaryLogo: string;
  lightLogo: string;
  darkLogo: string;
  mobileLogo: string;
  footerLogo: string;
  squareBrandIcon: string;
  favicon: string;
  appleTouchIcon: string;
  pwaIcon: string;
  defaultSocialImage: string;
  logoAltText: string;
  
  // Logo sizing & alignment
  desktopLogoWidth: number;
  desktopLogoHeight: number;
  mobileLogoWidth: number;
  mobileLogoHeight: number;
  footerLogoWidth: number;
  footerLogoHeight: number;
  logoAlignment: 'left' | 'center';
  preserveAspectRatio: boolean;
  useSameLogoEverywhere: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  pageBackground: string;
  surfaceBackground: string;
  heading: string;
  bodyText: string;
  mutedText: string;
  link: string;
  linkHover: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeTypography {
  bodyFont: FontOption;
  headingFont: FontOption;
  navFont: FontOption;
  buttonFont: FontOption;
  
  bodyWeight: string;
  headingWeight: string;
  navWeight: string;
  buttonWeight: string;
  
  // Font Size Scale Desktop
  bodySizeDesktop: number;
  smallSizeDesktop: number;
  h1SizeDesktop: number;
  h2SizeDesktop: number;
  h3SizeDesktop: number;
  h4SizeDesktop: number;
  h5SizeDesktop: number;
  h6SizeDesktop: number;
  
  // Font Size Scale Mobile
  bodySizeMobile: number;
  h1SizeMobile: number;
  h2SizeMobile: number;
  h3SizeMobile: number;
  
  // Line Height & Letter Spacing
  bodyLineHeight: number;
  headingLineHeight: number;
  navLetterSpacing: string;
  buttonLetterSpacing: string;
}

export interface ThemeHeader {
  background: string;
  textColor: string;
  navColor: string;
  navHoverColor: string;
  navActiveColor: string;
  height: number;
  mobileHeight: number;
  containerWidth: 'container' | '1200px' | '1280px' | '1320px' | '1440px' | 'full';
  sticky: boolean;
  stickyShadow: boolean;
  stickyBackground: string;
  stickyOpacity: number;
  stickyBlur: boolean;
  shadow: 'none' | 'subtle' | 'medium' | 'strong';
  border: boolean;
  borderColor: string;
  layout: 'logo-nav-actions' | 'logo-center-actions' | 'logo-search-actions';
  ctaButtonStyle: 'primary' | 'outline' | 'subtle';
  mobileBackground: string;
  mobileDrawerBackground: string;
  mobileDrawerTextColor: string;
  mobileDrawerDividerColor: string;
}

export interface ThemeFooter {
  background: string;
  headingColor: string;
  textColor: string;
  linkColor: string;
  linkHoverColor: string;
  border: boolean;
  borderColor: string;
  columnSpacing: 'compact' | 'normal' | 'spacious';
  copyrightText: string;
  socialIconColor: string;
  socialIconHoverColor: string;
  showLanguageSelector: boolean;
}

export interface ThemeButtons {
  primaryBg: string;
  primaryText: string;
  primaryHoverBg: string;
  primaryHoverText: string;
  
  secondaryBg: string;
  secondaryText: string;
  secondaryHoverBg: string;
  secondaryHoverText: string;
  
  outlineColor: string;
  outlineHoverBg: string;
  outlineHoverText: string;
  
  borderWidth: number;
  borderRadius: number;
  height: number;
  horizontalPadding: number;
  fontSize: number;
  fontWeight: string;
  shadow: 'none' | 'subtle' | 'medium' | 'strong';
  hoverShadow: 'none' | 'subtle' | 'medium' | 'strong';
  transitionSpeed: number; // ms
}

export interface ThemeCards {
  background: string;
  border: string;
  borderWidth: number;
  borderRadius: number;
  shadow: 'none' | 'subtle' | 'medium' | 'strong';
  hoverShadow: 'none' | 'subtle' | 'medium' | 'strong';
  headingColor: string;
  descriptionColor: string;
  iconColor: string;
  iconBg: string;
  padding: number;
}

export interface ThemePdfTools {
  uploadBg: string;
  uploadBorder: string;
  uploadDashedBorderColor: string;
  uploadIconColor: string;
  uploadHeadingColor: string;
  uploadTextColor: string;
  uploadButtonColor: string;
  uploadButtonText: string;
  dragOverBg: string;
  borderRadius: number;
  
  resultCardBg: string;
  resultHeadingColor: string;
  downloadButtonColor: string;
  downloadButtonText: string;
  successIconColor: string;
  errorIconColor: string;
}

export interface ThemeForms {
  inputBg: string;
  inputText: string;
  inputPlaceholder: string;
  inputBorder: string;
  inputFocusBorder: string;
  inputFocusRing: string;
  labelColor: string;
  inputRadius: number;
  inputHeight: number;
  checkboxAccent: string;
  radioAccent: string;
}

export interface ThemeDarkMode {
  enabled: boolean;
  mode: 'disabled' | 'system' | 'manual' | 'both';
  background: string;
  surface: string;
  heading: string;
  text: string;
  mutedText: string;
  border: string;
  primary: string;
  link: string;
  headerBg: string;
  footerBg: string;
  darkLogo: string;
}

export interface ThemeLayout {
  containerWidth: '1200px' | '1280px' | '1320px' | '1440px';
  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  radiusXl: number;
  radiusPill: number;
  globalSectionSpacing: 'compact' | 'normal' | 'spacious';
}

export interface ThemeAdvanced {
  customCss: string;
  customHeadCode: string;
  customBodyEndCode: string;
}

export interface ThemeConfig {
  id: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
  status: 'draft' | 'published';
  name: string;
  description?: string;
  
  branding: ThemeBranding;
  colors: ThemeColors;
  typography: ThemeTypography;
  header: ThemeHeader;
  footer: ThemeFooter;
  buttons: ThemeButtons;
  cards: ThemeCards;
  pdfTools: ThemePdfTools;
  forms: ThemeForms;
  darkMode: ThemeDarkMode;
  layout: ThemeLayout;
  advanced: ThemeAdvanced;
}

export interface ThemeRevision {
  id: string;
  version: number;
  timestamp: string;
  adminEmail: string;
  changeSummary: string;
  theme: ThemeConfig;
}
