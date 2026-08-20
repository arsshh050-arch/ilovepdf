import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RotateCw, Trash2, Eye, GripVertical, FileText } from 'lucide-react';
import { formatFileSize } from '../../utils/pdfPreview';

export interface WorkspaceFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  rotation: number;
  thumbnailUrl: string | null;
  loadingPreview?: boolean;
}

interface DocumentCanvasProps {
  files: WorkspaceFileItem[];
  onReorder: (newFiles: WorkspaceFileItem[]) => void;
  onRotate?: (id: string) => void;
  onRemove: (id: string) => void;
  onPreview?: (file: WorkspaceFileItem) => void;
}

function SortableFileCard({
  fileItem,
  index,
  total,
  onRotate,
  onRemove,
  onPreview
}: {
  key?: string | number;
  fileItem: WorkspaceFileItem;
  index: number;
  total: number;
  onRotate?: (id: string) => void;
  onRemove: (id: string) => void;
  onPreview?: (file: WorkspaceFileItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: fileItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group bg-white border border-[#E8EAEF] hover:border-[#E5322D] rounded-2xl p-3 w-[190px] min-h-[235px] shadow-sm hover:shadow-md transition-all flex flex-col justify-between select-none ${
        isDragging ? 'opacity-30 border-dashed border-[#E5322D]' : ''
      }`}
    >
      {/* DRAG HANDLE & INDEX BADGE */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-[#888A92] bg-[#F4F5F9] px-2 py-0.5 rounded-full">
          #{index + 1}
        </span>

        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-[#9DA0A8] hover:text-[#272830] transition-colors"
          title="Drag to reorder"
        >
          <GripVertical size={16} />
        </div>
      </div>

      {/* THUMBNAIL AREA */}
      <div className="w-full h-[135px] bg-[#FAFBFD] border border-[#EAECEF] rounded-xl flex items-center justify-center overflow-hidden relative group/thumb">
        {fileItem.loadingPreview ? (
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <FileText size={32} className="text-[#C0C3CE]" />
            <span className="text-[11px] text-[#A0A3AE]">Loading preview...</span>
          </div>
        ) : fileItem.thumbnailUrl ? (
          <img
            src={fileItem.thumbnailUrl}
            alt={fileItem.name}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `rotate(${fileItem.rotation}deg)` }}
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-[#888A92]">
            <FileText size={36} />
            <span className="text-[11px] font-medium uppercase">PDF</span>
          </div>
        )}

        {/* HOVER ACTION OVERLAY */}
        <div className="absolute inset-0 bg-[#202126]/60 backdrop-blur-[1px] opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
          {onRotate && (
            <button
              type="button"
              onClick={() => onRotate(fileItem.id)}
              className="w-8 h-8 rounded-full bg-white text-[#272830] hover:text-[#E5322D] flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
              title="Rotate 90° clockwise"
            >
              <RotateCw size={15} />
            </button>
          )}

          {onPreview && (
            <button
              type="button"
              onClick={() => onPreview(fileItem)}
              className="w-8 h-8 rounded-full bg-white text-[#272830] hover:text-[#1A73E8] flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
              title="Preview document"
            >
              <Eye size={15} />
            </button>
          )}

          <button
            type="button"
            onClick={() => onRemove(fileItem.id)}
            className="w-8 h-8 rounded-full bg-white text-[#272830] hover:text-[#E5322D] flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
            title="Remove file"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* FILE INFO */}
      <div className="mt-2.5">
        <p className="text-[12px] font-semibold text-[#272830] truncate" title={fileItem.name}>
          {fileItem.name}
        </p>
        <div className="flex items-center justify-between text-[11px] text-[#737680] mt-0.5">
          <span>{fileItem.pageCount > 0 ? `${fileItem.pageCount} page${fileItem.pageCount > 1 ? 's' : ''}` : ''}</span>
          <span>{formatFileSize(fileItem.size)}</span>
        </div>
      </div>
    </div>
  );
}

export function DocumentCanvas({
  files,
  onReorder,
  onRotate,
  onRemove,
  onPreview
}: DocumentCanvasProps) {
  const [activeDragId, setActiveDragId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && active.id !== over.id) {
      const oldIdx = files.findIndex(f => f.id === active.id);
      const newIdx = files.findIndex(f => f.id === over.id);
      onReorder(arrayMove(files, oldIdx, newIdx));
    }
  };

  const activeCard = files.find(f => f.id === activeDragId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveDragId(String(e.active.id))}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={files.map(f => f.id)} strategy={rectSortingStrategy}>
        <div className="flex flex-wrap gap-5 justify-center md:justify-start items-start pt-2 pb-24">
          {files.map((file, idx) => (
            <SortableFileCard
              key={file.id}
              fileItem={file}
              index={idx}
              total={files.length}
              onRotate={onRotate}
              onRemove={onRemove}
              onPreview={onPreview}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeCard ? (
          <div className="bg-white border-2 border-[#E5322D] rounded-2xl p-3 w-[190px] min-h-[235px] shadow-2xl opacity-90 scale-[1.03] flex flex-col justify-between">
            <div className="w-full h-[135px] bg-[#FAFBFD] border border-[#E8EAEF] rounded-xl flex items-center justify-center overflow-hidden">
              {activeCard.thumbnailUrl ? (
                <img
                  src={activeCard.thumbnailUrl}
                  alt={activeCard.name}
                  className="max-w-full max-h-full object-contain"
                  style={{ transform: `rotate(${activeCard.rotation}deg)` }}
                />
              ) : (
                <span className="text-xs text-[#888]">PDF</span>
              )}
            </div>
            <p className="text-[12px] font-semibold text-[#272830] truncate mt-2">
              {activeCard.name}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
