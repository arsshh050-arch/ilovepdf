import { ThemeConfig } from '../types/theme';

export const DEFAULT_THEME: ThemeConfig = {
  id: 'ilovepdf-official-default',
  version: 1,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
  status: 'published',
  name: 'iLovePDF Official Brand Theme',
  description: 'The standard red & slate theme of iLovePDF.in with optimized typography, responsive logos, and high contrast accents.',
  
  branding: {
    siteName: 'iLovePDF.in',
    tagline: 'Essential document tools, available directly in your browser',
    primaryLogo: '/ilovepdf.svg',
    lightLogo: '/ilovepdf.svg',
    darkLogo: '/ilovepdf.svg',
    mobileLogo: '/ilovepdf.svg',
    footerLogo: '/ilovepdf.svg',
    squareBrandIcon: '/ilovepdf.svg',
    favicon: '/favicon.ico',
    appleTouchIcon: '/favicon.ico',
    pwaIcon: '/favicon.ico',
    defaultSocialImage: '/og-image.jpg',
    logoAltText: 'iLovePDF.in - Free Online PDF Tools',
    desktopLogoWidth: 145,
    desktopLogoHeight: 32,
    mobileLogoWidth: 120,
    mobileLogoHeight: 28,
    footerLogoWidth: 140,
    footerLogoHeight: 30,
    logoAlignment: 'left',
    preserveAspectRatio: true,
    useSameLogoEverywhere: true
  },

  colors: {
    primary: '#E5322D',
    secondary: '#272830',
    accent: '#E5322D',
    pageBackground: '#F4F5F8',
    surfaceBackground: '#FFFFFF',
    heading: '#17181C',
    bodyText: '#33333B',
    mutedText: '#686B74',
    link: '#E5322D',
    linkHover: '#C62824',
    border: '#E1E3E8',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  },

  typography: {
    bodyFont: 'Inter',
    headingFont: 'Montserrat',
    navFont: 'Inter',
    buttonFont: 'Inter',
    bodyWeight: '400',
    headingWeight: '700',
    navWeight: '600',
    buttonWeight: '600',
    
    bodySizeDesktop: 16,
    smallSizeDesktop: 13,
    h1SizeDesktop: 42,
    h2SizeDesktop: 32,
    h3SizeDesktop: 24,
    h4SizeDesktop: 20,
    h5SizeDesktop: 18,
    h6SizeDesktop: 16,
    
    bodySizeMobile: 15,
    h1SizeMobile: 30,
    h2SizeMobile: 24,
    h3SizeMobile: 20,
    
    bodyLineHeight: 1.6,
    headingLineHeight: 1.25,
    navLetterSpacing: '0.01em',
    buttonLetterSpacing: '0.02em'
  },

  header: {
    background: '#FFFFFF',
    textColor: '#111111',
    navColor: '#111111',
    navHoverColor: '#E5322D',
    navActiveColor: '#E5322D',
    height: 56,
    mobileHeight: 52,
    containerWidth: 'full',
    sticky: true,
    stickyShadow: true,
    stickyBackground: '#FFFFFF',
    stickyOpacity: 98,
    stickyBlur: true,
    shadow: 'subtle',
    border: true,
    borderColor: '#E1E3E8',
    layout: 'logo-nav-actions',
    ctaButtonStyle: 'primary',
    mobileBackground: '#FFFFFF',
    mobileDrawerBackground: '#FFFFFF',
    mobileDrawerTextColor: '#17181C',
    mobileDrawerDividerColor: '#E5E7EB'
  },

  footer: {
    background: '#24252A',
    headingColor: '#E5322D',
    textColor: '#D1D5DB',
    linkColor: '#9CA3AF',
    linkHoverColor: '#FFFFFF',
    border: true,
    borderColor: '#374151',
    columnSpacing: 'normal',
    copyrightText: '© %year% iLovePDF.in. All rights reserved.',
    socialIconColor: '#9CA3AF',
    socialIconHoverColor: '#FFFFFF',
    showLanguageSelector: true
  },

  buttons: {
    primaryBg: '#E5322D',
    primaryText: '#FFFFFF',
    primaryHoverBg: '#D02823',
    primaryHoverText: '#FFFFFF',
    
    secondaryBg: '#272830',
    secondaryText: '#FFFFFF',
    secondaryHoverBg: '#1A1B22',
    secondaryHoverText: '#FFFFFF',
    
    outlineColor: '#E5322D',
    outlineHoverBg: '#FFF1F0',
    outlineHoverText: '#E5322D',
    
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    horizontalPadding: 20,
    fontSize: 14,
    fontWeight: '600',
    shadow: 'subtle',
    hoverShadow: 'medium',
    transitionSpeed: 150
  },

  cards: {
    background: '#FFFFFF',
    border: '#E1E3E8',
    borderWidth: 1,
    borderRadius: 12,
    shadow: 'subtle',
    hoverShadow: 'medium',
    headingColor: '#17181C',
    descriptionColor: '#686B74',
    iconColor: '#E5322D',
    iconBg: '#FFF1F0',
    padding: 20
  },

  pdfTools: {
    uploadBg: '#FFFFFF',
    uploadBorder: '#D1D5DB',
    uploadDashedBorderColor: '#E5322D',
    uploadIconColor: '#E5322D',
    uploadHeadingColor: '#17181C',
    uploadTextColor: '#686B74',
    uploadButtonColor: '#E5322D',
    uploadButtonText: '#FFFFFF',
    dragOverBg: '#FFF5F5',
    borderRadius: 16,
    
    resultCardBg: '#FFFFFF',
    resultHeadingColor: '#17181C',
    downloadButtonColor: '#E5322D',
    downloadButtonText: '#FFFFFF',
    successIconColor: '#10B981',
    errorIconColor: '#EF4444'
  },

  forms: {
    inputBg: '#FFFFFF',
    inputText: '#17181C',
    inputPlaceholder: '#9CA3AF',
    inputBorder: '#D1D5DB',
    inputFocusBorder: '#E5322D',
    inputFocusRing: 'rgba(229, 50, 45, 0.2)',
    labelColor: '#374151',
    inputRadius: 8,
    inputHeight: 42,
    checkboxAccent: '#E5322D',
    radioAccent: '#E5322D'
  },

  darkMode: {
    enabled: false,
    mode: 'manual',
    background: '#121316',
    surface: '#1E1F24',
    heading: '#F3F4F6',
    text: '#E5E7EB',
    mutedText: '#9CA3AF',
    border: '#2E3038',
    primary: '#FF4D47',
    link: '#FF5C57',
    headerBg: '#1A1B20',
    footerBg: '#101114',
    darkLogo: '/ilovepdf.svg'
  },

  layout: {
    containerWidth: '1280px',
    radiusSm: 6,
    radiusMd: 10,
    radiusLg: 16,
    radiusXl: 24,
    radiusPill: 9999,
    globalSectionSpacing: 'normal'
  },

  advanced: {
    customCss: '',
    customHeadCode: '',
    customBodyEndCode: ''
  }
};

