import fs from 'fs';
import path from 'path';


// DATA DIRECTORY
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cms_db.json');

// Types
export interface CMSData {
  pages: any[];
  tools: any[];
  blogs?: any[];
  categories: any[];
  tags: any[];
  keywords: any[];
  seoOverrides: Record<string, any>;
  gscSettings: any;
  redirects: any[];
  notFoundLogs: any[];
  navigation: any;
  footer: any;
  languages: any[];
  translations: Record<string, any>;
  faqs: any[];
  settings: any;
  ads: any;
  integrations: any;
  leads: any[];
  users: any[];
  workflows: any[];
  apiKeys: any[];
  auditLogs: any[];
  media: any[];
  robotsTxt: string;
  // Theme & Appearance
  theme?: any;
  draftTheme?: any;
  themeRevisions?: any[];
  // Competitor SEO Research
  seo_competitors: any[];
  seo_competitor_scans: any[];
  seo_competitor_pages: any[];
  seo_keyword_gaps: any[];
  seo_content_opportunities: any[];
  seo_tool_gaps: any[];
}

// Initial Seed Data Generator
function generateInitialSeed(): CMSData {
  return {
    pages: [
      {
        id: 'home',
        slug: '/',
        title: 'iLovePDF.in - Free Online PDF Tools for All Document Needs',
        h1: 'Every tool you need to work with PDFs in one place',
        seoTitle: 'iLovePDF.in | Free Online PDF Tools to Merge, Split, Compress & Convert',
        metaDescription: '100% free, secure and easy to use online PDF tools. Merge PDF, Split PDF, Compress PDF, Convert PDF to Word, PDF to JPG, and protect your documents online.',
        canonical: 'https://ilovepdf.in/',
        indexStatus: 'index,follow',
        introText: 'Every tool you need to use PDFs, at your fingertips. All 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.',
        sections: [
          {
            id: 'hero',
            title: 'Hero Section',
            content: 'Every tool you need to work with PDFs in one place.'
          },
          {
            id: 'trust',
            title: 'Trust & Security',
            content: 'Over 1,000,000 documents processed securely every day. Your privacy is guaranteed.'
          }
        ],
        ctaText: 'Explore All PDF Tools',
        ctaUrl: '/#tools',
        faq: [
          {
            question: 'Is ilovepdf.in free to use?',
            answer: 'Yes! All core PDF tools on ilovepdf.in are 100% free to use with no hidden subscription fees.'
          },
          {
            question: 'Are my uploaded PDF files safe?',
            answer: 'Absolutely. Files are processed over secure HTTPS connections and deleted automatically after processing.'
          }
        ],
        relatedLinks: [
          { text: 'Merge PDF', url: '/merge-pdf' },
          { text: 'Compress PDF', url: '/compress-pdf' },
          { text: 'PDF to Word', url: '/pdf-to-word' }
        ],
        status: 'published',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'business',
        slug: '/business',
        title: 'iLovePDF for Business & Enterprise Solutions',
        h1: 'Scale Document Processing for Your Entire Organization',
        seoTitle: 'iLovePDF Business | Enterprise Document Automation & Workflows',
        metaDescription: 'Empower your enterprise with scalable, secure PDF processing. Dedicated API integration, bulk batch processing, SOC2 compliance, and priority support.',
        canonical: 'https://ilovepdf.in/business',
        indexStatus: 'index,follow',
        introText: 'Transform document operations across HR, legal, sales, and finance with centralized PDF tooling.',
        status: 'published',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'developers',
        slug: '/developers',
        title: 'PDF API for Developers',
        h1: 'High-Performance PDF REST API for Developers',
        seoTitle: 'iLovePDF Developer API | RESTful PDF Processing Engine',
        metaDescription: 'Integrate PDF merge, compression, OCR, and conversion directly into your Web or Mobile apps with our simple REST API.',
        canonical: 'https://ilovepdf.in/developers',
        indexStatus: 'index,follow',
        introText: 'Fast, developer-friendly REST API for serverless and enterprise applications.',
        status: 'published',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pricing',
        slug: '/pricing',
        title: 'Pricing Plans & Subscriptions',
        h1: 'Simple, Transparent Pricing for Everyone',
        seoTitle: 'iLovePDF Pricing | Free, Premium & Business Plans',
        metaDescription: 'Choose the plan that fits your workload. Free forever for individuals, with high-volume upgrades for teams.',
        canonical: 'https://ilovepdf.in/pricing',
        indexStatus: 'index,follow',
        status: 'published',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'about',
        slug: '/about',
        title: 'About iLovePDF.in',
        h1: 'Our Mission: Making Document Management Effortless',
        seoTitle: 'About iLovePDF.in | Free Online PDF Software',
        metaDescription: 'Learn about ilovepdf.in, our mission to simplify document management for millions of users worldwide.',
        canonical: 'https://ilovepdf.in/about',
        indexStatus: 'index,follow',
        status: 'published',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'contact',
        slug: '/contact',
        title: 'Contact Us',
        h1: 'Get in Touch with Our Team',
        seoTitle: 'Contact iLovePDF.in | Help, Support & Business Inquiries',
        metaDescription: 'Have questions, feedback, or need enterprise assistance? Contact our support team today.',
        canonical: 'https://ilovepdf.in/contact',
        indexStatus: 'index,follow',
        status: 'published',
        updatedAt: new Date().toISOString()
      }
    ],
    tools: [
      {
        id: 'merge',
        name: 'Merge PDF',
        slug: 'merge-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'core',
        icon: 'Combine',
        description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
        seoTitle: 'Merge PDF Files Online - Combine PDF Pages Free | iLovePDF.in',
        metaDescription: 'Combine multiple PDF files into one single PDF document online in seconds. Free, easy to use, and completely secure.',
        h1: 'Merge PDF Files Online',
        intro: 'Select multiple PDF files and merge them in seconds. Reorder pages with easy drag and drop.',
        position: 1,
        featured: true,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/merge-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'split',
        name: 'Split PDF',
        slug: 'split-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'core',
        icon: 'SplitSquareHorizontal',
        description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
        seoTitle: 'Split PDF Pages Online - Extract PDF Pages Free | iLovePDF.in',
        metaDescription: 'Separate one page or a whole set for easy conversion into independent PDF files. Free and fast.',
        h1: 'Split PDF Pages Online',
        intro: 'Extract specific page ranges or split every page into separate PDF documents.',
        position: 2,
        featured: true,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/split-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'compress',
        name: 'Compress PDF',
        slug: 'compress-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'core',
        icon: 'Minimize',
        description: 'Reduce file size while optimizing for maximal PDF quality.',
        seoTitle: 'Compress PDF Online - Reduce PDF File Size Free | iLovePDF.in',
        metaDescription: 'Reduce the file size of your PDF documents while maintaining maximal text & image quality.',
        h1: 'Compress PDF Online',
        intro: 'Select extreme, recommended, or low compression to drastically shrink your PDF size.',
        position: 3,
        featured: true,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/compress-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pdf-to-word',
        name: 'PDF to Word',
        slug: 'pdf-to-word',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'convert_from',
        icon: 'FileText',
        description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
        seoTitle: 'Convert PDF to Word Online - Free DOCX Converter | iLovePDF.in',
        metaDescription: 'Convert PDF files to editable Word DOCX documents with perfect formatting preservation.',
        h1: 'Convert PDF to Word Online',
        intro: 'Fast, accurate PDF to Word converter keeping layouts and paragraphs intact.',
        position: 4,
        featured: true,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/pdf-to-word',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pdf-to-jpg',
        name: 'PDF to JPG',
        slug: 'pdf-to-jpg',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'convert_from',
        icon: 'Image',
        description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
        seoTitle: 'Convert PDF to JPG Images Free Online | iLovePDF.in',
        metaDescription: 'Convert PDF pages into high-resolution JPG images or extract embedded images.',
        h1: 'Convert PDF to JPG Online',
        intro: 'Extract images or convert full PDF pages into JPEG format in seconds.',
        position: 5,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/pdf-to-jpg',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'jpg-to-pdf',
        name: 'JPG to PDF',
        slug: 'jpg-to-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'convert_to',
        icon: 'FileImage',
        description: 'Adjust orientation and margins. Convert JPG images to PDF in seconds.',
        seoTitle: 'Convert JPG to PDF Online - Images to PDF Free | iLovePDF.in',
        metaDescription: 'Combine multiple JPG, PNG, or WEBP images into a clean PDF file with custom margins.',
        h1: 'Convert JPG to PDF Online',
        intro: 'Transform images to PDF with options for portrait/landscape orientation.',
        position: 6,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/jpg-to-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'protect',
        name: 'Protect PDF',
        slug: 'protect-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'security',
        icon: 'Lock',
        description: 'Encrypt your PDF with a password to keep sensitive data confidential.',
        seoTitle: 'Password Protect PDF Online - Encrypt PDF Free | iLovePDF.in',
        metaDescription: 'Protect PDF files with AES 128-bit or 256-bit encryption and passwords.',
        h1: 'Password Protect PDF Online',
        intro: 'Add military-grade password encryption to restrict unauthorized opening.',
        position: 7,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/protect-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'unlock',
        name: 'Unlock PDF',
        slug: 'unlock-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'security',
        icon: 'Unlock',
        description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
        seoTitle: 'Unlock PDF Online - Remove PDF Password Free | iLovePDF.in',
        metaDescription: 'Remove owner passwords and security restrictions from protected PDF files.',
        h1: 'Unlock PDF Security Online',
        intro: 'Remove restrictions to edit, copy, or print protected PDF documents.',
        position: 8,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/unlock-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'edit',
        name: 'Edit PDF',
        slug: 'edit-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'edit',
        icon: 'Edit3',
        description: 'Add text, shapes, comments and highlights to a PDF document.',
        seoTitle: 'Edit PDF Online - Free PDF Editor & Annotator | iLovePDF.in',
        metaDescription: 'Add text, shapes, images, and freehand annotations directly to your PDF online.',
        h1: 'Edit PDF Online',
        intro: 'Annotate, draw, add text, or watermark your PDF files in your browser.',
        position: 9,
        featured: true,
        newBadge: true,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/edit-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ocr',
        name: 'OCR PDF',
        slug: 'ocr-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'edit',
        icon: 'Eye',
        description: 'Convert scanned PDF documents into searchable and selectable text.',
        seoTitle: 'OCR PDF Online - Make Scanned PDF Searchable Free | iLovePDF.in',
        metaDescription: 'Recognize text in scanned PDF files with optical character recognition (OCR).',
        h1: 'Optical Character Recognition OCR PDF',
        intro: 'Transform image-only PDF scans into searchable, copyable text documents.',
        position: 10,
        featured: true,
        newBadge: true,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/ocr-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'organize',
        name: 'Organize PDF',
        slug: 'organize-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'core',
        icon: 'Layers',
        description: 'Sort, delete, and reorder PDF pages with drag-and-drop ease.',
        seoTitle: 'Organize PDF Pages - Reorder & Delete PDF Pages | iLovePDF.in',
        metaDescription: 'Rearrange PDF pages, delete unwanted pages, or add new pages in seconds.',
        h1: 'Organize & Reorder PDF Pages',
        intro: 'Drag and drop PDF pages to rearrange or delete unnecessary pages.',
        position: 11,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/organize-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'rotate',
        name: 'Rotate PDF',
        slug: 'rotate-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'core',
        icon: 'RotateCw',
        description: 'Rotate your PDFs the way you need. You can even rotate specific pages.',
        seoTitle: 'Rotate PDF Online - Change PDF Orientation | iLovePDF.in',
        metaDescription: 'Rotate individual pages or entire PDF files clockwise or counterclockwise.',
        h1: 'Rotate PDF Pages Online',
        intro: 'Fix orientation issues for scanned landscape or portrait PDF documents.',
        position: 12,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/rotate-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'watermark',
        name: 'Watermark PDF',
        slug: 'watermark-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'edit',
        icon: 'Stamp',
        description: 'Stamp an image or text over your PDF in seconds. Choose typography and position.',
        seoTitle: 'Add Watermark to PDF Online - Image or Text Stamp | iLovePDF.in',
        metaDescription: 'Add custom text watermarks or logo stamps to your PDF files for copyright protection.',
        h1: 'Add Watermark to PDF',
        intro: 'Customize opacity, font, position, and rotation for text or image watermarks.',
        position: 13,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/watermark-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'page-numbers',
        name: 'Page Numbers',
        slug: 'page-numbers',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'edit',
        icon: 'Hash',
        description: 'Add page numbers into PDFs easily. Choose position, dimensions, typography.',
        seoTitle: 'Add Page Numbers to PDF - Number PDF Pages | iLovePDF.in',
        metaDescription: 'Insert header or footer page numbers into your PDF with custom numbering formatting.',
        h1: 'Add Page Numbers to PDF',
        intro: 'Select page range, starting number, and font styling for automatic numbering.',
        position: 14,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/page-numbers',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pdf-to-powerpoint',
        name: 'PDF to PowerPoint',
        slug: 'pdf-to-powerpoint',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'convert_from',
        icon: 'Presentation',
        description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
        seoTitle: 'Convert PDF to PowerPoint Online - PDF to PPTX | iLovePDF.in',
        metaDescription: 'Convert PDF slides into editable Microsoft PowerPoint PPTX presentations.',
        h1: 'Convert PDF to PowerPoint',
        intro: 'Transform PDF pages into editable PPTX slides in seconds.',
        position: 15,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/pdf-to-powerpoint',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pdf-to-excel',
        name: 'PDF to Excel',
        slug: 'pdf-to-excel',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'convert_from',
        icon: 'Table',
        description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
        seoTitle: 'Convert PDF to Excel Online - PDF to XLSX | iLovePDF.in',
        metaDescription: 'Extract tables and financial data from PDF to editable Excel spreadsheets.',
        h1: 'Convert PDF to Excel Spreadsheet',
        intro: 'Extract PDF data rows and tables cleanly into Microsoft Excel format.',
        position: 16,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/pdf-to-excel',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'word-to-pdf',
        name: 'Word to PDF',
        slug: 'word-to-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'convert_to',
        icon: 'FileCode',
        description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
        seoTitle: 'Convert Word to PDF Online - DOCX to PDF Free | iLovePDF.in',
        metaDescription: 'Convert Microsoft Word documents (DOC, DOCX) to clean PDF files instantly.',
        h1: 'Convert Word to PDF Online',
        intro: 'Convert Word documents to high-quality PDF files with preserved formatting.',
        position: 17,
        featured: true,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/word-to-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'powerpoint-to-pdf',
        name: 'PowerPoint to PDF',
        slug: 'powerpoint-to-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'convert_to',
        icon: 'Presentation',
        description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
        seoTitle: 'Convert PowerPoint to PDF Online - PPTX to PDF | iLovePDF.in',
        metaDescription: 'Convert PPT and PPTX slideshows into high-resolution PDF documents.',
        h1: 'Convert PowerPoint to PDF',
        intro: 'Turn presentation decks into universally readable PDF files.',
        position: 18,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/powerpoint-to-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'excel-to-pdf',
        name: 'Excel to PDF',
        slug: 'excel-to-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'convert_to',
        icon: 'Table',
        description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
        seoTitle: 'Convert Excel to PDF Online - XLS to PDF Free | iLovePDF.in',
        metaDescription: 'Convert Excel spreadsheets (XLS, XLSX) into clean PDF documents.',
        h1: 'Convert Excel to PDF',
        intro: 'Format spreadsheet tables into publication-ready PDF documents.',
        position: 19,
        featured: false,
        newBadge: false,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/excel-to-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sign',
        name: 'Sign PDF',
        slug: 'sign-pdf',
        status: 'active',
        disabledAction: 'maintenance',
        category: 'edit',
        icon: 'PenTool',
        description: 'Sign a document yourself or send signature requests to others.',
        seoTitle: 'Sign PDF Online - Electronic Signature Generator | iLovePDF.in',
        metaDescription: 'Add legally binding digital signatures or draw hand signatures on PDF files.',
        h1: 'Sign PDF Documents Online',
        intro: 'Draw your signature, upload a signature stamp, or type your name on PDF documents.',
        position: 20,
        featured: true,
        newBadge: true,
        indexStatus: 'index,follow',
        canonical: 'https://ilovepdf.in/sign-pdf',
        schemaType: 'SoftwareApplication',
        updatedAt: new Date().toISOString()
      }
    ],
    categories: [
      { id: 'cat-pdf-guides', name: 'PDF Guides', slug: 'pdf-guides' },
      { id: 'cat-convert', name: 'Convert PDF', slug: 'convert-pdf' },
      { id: 'cat-edit', name: 'Edit PDF', slug: 'edit-pdf' },
      { id: 'cat-organize', name: 'Organize PDF', slug: 'organize-pdf' },
      { id: 'cat-compress', name: 'Compress PDF', slug: 'compress-pdf' },
      { id: 'cat-security', name: 'PDF Security', slug: 'pdf-security' },
      { id: 'cat-ocr', name: 'OCR & Scanning', slug: 'ocr-scanning' },
      { id: 'cat-ai', name: 'AI & PDF', slug: 'ai-pdf' },
      { id: 'cat-business', name: 'Business', slug: 'business' },
      { id: 'cat-students', name: 'Students & Education', slug: 'students-education' },
      { id: 'cat-troubleshooting', name: 'Troubleshooting', slug: 'troubleshooting' },
      { id: 'cat-developers', name: 'Developers', slug: 'developers' }
    ],
    tags: [
      { id: 't1', name: 'merge', slug: 'merge' },
      { id: 't2', name: 'compress', slug: 'compress' },
      { id: 't3', name: 'ocr', slug: 'ocr' },
      { id: 't4', name: 'convert', slug: 'convert' },
      { id: 't5', name: 'security', slug: 'security' }
    ],
    keywords: [
      {
        id: 'kw-merge',
        keyword: 'merge pdf',
        targetUrl: '/merge-pdf',
        searchIntent: 'transactional',
        secondaryKeywords: ['combine pdf online', 'join pdf files', 'merge pdf pages'],
        longTailKeywords: ['how to merge pdf files online free without watermark']
      },
      {
        id: 'kw-compress',
        keyword: 'compress pdf',
        targetUrl: '/compress-pdf',
        searchIntent: 'transactional',
        secondaryKeywords: ['reduce pdf size', 'shrink pdf', 'compress pdf to 100kb'],
        longTailKeywords: ['how to compress pdf without losing quality free']
      },
      {
        id: 'kw-pdf-to-word',
        keyword: 'pdf to word',
        targetUrl: '/pdf-to-word',
        searchIntent: 'transactional',
        secondaryKeywords: ['convert pdf to docx', 'pdf to editable word'],
        longTailKeywords: ['best free online pdf to word converter with layout formatting']
      },
      {
        id: 'kw-jpg-to-pdf',
        keyword: 'jpg to pdf',
        targetUrl: '/jpg-to-pdf',
        searchIntent: 'transactional',
        secondaryKeywords: ['i love pdf', 'ilovepdf', 'jpg to pdf', 'i love pdf jpg to pdf', 'ilovepdf jpg to pdf', 'jpeg to pdf', 'image to pdf'],
        longTailKeywords: ['i love pdf jpg to pdf', 'ilovepdf jpg to pdf converter free online']
      }
    ],
    redirects: [
      {
        id: 'r1',
        sourceUrl: '/combine-pdf',
        destinationUrl: '/merge-pdf',
        type: '301',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'r2',
        sourceUrl: '/reduce-pdf',
        destinationUrl: '/compress-pdf',
        type: '301',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ],
    notFoundLogs: [],
    navigation: {
      header: [
        { label: 'MERGE PDF', path: '/merge-pdf' },
        { label: 'SPLIT PDF', path: '/split-pdf' },
        { label: 'COMPRESS PDF', path: '/compress-pdf' },
      ]
    },
    footer: {
      columns: [
        {
          title: 'PRODUCT',
          links: [
            { label: 'Homepage', url: '/' },
            { label: 'Business', url: '/business' },
            { label: 'Developer API', url: '/developers' },
            { label: 'Pricing', url: '/pricing' }
          ]
        },
        {
          title: 'POPULAR TOOLS',
          links: [
            { label: 'Merge PDF', url: '/merge-pdf' },
            { label: 'Split PDF', url: '/split-pdf' },
            { label: 'Compress PDF', url: '/compress-pdf' },
            { label: 'PDF to Word', url: '/pdf-to-word' }
          ]
        },
        {
          title: 'RESOURCES',
          links: [
            { label: 'FAQ', url: '/faq' },
            { label: 'Security & Privacy', url: '/security' },
            { label: 'Contact Us', url: '/contact' }
          ]
        }
      ],
      copyright: '© 2026 iLovePDF.in - All Rights Reserved. Powerful Online PDF Tools.'
    },
    languages: [
      { code: 'en', name: 'English', enabled: true, isDefault: true, completenessPercent: 100 },
      { code: 'hi', name: 'Hindi', enabled: true, isDefault: false, completenessPercent: 85 },
      { code: 'es', name: 'Spanish', enabled: true, isDefault: false, completenessPercent: 80 }
    ],
    translations: {},
    faqs: [
      {
        id: 'faq-1',
        scope: 'global',
        question: 'Is iLovePDF.in safe to use?',
        answer: 'Yes, iLovePDF.in processes all files locally or via encrypted server channels. Uploaded files are deleted automatically.'
      }
    ],
    settings: {
      siteName: 'iLovePDF.in',
      logoUrl: '/logo.svg',
      faviconUrl: '/favicon.ico',
      defaultSeoTitleSuffix: '| iLovePDF.in',
      contactEmail: 'support@ilovepdf.in',
      copyrightText: '© 2026 iLovePDF.in - All Rights Reserved.',
      defaultLanguage: 'en',
      timezone: 'UTC'
    },
    ads: {
      homepageTop: { enabled: false, code: '' },
      toolSidebar: { enabled: false, code: '' },
      resultPageBanner: { enabled: false, code: '' }
    },
    integrations: {
      googleDrive: { status: 'Not configured' },
      dropbox: { status: 'Not configured' },
      searchConsole: { status: 'Not connected' },
      indexNow: { status: 'Configured' },
      googleOAuth: { status: 'Not configured' },
      emailService: { status: 'Configured' },
      analytics: { status: 'Configured' }
    },
    leads: [],
    users: [
      {
        id: 'usr-admin-1',
        email: process.env.ADMIN_EMAIL || 'admin@ilovepdf.in',
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: 'active'
      }
    ],
    workflows: [
      {
        id: 'wf-1',
        name: 'Merge and Compress Workflow',
        owner: 'system',
        steps: ['Upload Files', 'Merge PDF', 'Compress PDF', 'Download'],
        status: 'active',
        created: new Date().toISOString(),
        lastRun: new Date().toISOString()
      }
    ],
    apiKeys: [],
    auditLogs: [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        action: 'System Initialized',
        resource: 'CMS Store',
        adminEmail: 'system',
        ip: '127.0.0.1',
        details: 'Initial CMS database initialized successfully'
      }
    ],
    media: [],
    seoOverrides: {},
    gscSettings: {
      verificationMetaTag: 'google-site-verification=ilovepdf-in-official-verification-code-2026',
      verificationHtmlFileName: 'google1b13fe545cc8499e.html',
      verificationHtmlContent: 'google-site-verification: google1b13fe545cc8499e.html',
      propertyUrl: 'https://ilovepdf.in/',
      serviceAccountEmail: 'gsc-service-account@ilovepdf-in.iam.gserviceaccount.com',
      isConnected: true,
      lastVerifiedAt: new Date().toISOString(),
      sitemaps: [
        { url: 'https://ilovepdf.in/sitemap.xml', type: 'Primary Index', lastSubmitted: new Date().toISOString(), status: 'Success', itemsCount: 54 },
      ]
    },
    robotsTxt: `User-agent: *
Allow: /
Allow: /favicon.ico
Allow: /favicon-*.png
Allow: /apple-touch-icon.png
Allow: /assets/

# Disallow private user/admin/session endpoints
Disallow: /admin/
Disallow: /user/
Disallow: /api/
Disallow: /download/
Disallow: /downloads/
Disallow: /result/
Disallow: /session/

User-agent: Googlebot-Image
Allow: /favicon.ico
Allow: /favicon-*.png
Allow: /apple-touch-icon.png
Allow: /ilovepdf.svg
Allow: /og-image.png

# Sitemap location
Sitemap: https://www.ilovepdf.in/sitemap.xml`,
    seo_competitors: [],
    seo_competitor_scans: [],
    seo_competitor_pages: [],
    seo_keyword_gaps: [],
    seo_content_opportunities: [],
    seo_tool_gaps: []
  };
}

