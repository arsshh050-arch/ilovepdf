export interface PdfTool {
  id: string;
  title: string;
  description: string;
  iconName: string;
  path: string;
  category: 'core' | 'convert_to' | 'convert_from' | 'edit' | 'security' | 'advanced';
}

export interface FileWithPreview extends File {
  preview?: string;
  id: string;
}

export type ProcessingState = 'idle' | 'uploading' | 'processing' | 'success' | 'error';
