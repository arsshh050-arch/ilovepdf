export type SplitMode = 'range' | 'pages' | 'size';

export type RangeMode = 'custom' | 'fixed' | 'smart';

export type ExtractMode = 'all' | 'selected';

export interface SplitRange {
  id: string;
  from: number;
  to: number;
}

export type SizeUnit = 'KB' | 'MB';

export interface PageThumbnailItem {
  pageNumber: number;
  thumbnailUrl: string | null;
  loading: boolean;
}