export const THEME_PRESETS: Record<string, Partial<ThemeConfig>> = {
  default: {
    name: 'iLovePDF Classic Red',
    colors: { ...DEFAULT_THEME.colors },
    typography: { ...DEFAULT_THEME.typography }
  },
  modernIndigo: {
    name: 'Modern Indigo & Cyan',
    colors: {
      ...DEFAULT_THEME.colors,
      primary: '#4F46E5',
      accent: '#06B6D4',
      link: '#4F46E5',
      linkHover: '#4338CA'
    },
    buttons: {
      ...DEFAULT_THEME.buttons,
      primaryBg: '#4F46E5',
      primaryHoverBg: '#4338CA'
    },
    typography: {
      ...DEFAULT_THEME.typography,
      headingFont: 'Plus Jakarta Sans',
      bodyFont: 'Plus Jakarta Sans'
    }
  },
  emeraldClean: {
    name: 'Emerald Green Pro',
    colors: {
      ...DEFAULT_THEME.colors,
      primary: '#059669',
      accent: '#10B981',
      link: '#059669',
      linkHover: '#047857'
    },
    buttons: {
      ...DEFAULT_THEME.buttons,
      primaryBg: '#059669',
      primaryHoverBg: '#047857'
    },
    typography: {
      ...DEFAULT_THEME.typography,
      headingFont: 'Poppins',
      bodyFont: 'Inter'
    }
  },
  darkMonochrome: {
    name: 'Dark Monochrome & Slate',
    colors: {
      ...DEFAULT_THEME.colors,
      primary: '#2563EB',
      secondary: '#0F172A',
      pageBackground: '#0F172A',
      surfaceBackground: '#1E293B',
      heading: '#F8FAFC',
      bodyText: '#E2E8F0',
      mutedText: '#94A3B8',
      border: '#334155'
    },
    header: {
      ...DEFAULT_THEME.header,
      background: '#1E293B',
      textColor: '#F8FAFC',
      navColor: '#E2E8F0',
      navHoverColor: '#38BDF8',
      borderColor: '#334155'
    },
    typography: {
      ...DEFAULT_THEME.typography,
      headingFont: 'DM Sans',
      bodyFont: 'Inter'
    }
  },
  highContrast: {
    name: 'High Contrast Accessibility',
    colors: {
      ...DEFAULT_THEME.colors,
      primary: '#D31B15',
      secondary: '#000000',
      pageBackground: '#FFFFFF',
      surfaceBackground: '#FFFFFF',
      heading: '#000000',
      bodyText: '#111111',
      mutedText: '#444444',
      border: '#000000'
    },
    buttons: {
      ...DEFAULT_THEME.buttons,
      primaryBg: '#D31B15',
      primaryHoverBg: '#B31410',
      borderRadius: 4,
      borderWidth: 2
    },
    typography: {
      ...DEFAULT_THEME.typography,
      headingFont: 'Open Sans',
      bodyFont: 'Open Sans',
      bodyWeight: '500',
      headingWeight: '800'
    }
  }
};
