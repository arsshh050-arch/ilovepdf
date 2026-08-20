export type MergeFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  rotation: 0 | 90 | 180 | 270;
  thumbnailUrl: string | null;
  loadingPreview?: boolean;
};
