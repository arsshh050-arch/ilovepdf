import fs from 'fs';
import path from 'path';

// Update static article files with dedicated images

const staticImageMap: Record<string, { url: string; alt: string; caption?: string }> = {
  'howToMergePdf.ts': {
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1600&q=80',
    alt: 'Stack of documents and organized folders on clean office desk',
    caption: 'Merge and combine multiple PDF files into one clean document'
  },
  'howToCompressPdf.ts': {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    alt: 'Data storage optimization and file compression interface',
    caption: 'Reduce PDF file size while preserving high visual quality'
  },
  'pdfToWordGuide.ts': {
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80',
    alt: 'Person typing on laptop creating editable Word document',
    caption: 'Convert PDF files into fully editable Microsoft Word DOCX files'
  },
  'makeScannedPdfSearchable.ts': {
    url: 'https://images.unsplash.com/photo-1507842229451-7f01be837453?auto=format&fit=crop&w=1600&q=80',
    alt: 'Magnifying glass searching through books and printed text',
    caption: 'Transform flat scanned PDF images into searchable text with OCR'
  },
  'howToSplitPdfPages.ts': {
    url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1600&q=80',
    alt: 'Separating and organizing individual paper pages on desk',
    caption: 'Split large multi-page PDF documents into individual files'
  },
  'howToPasswordProtectPdf.ts': {
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
    alt: 'Cybersecurity digital padlock interface protecting private files',
    caption: 'Encrypt and password protect sensitive PDF documents with AES-256'
  },
  'howToUnlockPdfDocument.ts': {
    url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1600&q=80',
    alt: 'Open padlock and secure key unlocking restricted data',
    caption: 'Remove passwords and permissions locks from PDF documents'
  },
  'howToConvertJpgToPdf.ts': {
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80',
    alt: 'Digital camera and printed photograph prints on table',
    caption: 'Convert JPEG and PNG pictures into clean single-page or multi-page PDFs'
  },
  'howToSignPdfOnline.ts': {
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80',
    alt: 'Hand signing legal agreement with fountain pen on document',
    caption: 'Create legally binding electronic signatures and sign PDFs online'
  },
  'howToSummarizePdfWithAi.ts': {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    alt: 'Futuristic artificial intelligence glowing neural network waves',
    caption: 'Summarize long PDF research papers and reports with AI'
  },
  'pdfToExcelTableConversion.ts': {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Financial analytics spreadsheet and data graphs on screen',
    caption: 'Extract tables from PDF into structured Microsoft Excel spreadsheets'
  },
  'howToOrganizeAndReorderPdfPages.ts': {
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80',
    alt: 'Neatly organized stack of books and documents in order',
    caption: 'Visual drag-and-drop page organizer to reorder and delete PDF pages'
  },
  'pdfToolsForStudents.ts': {
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    alt: 'University students studying together in modern campus library',
    caption: 'Essential free online PDF tools for university students and educators'
  },
  'whyIsMyPdfFileSoLarge.ts': {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    alt: 'Data center server rack lights representing large digital storage',
    caption: 'Discover why PDF files bloat and how to shrink hidden embedded fonts and images'
  },
  'howToConvertPdfToPpt.ts': {
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1600&q=80',
    alt: 'Speaker presenting slide deck on big conference stage screen',
    caption: 'Convert PDF slides into editable Microsoft PowerPoint presentations'
  },
  'howToAddWatermarkToPdf.ts': {
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Official legal stamp and confidential seals on court papers',
    caption: 'Apply custom text or logo watermarks to secure confidential PDF files'
  },
  'howToConvertWordToPdf.ts': {
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    alt: 'Clean modern workspace with notebook and laptop computer',
    caption: 'Convert Microsoft Word documents to standardized, universally readable PDFs'
  },
  'howToExtractImagesFromPdf.ts': {
    url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80',
    alt: 'Creative designers collaborating on visual photo layouts',
    caption: 'Extract all embedded original high-resolution photos and illustrations from PDF'
  },
  'howToRotatePdfPages.ts': {
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    alt: 'Architectural blueprint drafts rotated on drafting table',
    caption: 'Permanently rotate sideways and upside-down PDF pages in batch'
  },
  'pdfAccessibilityGuide.ts': {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
    alt: 'Person using modern digital accessibility tools and screen readers',
    caption: 'Make PDF files compliant with Section 508 and WCAG accessibility standards'
  },
  'reducePdfSizeForEmail.ts': {
    url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1600&q=80',
    alt: 'Digital mail envelopes and fast email inbox communication',
    caption: 'Compress oversized PDF attachments to fit under standard 25MB email limits'
  },
  'compressScannedPdf.ts': {
    url: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=1600&q=80',
    alt: 'Modern multi-function office document scanner and printer',
    caption: 'Optimize heavy scanned paper documents down to compact, crisp PDF files'
  },
  'pdfVsWordGuide.ts': {
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80',
    alt: 'Two document formats compared side-by-side on desk',
    caption: 'Comprehensive comparison: When to use PDF vs Microsoft Word DOCX'
  },
  'jpgVsPdfGuide.ts': {
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    alt: 'High-resolution photography prints showing sharp image clarity',
    caption: 'Understanding image formats: JPG raster graphics vs PDF vector documents'
  },
  'pdfForJobApplication.ts': {
    url: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=1600&q=80',
    alt: 'HR recruiter reviewing candidate resume and application portfolio',
    caption: 'How to format and submit professional resume and CV PDFs for ATS systems'
  },
  'pdfToolsForBusiness.ts': {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    alt: 'Corporate high-rise office towers representing enterprise business operations',
    caption: 'Streamline enterprise document workflows, contracting, and compliance'
  },
  'completeGuideToOnlinePdfTools.ts': {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    alt: 'Global digital cloud network connections and web productivity',
    caption: 'The definitive master guide to modern browser-based PDF utilities'
  }
};

const dir = path.join(process.cwd(), 'src', 'content', 'blog', 'articles');
for (const [filename, img] of Object.entries(staticImageMap)) {
  const filePath = path.join(dir, filename);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Replace featuredImage block
    const regex = /featuredImage:\s*\{[\s\S]*?\},/;
    const replacement = `featuredImage: {\n    url: '${img.url}',\n    alt: '${img.alt.replace(/'/g, "\\'")}',\n    caption: '${(img.caption || img.alt).replace(/'/g, "\\'")}'\n  },`;
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated ${filename}`);
    }
  }
}
