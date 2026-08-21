import * as Icons from 'lucide-react';
import { ElementType } from 'react';

export type ToolCategory = 'organize' | 'optimize' | 'convert_to' | 'convert_from' | 'edit' | 'security' | 'ai';

export interface PdfToolConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: keyof typeof Icons;
  iconColor: string;
  category: ToolCategory;
  isNew?: boolean;
  keywords?: string[];
}

export const PDF_TOOLS: PdfToolConfig[] = [
  // ROW 1
  { id: 'merge-pdf', name: 'Merge PDF', slug: '/merge-pdf', description: 'Combine PDFs in the order you want with the easiest PDF merger available.', iconName: 'Combine', iconColor: 'text-red-500', category: 'organize' },
  { id: 'split-pdf', name: 'Split PDF', slug: '/split-pdf', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', iconName: 'SplitSquareHorizontal', iconColor: 'text-red-500', category: 'organize' },
  { id: 'compress-pdf', name: 'Compress PDF', slug: '/compress-pdf', description: 'Reduce file size while optimizing for maximal PDF quality.', iconName: 'Minimize', iconColor: 'text-green-500', category: 'optimize' },
  { id: 'pdf-to-word', name: 'PDF to Word', slug: '/pdf-to-word', description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.', iconName: 'FileText', iconColor: 'text-blue-500', category: 'convert_from' },
  { id: 'pdf-to-powerpoint', name: 'PDF to PowerPoint', slug: '/pdf-to-powerpoint', description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.', iconName: 'Presentation', iconColor: 'text-orange-500', category: 'convert_from' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', slug: '/pdf-to-excel', description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.', iconName: 'Table', iconColor: 'text-green-600', category: 'convert_from' },

  // ROW 2
  { id: 'word-to-pdf', name: 'Word to PDF', slug: '/word-to-pdf', description: 'Make DOC and DOCX files easy to read by converting them to PDF.', iconName: 'FileText', iconColor: 'text-blue-500', category: 'convert_to' },
  { id: 'powerpoint-to-pdf', name: 'PowerPoint to PDF', slug: '/powerpoint-to-pdf', description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', iconName: 'Presentation', iconColor: 'text-orange-500', category: 'convert_to' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', slug: '/excel-to-pdf', description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.', iconName: 'Table', iconColor: 'text-green-600', category: 'convert_to' },
  { id: 'edit-pdf', name: 'Edit PDF', slug: '/edit-pdf', description: 'Add text, images, shapes or freehand annotations to a PDF document.', iconName: 'FileEdit', iconColor: 'text-purple-500', category: 'edit' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', slug: '/pdf-to-jpg', description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.', iconName: 'Image', iconColor: 'text-yellow-500', category: 'convert_from' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', slug: '/jpg-to-pdf', description: 'Adjust orientation and margins. Convert JPG images to PDF in seconds.', iconName: 'FileImage', iconColor: 'text-yellow-500', category: 'convert_to', keywords: ['i love pdf', 'ilovepdf', 'jpg to pdf', 'i love pdf jpg to pdf', 'ilovepdf jpg to pdf', 'convert jpg to pdf', 'jpeg to pdf', 'image to pdf', 'photos to pdf'] },

  // ROW 3
  { id: 'sign-pdf', name: 'Sign PDF', slug: '/sign-pdf', description: 'Sign yourself or request electronic signatures from others.', iconName: 'PenTool', iconColor: 'text-purple-500', category: 'security' },
  { id: 'watermark', name: 'Watermark', slug: '/watermark-pdf', description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.', iconName: 'Stamp', iconColor: 'text-purple-500', category: 'edit' },
  { id: 'rotate-pdf', name: 'Rotate PDF', slug: '/rotate-pdf', description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!', iconName: 'RotateCw', iconColor: 'text-purple-500', category: 'organize' },
  { id: 'html-to-pdf', name: 'HTML to PDF', slug: '/html-to-pdf', description: 'Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.', iconName: 'Code', iconColor: 'text-blue-500', category: 'convert_to' },
  { id: 'unlock-pdf', name: 'Unlock PDF', slug: '/unlock-pdf', description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', iconName: 'Unlock', iconColor: 'text-blue-600', category: 'security' },
  { id: 'protect-pdf', name: 'Protect PDF', slug: '/protect-pdf', description: 'Encrypt your PDF with a password to keep sensitive data confidential.', iconName: 'Lock', iconColor: 'text-blue-600', category: 'security' },

  // ROW 4
  { id: 'organize-pdf', name: 'Organize PDF', slug: '/organize-pdf', description: 'Sort, add and delete PDF pages. Drag and drop the page thumbnails and sort them in our PDF organizer.', iconName: 'Layers', iconColor: 'text-red-500', category: 'organize' },
  { id: 'pdf-to-pdfa', name: 'PDF to PDF/A', slug: '/pdf-to-pdfa', description: 'Transform your PDF to PDF/A, the ISO-standardized version of PDF for long-term archiving.', iconName: 'Archive', iconColor: 'text-blue-500', category: 'convert_from' },
  { id: 'repair-pdf', name: 'Repair PDF', slug: '/repair-pdf', description: 'Repair a damaged PDF and recover data from corrupt PDF. Fix PDF files with our Repair tool.', iconName: 'Wrench', iconColor: 'text-green-500', category: 'optimize' },
  { id: 'add-page-numbers', name: 'Page numbers', slug: '/add-page-numbers', description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.', iconName: 'ListOrdered', iconColor: 'text-purple-500', category: 'edit' },
  { id: 'scan-to-pdf', name: 'Scan to PDF', slug: '/scan-to-pdf', description: 'Capture document scans from your mobile device and send them instantly to your browser.', iconName: 'Scan', iconColor: 'text-red-500', category: 'organize' },
  { id: 'ocr-pdf', name: 'OCR PDF', slug: '/ocr-pdf', description: 'Convert PDF scans to searchable text and select. Recognize text in any PDF document with OCR.', iconName: 'ScanText', iconColor: 'text-green-500', category: 'optimize' },

  // ROW 5
  { id: 'compare-pdf', name: 'Compare PDF', slug: '/compare-pdf', description: 'Quickly find the differences between two PDFs. Visually compare two documents side by side.', iconName: 'Columns', iconColor: 'text-blue-600', category: 'security' },
  { id: 'redact-pdf', name: 'Redact PDF', slug: '/redact-pdf', description: 'Permanently remove visible text and graphics from a document to protect sensitive information.', iconName: 'Eraser', iconColor: 'text-blue-600', category: 'security' },
  { id: 'crop-pdf', name: 'Crop PDF', slug: '/crop-pdf', description: 'Crop PDF to a selected area, adjust margin size, and remove white margins.', iconName: 'Crop', iconColor: 'text-purple-500', category: 'edit' },
  { id: 'pdf-forms', name: 'PDF Forms', slug: '/pdf-forms', description: 'Create fillable PDF forms or fill existing ones easily online.', iconName: 'FormInput', iconColor: 'text-purple-500', category: 'edit', isNew: true },
  { id: 'ai-pdf-summarizer', name: 'AI Summarizer', slug: '/ai-pdf-summarizer', description: 'Get quick summaries of your PDF documents using advanced AI technology.', iconName: 'Sparkles', iconColor: 'text-violet-500', category: 'ai', isNew: true },
  { id: 'translate-pdf', name: 'Translate PDF', slug: '/translate-pdf', description: 'Translate your PDF into any language while maintaining the original layout.', iconName: 'Languages', iconColor: 'text-violet-500', category: 'ai', isNew: true },

  // ROW 6
  { id: 'pdf-to-markdown', name: 'PDF to Markdown', slug: '/pdf-to-markdown', description: 'Extract text and structure into standard Markdown format.', iconName: 'FileCode2', iconColor: 'text-violet-500', category: 'ai', isNew: true },
  // NOTE: 'Create a workflow' is handled separately as a special card in the grid component
  { id: 'remove-pages', name: 'Remove Pages', slug: '/remove-pages', description: 'Delete selected pages from your PDF document.', iconName: 'FileMinus', iconColor: 'text-red-500', category: 'organize' },
  { id: 'extract-pages', name: 'Extract Pages', slug: '/extract-pages', description: 'Get a new document containing only the pages you need.', iconName: 'Files', iconColor: 'text-red-500', category: 'organize' },
  { id: 'png-to-pdf', name: 'PNG to PDF', slug: '/png-to-pdf', description: 'Convert PNG images to PDF documents easily.', iconName: 'Image', iconColor: 'text-yellow-500', category: 'convert_to' },
  { id: 'pdf-to-png', name: 'PDF to PNG', slug: '/pdf-to-png', description: 'Extract images or save PDF pages as PNG files.', iconName: 'FileImage', iconColor: 'text-blue-500', category: 'convert_from' },

  // ROW 7
  { id: 'pdf-to-txt', name: 'PDF to TXT', slug: '/pdf-to-txt', description: 'Extract raw text from your PDF into a TXT file.', iconName: 'FileType2', iconColor: 'text-blue-500', category: 'convert_from' },
  { id: 'txt-to-pdf', name: 'TXT to PDF', slug: '/txt-to-pdf', description: 'Convert plain text files into professional PDF documents.', iconName: 'FileText', iconColor: 'text-yellow-500', category: 'convert_to' },
  { id: 'pdf-to-html', name: 'PDF to HTML', slug: '/pdf-to-html', description: 'Convert your PDF documents into HTML web pages.', iconName: 'FileCode', iconColor: 'text-blue-500', category: 'convert_from' },
  { id: 'remove-metadata', name: 'Remove Metadata', slug: '/remove-pdf-metadata', description: 'Clean your PDF files of hidden data and metadata.', iconName: 'ShieldMinus', iconColor: 'text-blue-600', category: 'security' },
  { id: 'flatten-pdf', name: 'Flatten PDF', slug: '/flatten-pdf', description: 'Flatten fillable forms and annotations into a single non-editable layer.', iconName: 'Layers', iconColor: 'text-blue-600', category: 'security' },
  { id: 'extract-pdf-text', name: 'Extract PDF Text', slug: '/extract-pdf-text', description: 'Pull all text content from a PDF document for easy reuse.', iconName: 'TextQuote', iconColor: 'text-violet-500', category: 'ai' },

  // ROW 8
  { id: 'pdf-question-answer', name: 'PDF Question & Answer', slug: '/pdf-question-answer', description: 'Chat with your PDF and ask questions using AI.', iconName: 'MessageSquareText', iconColor: 'text-violet-500', category: 'ai', isNew: true },
  { id: 'extract-pdf-tables', name: 'Extract PDF Tables', slug: '/extract-pdf-tables', description: 'Intelligently detect and extract tables from PDFs to CSV or Excel.', iconName: 'TableProperties', iconColor: 'text-violet-500', category: 'ai' },
  { id: 'annotate-pdf', name: 'Annotate PDF', slug: '/annotate-pdf', description: 'Add notes, comments, and highlights to your PDF.', iconName: 'Highlighter', iconColor: 'text-purple-500', category: 'edit' },
  { id: 'add-text-pdf', name: 'Add Text to PDF', slug: '/add-text-pdf', description: 'Type new text directly onto your PDF pages.', iconName: 'Type', iconColor: 'text-purple-500', category: 'edit' },
  { id: 'add-image-pdf', name: 'Add Image to PDF', slug: '/add-image-pdf', description: 'Insert images, logos or pictures into your document.', iconName: 'ImagePlus', iconColor: 'text-purple-500', category: 'edit' },
];

export const getToolsByCategory = (category: ToolCategory) => {
  return PDF_TOOLS.filter(tool => tool.category === category);
};
