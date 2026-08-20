export interface RouteRichResultsConfig {
  path: string;
  name: string;
  isIndexable: boolean;
  pageType: 'homepage' | 'tool' | 'faq' | 'business' | 'developer' | 'info' | 'auth' | 'utility';
  schemaTypes: string[];
  googleSupportedRichResults: string[];
}

export const RICH_RESULTS_MAP: Record<string, RouteRichResultsConfig> = {
  '/': {
    path: '/',
    name: 'Home',
    isIndexable: true,
    pageType: 'homepage',
    schemaTypes: ['WebSite', 'Organization'],
    googleSupportedRichResults: ['Sitelinks Searchbox', 'Logo']
  },

  // PUBLIC TOOL PAGES
  '/merge-pdf': {
    path: '/merge-pdf',
    name: 'Merge PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/split-pdf': {
    path: '/split-pdf',
    name: 'Split PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/compress-pdf': {
    path: '/compress-pdf',
    name: 'Compress PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-to-word': {
    path: '/pdf-to-word',
    name: 'PDF to Word',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-to-powerpoint': {
    path: '/pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-to-excel': {
    path: '/pdf-to-excel',
    name: 'PDF to Excel',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/word-to-pdf': {
    path: '/word-to-pdf',
    name: 'Word to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/powerpoint-to-pdf': {
    path: '/powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/excel-to-pdf': {
    path: '/excel-to-pdf',
    name: 'Excel to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/edit-pdf': {
    path: '/edit-pdf',
    name: 'Edit PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-to-jpg': {
    path: '/pdf-to-jpg',
    name: 'PDF to JPG',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/jpg-to-pdf': {
    path: '/jpg-to-pdf',
    name: 'JPG to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/sign-pdf': {
    path: '/sign-pdf',
    name: 'Sign PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/watermark-pdf': {
    path: '/watermark-pdf',
    name: 'Watermark PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/rotate-pdf': {
    path: '/rotate-pdf',
    name: 'Rotate PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/html-to-pdf': {
    path: '/html-to-pdf',
    name: 'HTML to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/unlock-pdf': {
    path: '/unlock-pdf',
    name: 'Unlock PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/protect-pdf': {
    path: '/protect-pdf',
    name: 'Protect PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/organize-pdf': {
    path: '/organize-pdf',
    name: 'Organize PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-to-pdfa': {
    path: '/pdf-to-pdfa',
    name: 'PDF to PDF/A',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/repair-pdf': {
    path: '/repair-pdf',
    name: 'Repair PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/add-page-numbers': {
    path: '/add-page-numbers',
    name: 'Page Numbers',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/scan-to-pdf': {
    path: '/scan-to-pdf',
    name: 'Scan to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/ocr-pdf': {
    path: '/ocr-pdf',
    name: 'OCR PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/compare-pdf': {
    path: '/compare-pdf',
    name: 'Compare PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/redact-pdf': {
    path: '/redact-pdf',
    name: 'Redact PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/crop-pdf': {
    path: '/crop-pdf',
    name: 'Crop PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-forms': {
    path: '/pdf-forms',
    name: 'PDF Forms',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/ai-pdf-summarizer': {
    path: '/ai-pdf-summarizer',
    name: 'AI Summarizer',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/translate-pdf': {
    path: '/translate-pdf',
    name: 'Translate PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-to-markdown': {
    path: '/pdf-to-markdown',
    name: 'PDF to Markdown',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/remove-pages': {
    path: '/remove-pages',
    name: 'Remove Pages',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/extract-pages': {
    path: '/extract-pages',
    name: 'Extract Pages',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/png-to-pdf': {
    path: '/png-to-pdf',
    name: 'PNG to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-to-png': {
    path: '/pdf-to-png',
    name: 'PDF to PNG',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-to-txt': {
    path: '/pdf-to-txt',
    name: 'PDF to TXT',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/txt-to-pdf': {
    path: '/txt-to-pdf',
    name: 'TXT to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-to-html': {
    path: '/pdf-to-html',
    name: 'PDF to HTML',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/remove-pdf-metadata': {
    path: '/remove-pdf-metadata',
    name: 'Remove Metadata',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/flatten-pdf': {
    path: '/flatten-pdf',
    name: 'Flatten PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/extract-pdf-text': {
    path: '/extract-pdf-text',
    name: 'Extract PDF Text',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/pdf-question-answer': {
    path: '/pdf-question-answer',
    name: 'PDF Question & Answer',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/extract-pdf-tables': {
    path: '/extract-pdf-tables',
    name: 'Extract PDF Tables',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/annotate-pdf': {
    path: '/annotate-pdf',
    name: 'Annotate PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/add-text-pdf': {
    path: '/add-text-pdf',
    name: 'Add Text to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/add-image-pdf': {
    path: '/add-image-pdf',
    name: 'Add Image to PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/draw-on-pdf': {
    path: '/draw-on-pdf',
    name: 'Draw on PDF',
    isIndexable: true,
    pageType: 'tool',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },

  // PUBLIC INFORMATION PAGES
  '/faq': {
    path: '/faq',
    name: 'FAQ',
    isIndexable: true,
    pageType: 'faq',
    schemaTypes: ['BreadcrumbList', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/business': {
    path: '/business',
    name: 'Business Solutions',
    isIndexable: true,
    pageType: 'business',
    schemaTypes: ['BreadcrumbList', 'WebApplication', 'FAQPage'],
    googleSupportedRichResults: ['Breadcrumbs', 'FAQ']
  },
  '/developer-api': {
    path: '/developer-api',
    name: 'Developer API',
    isIndexable: true,
    pageType: 'developer',
    schemaTypes: ['BreadcrumbList', 'WebPage'],
    googleSupportedRichResults: ['Breadcrumbs']
  },
  '/about': {
    path: '/about',
    name: 'About Us',
    isIndexable: true,
    pageType: 'info',
    schemaTypes: ['BreadcrumbList', 'WebPage', 'Organization'],
    googleSupportedRichResults: ['Breadcrumbs']
  },
  '/contact': {
    path: '/contact',
    name: 'Contact Us',
    isIndexable: true,
    pageType: 'info',
    schemaTypes: ['BreadcrumbList', 'WebPage'],
    googleSupportedRichResults: ['Breadcrumbs']
  },
  '/features': {
    path: '/features',
    name: 'Features Overview',
    isIndexable: true,
    pageType: 'info',
    schemaTypes: ['BreadcrumbList', 'WebPage'],
    googleSupportedRichResults: ['Breadcrumbs']
  },
  '/security': {
    path: '/security',
    name: 'Security & Privacy',
    isIndexable: true,
    pageType: 'info',
    schemaTypes: ['BreadcrumbList', 'WebPage'],
    googleSupportedRichResults: ['Breadcrumbs']
  },
  '/pricing': {
    path: '/pricing',
    name: 'Pricing Plans',
    isIndexable: true,
    pageType: 'info',
    schemaTypes: ['BreadcrumbList', 'WebPage'],
    googleSupportedRichResults: ['Breadcrumbs']
  },
  '/privacy-policy': {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    isIndexable: true,
    pageType: 'info',
    schemaTypes: ['BreadcrumbList', 'WebPage'],
    googleSupportedRichResults: ['Breadcrumbs']
  },
  '/terms': {
    path: '/terms',
    name: 'Terms of Service',
    isIndexable: true,
    pageType: 'info',
    schemaTypes: ['BreadcrumbList', 'WebPage'],
    googleSupportedRichResults: ['Breadcrumbs']
  },
  '/cookie-policy': {
    path: '/cookie-policy',
    name: 'Cookie Policy',
    isIndexable: true,
    pageType: 'info',
    schemaTypes: ['BreadcrumbList', 'WebPage'],
    googleSupportedRichResults: ['Breadcrumbs']
  },

  // PRIVATE / NON-INDEXABLE UTILITY PAGES
  '/login': {
    path: '/login',
    name: 'Login',
    isIndexable: false,
    pageType: 'auth',
    schemaTypes: [],
    googleSupportedRichResults: []
  },
  '/signup': {
    path: '/signup',
    name: 'Signup',
    isIndexable: false,
    pageType: 'auth',
    schemaTypes: [],
    googleSupportedRichResults: []
  },
  '/forgot-password': {
    path: '/forgot-password',
    name: 'Forgot Password',
    isIndexable: false,
    pageType: 'auth',
    schemaTypes: [],
    googleSupportedRichResults: []
  }
};
