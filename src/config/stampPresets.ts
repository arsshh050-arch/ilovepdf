export interface StampPreset {
  id: string;
  label: string;
  category: 'status' | 'approval' | 'security' | 'standard';
  color: string;
  borderStyle: 'solid' | 'dashed' | 'double';
  rotation: number;
}

export const STAMP_PRESETS: StampPreset[] = [
  { id: 'approved', label: 'APPROVED', category: 'approval', color: '#10B981', borderStyle: 'solid', rotation: -5 },
  { id: 'rejected', label: 'REJECTED', category: 'approval', color: '#EF4444', borderStyle: 'solid', rotation: -8 },
  { id: 'reviewed', label: 'REVIEWED', category: 'approval', color: '#3B82F6', borderStyle: 'solid', rotation: 0 },
  { id: 'completed', label: 'COMPLETED', category: 'approval', color: '#059669', borderStyle: 'solid', rotation: 0 },
  { id: 'not_approved', label: 'NOT APPROVED', category: 'approval', color: '#DC2626', borderStyle: 'solid', rotation: -6 },
  
  { id: 'confidential', label: 'CONFIDENTIAL', category: 'security', color: '#DC2626', borderStyle: 'solid', rotation: -12 },
  { id: 'for_public_release', label: 'FOR PUBLIC RELEASE', category: 'security', color: '#2563EB', borderStyle: 'solid', rotation: 0 },
  { id: 'not_for_public_release', label: 'NOT FOR PUBLIC RELEASE', category: 'security', color: '#DC2626', borderStyle: 'solid', rotation: -5 },
  { id: 'departmental', label: 'DEPARTMENTAL', category: 'security', color: '#6366F1', borderStyle: 'solid', rotation: 0 },
  
  { id: 'draft', label: 'DRAFT', category: 'status', color: '#F59E0B', borderStyle: 'dashed', rotation: -10 },
  { id: 'final', label: 'FINAL', category: 'status', color: '#10B981', borderStyle: 'solid', rotation: 0 },
  { id: 'as_is', label: 'AS IS', category: 'status', color: '#6B7280', borderStyle: 'solid', rotation: 0 },
  { id: 'experimental', label: 'EXPERIMENTAL', category: 'status', color: '#8B5CF6', borderStyle: 'dashed', rotation: -4 },
  { id: 'expired', label: 'EXPIRED', category: 'status', color: '#EF4444', borderStyle: 'solid', rotation: -7 },
  { id: 'for_comment', label: 'FOR COMMENT', category: 'status', color: '#0284C7', borderStyle: 'solid', rotation: 0 },
  { id: 'information_only', label: 'INFORMATION ONLY', category: 'status', color: '#64748B', borderStyle: 'solid', rotation: 0 },
  { id: 'preliminary_results', label: 'PRELIMINARY RESULTS', category: 'status', color: '#D97706', borderStyle: 'dashed', rotation: -5 },
  { id: 'sold', label: 'SOLD', category: 'status', color: '#DC2626', borderStyle: 'solid', rotation: -8 },
  { id: 'void', label: 'VOID', category: 'status', color: '#DC2626', borderStyle: 'solid', rotation: -15 },
  
  { id: 'copy', label: 'COPY', category: 'standard', color: '#475569', borderStyle: 'solid', rotation: 0 },
  { id: 'original', label: 'ORIGINAL', category: 'standard', color: '#2563EB', borderStyle: 'solid', rotation: 0 },
  { id: 'paid', label: 'PAID', category: 'standard', color: '#059669', borderStyle: 'solid', rotation: -6 },
  { id: 'urgent', label: 'URGENT', category: 'standard', color: '#E11D48', borderStyle: 'solid', rotation: -8 },
];