class CMSStore {
  private data: CMSData;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): CMSData {
    let data: CMSData;
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        data = JSON.parse(raw);
      } else {
        data = generateInitialSeed();
      }
    } catch (err) {
      console.error('Error loading cms_db.json, recreating from seed:', err);
      data = generateInitialSeed();
    }

    if (!data.pages || !Array.isArray(data.pages) || data.pages.length === 0) {
      data.pages = generateInitialSeed().pages;
    }
    if (!data.tools || !Array.isArray(data.tools) || data.tools.length < 5) {
      const seedTools = generateInitialSeed().tools;
      const existingSlugs = new Set((data.tools || []).map((t: any) => t.slug));
      data.tools = [
        ...(data.tools || []),
        ...seedTools.filter((st: any) => !existingSlugs.has(st.slug))
      ];
    }
    if (!data.seoOverrides) data.seoOverrides = {};
    if (!data.seo_competitors) data.seo_competitors = [];
    if (!data.seo_competitor_scans) data.seo_competitor_scans = [];
    if (!data.seo_competitor_pages) data.seo_competitor_pages = [];
    if (!data.seo_keyword_gaps) data.seo_keyword_gaps = [];
    if (!data.seo_content_opportunities) data.seo_content_opportunities = [];
    if (!data.seo_tool_gaps) data.seo_tool_gaps = [];
    if (!data.themeRevisions) data.themeRevisions = [];
    if (!data.gscSettings) {
      data.gscSettings = {
        verificationMetaTag: 'google-site-verification=ilovepdf-in-official-verification-code-2026',
        verificationHtmlFileName: 'google1b13fe545cc8499e.html',
        verificationHtmlContent: 'google-site-verification: google1b13fe545cc8499e.html',
        propertyUrl: 'https://ilovepdf.in/',
        serviceAccountEmail: 'gsc-service-account@ilovepdf-in.iam.gserviceaccount.com',
        isConnected: true,
        lastVerifiedAt: new Date().toISOString(),
        sitemaps: [
          { url: 'https://ilovepdf.in/sitemap.xml', type: 'Primary Index', lastSubmitted: new Date().toISOString(), status: 'Success', itemsCount: 54 },
        ]
      };
    }
    this.saveDataDirect(data);
    return data;
  }

  private saveDataDirect(data: CMSData) {
    try {
      this.ensureDataDir();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to save cms_db.json:', err);
    }
  }

  public save() {
    this.saveDataDirect(this.data);
  }

  public getData(): CMSData {
    return this.data;
  }

  public get<K extends keyof CMSData>(key: K): CMSData[K] {
    return this.data[key];
  }

  public set<K extends keyof CMSData>(key: K, value: CMSData[K]) {
    this.data[key] = value;
    this.save();
  }

  public logAudit(action: string, resource: string, adminEmail: string, ip: string, details: string) {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      resource,
      adminEmail,
      ip,
      details
    };
    if (!this.data.auditLogs) {
      this.data.auditLogs = [];
    }
    this.data.auditLogs.unshift(newLog);
    // keep last 500 logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
  }
}

export const cmsStore = new CMSStore();
