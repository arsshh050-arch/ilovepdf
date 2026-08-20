export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Merge' | 'Split' | 'Compress' | 'Convert' | 'Edit' | 'Security' | 'OCR' | 'AI' | 'Privacy' | 'Troubleshooting' | string;
  relatedTool?: string;
}

