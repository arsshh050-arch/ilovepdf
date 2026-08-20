import React, { useState } from 'react';
import {
  Layers,
  FileText,
  Bookmark as BookmarkIcon,
  MessageSquare,
  Paperclip,
  PenTool,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Download,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  Upload,
} from 'lucide-react';
import {
  PageInfo,
  EditorObject,
  PdfBookmark,
  PdfAttachment,
  StickyNoteObject,
} from '../../types/pdfEditor';

interface EditorLeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  pages: PageInfo[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onRotatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onReorderPages: (fromIndex: number, toIndex: number) => void;
  onOpenInsertPageModal: () => void;
  // Objects / Layers
  objects: EditorObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  onToggleObjectVisibility: (id: string) => void;
  onToggleObjectLock: (id: string) => void;
  onDeleteObject: (id: string) => void;
  onReorderObjectLayer: (id: string, direction: 'up' | 'down') => void;
  // Bookmarks
  bookmarks: PdfBookmark[];
  onAddBookmark: (title: string, pageNumber: number) => void;
  onDeleteBookmark: (id: string) => void;
  // Attachments
  attachments: PdfAttachment[];
  onAddAttachment: (file: File) => void;
  onDeleteAttachment: (id: string) => void;
  // Signatures library
  savedSignatures: Array<{ id: string; dataUrl: string; type: string; label: string }>;
  onPlaceSavedSignature: (dataUrl: string, sigType: any) => void;
  onOpenSignatureModal: () => void;
  // Comments
  onToggleCommentStatus: (id: string) => void;
}

type SidebarTab = 'thumbnails' | 'bookmarks' | 'layers' | 'signatures' | 'attachments' | 'comments';

export function EditorLeftSidebar({
  isOpen,
  onToggle,
  pages,
  currentPageIndex,
  onSelectPage,
  onRotatePage,
  onDeletePage,
  onReorderPages,
  onOpenInsertPageModal,
  objects,
  selectedObjectId,
  onSelectObject,
  onToggleObjectVisibility,
  onToggleObjectLock,
  onDeleteObject,
  onReorderObjectLayer,
  bookmarks,
  onAddBookmark,
  onDeleteBookmark,
  attachments,
  onAddAttachment,
  onDeleteAttachment,
  savedSignatures,
  onPlaceSavedSignature,
  onOpenSignatureModal,
  onToggleCommentStatus,
}: EditorLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('thumbnails');
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
  const [draggedPageIndex, setDraggedPageIndex] = useState<number | null>(null);

  // Drag & drop page reorder handlers
  const handleDragStart = (idx: number) => {
    setDraggedPageIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedPageIndex !== null && draggedPageIndex !== targetIdx) {
      onReorderPages(draggedPageIndex, targetIdx);
    }
    setDraggedPageIndex(null);
  };

  // Attachment file upload handler
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddAttachment(file);
    }
  };

  // Comments / sticky notes list
  const commentsList = objects.filter((o) => o.type === 'comment') as StickyNoteObject[];

  return (
    <aside
      className={`h-full bg-white border-r border-[#E8EAEF] flex transition-all duration-200 z-20 shrink-0 select-none ${
        isOpen ? 'w-72' : 'w-12'
      }`}
    >
      {/* VERTICAL ICON NAV BAR */}
      <div className="w-12 border-r border-[#E8EAEF] flex flex-col items-center py-2 gap-1 bg-[#FAFBFD] shrink-0">
        <button
          onClick={() => {
            if (!isOpen) onToggle();
            setActiveTab('thumbnails');
          }}
          className={`p-2.5 rounded-xl transition-colors ${
            activeTab === 'thumbnails' && isOpen ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-200/60'
          }`}
          title="Pages & Thumbnails"
        >
          <FileText size={18} />
        </button>

        <button
          onClick={() => {
            if (!isOpen) onToggle();
            setActiveTab('bookmarks');
          }}
          className={`p-2.5 rounded-xl transition-colors ${
            activeTab === 'bookmarks' && isOpen ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-200/60'
          }`}
          title="Bookmarks & Outline"
        >
          <BookmarkIcon size={18} />
        </button>

        <button
          onClick={() => {
            if (!isOpen) onToggle();
            setActiveTab('layers');
          }}
          className={`p-2.5 rounded-xl transition-colors relative ${
            activeTab === 'layers' && isOpen ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-200/60'
          }`}
          title="Layers & Objects"
        >
          <Layers size={18} />
          {objects.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#E5322D] rounded-full" />
          )}
        </button>

        <button
          onClick={() => {
            if (!isOpen) onToggle();
            setActiveTab('signatures');
          }}
          className={`p-2.5 rounded-xl transition-colors ${
            activeTab === 'signatures' && isOpen ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-200/60'
          }`}
          title="Saved Signatures"
        >
          <PenTool size={18} />
        </button>

        <button
          onClick={() => {
            if (!isOpen) onToggle();
            setActiveTab('attachments');
          }}
          className={`p-2.5 rounded-xl transition-colors relative ${
            activeTab === 'attachments' && isOpen ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-200/60'
          }`}
          title="File Attachments"
        >
          <Paperclip size={18} />
          {attachments.length > 0 && (
            <span className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] font-bold px-1 rounded-full">
              {attachments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            if (!isOpen) onToggle();
            setActiveTab('comments');
          }}
          className={`p-2.5 rounded-xl transition-colors relative ${
            activeTab === 'comments' && isOpen ? 'bg-[#FFF0EE] text-[#E5322D]' : 'text-gray-600 hover:bg-gray-200/60'
          }`}
          title="Comments & Annotations"
        >
          <MessageSquare size={18} />
          {commentsList.length > 0 && (
            <span className="absolute top-1 right-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-full">
              {commentsList.length}
            </span>
          )}
        </button>

        <div className="flex-1" />

        {/* SIDEBAR TOGGLE */}
        <button
          onClick={onToggle}
          className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-200/60 transition-colors"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* EXPANDED CONTENT PANEL */}
      {isOpen && (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
          {/* TAB 1: THUMBNAILS */}
          {activeTab === 'thumbnails' && (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-[#E8EAEF] flex items-center justify-between bg-[#FAFBFD]">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
                  <FileText size={14} className="text-[#E5322D]" />
                  <span>Pages ({pages.length})</span>
                </div>
                <button
                  onClick={onOpenInsertPageModal}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#E5322D] hover:bg-[#FFF0EE] px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Insert blank page"
                >
                  <Plus size={13} />
                  <span>Add Page</span>
                </button>
              </div>

              {/* THUMBNAIL LIST */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {pages.map((p, idx) => {
                  const isCurrent = currentPageIndex === idx;
                  const pageObjectsCount = objects.filter((o) => o.pageIndex === idx).length;

                  return (
                    <div
                      key={p.id || `page_${p.originalIndex}_${idx}`}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={(e) => handleDragOver(e, idx)}
                      onDrop={(e) => handleDrop(e, idx)}
                      onClick={() => onSelectPage(idx)}
                      className={`group relative p-2.5 rounded-xl border-2 transition-all cursor-pointer bg-white ${
                        isCurrent
                          ? 'border-[#E5322D] shadow-md ring-2 ring-[#E5322D]/10'
                          : 'border-[#E8EAEF] hover:border-gray-300 shadow-2xs'
                      }`}
                    >
                      {/* TOP BADGE */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          Page {idx + 1}
                        </span>

                        {/* PAGE ACTIONS (ROTATE, DELETE) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRotatePage(idx);
                            }}
                            className="p-1 text-gray-500 hover:text-[#E5322D] hover:bg-gray-100 rounded-md"
                            title="Rotate 90° Clockwise"
                          >
                            <RotateCw size={13} />
                          </button>
                          {pages.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeletePage(idx);
                              }}
                              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                              title="Delete Page"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* THUMBNAIL CANVAS/IMAGE */}
                      <div className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                        {p.thumbnailUrl ? (
                          <img
                            src={p.thumbnailUrl}
                            alt={`Page ${idx + 1}`}
                            className="w-full h-full object-contain pointer-events-none"
                            style={{
                              transform: p.rotation ? `rotate(${p.rotation}deg)` : undefined,
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-gray-400 text-xs">
                            <FileText size={20} />
                            <span>Blank</span>
                          </div>
                        )}

                        {/* EDITED OBJECTS BADGE */}
                        {pageObjectsCount > 0 && (
                          <div className="absolute bottom-1.5 right-1.5 bg-[#E5322D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            {pageObjectsCount} edits
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-[#E8EAEF] bg-[#FAFBFD]">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800 mb-2">
                  <BookmarkIcon size={14} className="text-[#E5322D]" />
                  <span>Document Bookmarks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newBookmarkTitle}
                    onChange={(e) => setNewBookmarkTitle(e.target.value)}
                    placeholder="New bookmark title..."
                    className="flex-1 px-2.5 py-1 text-xs border border-[#E8EAEF] rounded-lg outline-hidden focus:border-[#E5322D]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newBookmarkTitle.trim()) {
                        onAddBookmark(newBookmarkTitle.trim(), currentPageIndex + 1);
                        setNewBookmarkTitle('');
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newBookmarkTitle.trim()) {
                        onAddBookmark(newBookmarkTitle.trim(), currentPageIndex + 1);
                        setNewBookmarkTitle('');
                      }
                    }}
                    disabled={!newBookmarkTitle.trim()}
                    className="p-1 bg-[#E5322D] text-white rounded-lg disabled:opacity-40"
                    title="Add Bookmark at Current Page"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-1.5">
                {bookmarks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400">
                    No bookmarks in this document. Type a title above to bookmark Page {currentPageIndex + 1}.
                  </div>
                ) : (
                  bookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      onClick={() => onSelectPage(bm.pageNumber - 1)}
                      className="group flex items-center justify-between p-2 rounded-xl border border-[#E8EAEF] hover:border-[#E5322D] hover:bg-[#FFF0EE]/30 transition-all cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <BookmarkIcon size={13} className="text-[#E5322D] shrink-0" />
                        <span className="font-semibold text-gray-800 truncate">{bm.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-gray-500 font-medium">p.{bm.pageNumber}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteBookmark(bm.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-0.5"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LAYERS & OBJECTS */}
          {activeTab === 'layers' && (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-[#E8EAEF] bg-[#FAFBFD] flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
                  <Layers size={14} className="text-[#E5322D]" />
                  <span>Objects Layer ({objects.length})</span>
                </div>
                <span className="text-[10px] text-gray-400">Z-Order & Visibility</span>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-1.5">
                {objects.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400">
                    No editor objects added yet. Draw, add text, shapes, or stamps to view layers.
                  </div>
                ) : (
                  [...objects].reverse().map((obj) => {
                    const isSelected = selectedObjectId === obj.id;
                    let label = obj.type.toUpperCase();
                    if (obj.type === 'text') label = `Text: "${(obj as any).text?.slice(0, 14) || '...'}"`;
                    if (obj.type === 'shape') label = `Shape: ${(obj as any).shapeType}`;
                    if (obj.type === 'stamp') label = `Stamp: ${(obj as any).label || (obj as any).stampType}`;
                    if (obj.type === 'signature') label = `Signature`;
                    if (obj.type === 'annotation') label = `Annotation (${(obj as any).annotationType})`;

                    return (
                      <div
                        key={obj.id}
                        onClick={() => onSelectObject(obj.id)}
                        className={`group flex items-center justify-between p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#E5322D] bg-[#FFF0EE] font-bold text-[#E5322D]'
                            : 'border-[#E8EAEF] bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[9px] px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">
                            P{obj.pageIndex + 1}
                          </span>
                          <span className="truncate">{label}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Z-ORDER CONTROLS */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReorderObjectLayer(obj.id, 'up');
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700"
                            title="Bring forward"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onReorderObjectLayer(obj.id, 'down');
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700"
                            title="Send backward"
                          >
                            <ArrowDown size={11} />
                          </button>

                          {/* LOCK TOGGLE */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleObjectLock(obj.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700"
                            title={obj.locked ? 'Unlock object' : 'Lock object'}
                          >
                            {obj.locked ? <Lock size={12} className="text-amber-500" /> : <Unlock size={12} />}
                          </button>

                          {/* VISIBILITY TOGGLE */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleObjectVisibility(obj.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700"
                            title={obj.visible === false ? 'Show' : 'Hide'}
                          >
                            {obj.visible === false ? <EyeOff size={12} className="text-gray-400" /> : <Eye size={12} />}
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteObject(obj.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete object"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SAVED SIGNATURES */}
          {activeTab === 'signatures' && (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-[#E8EAEF] bg-[#FAFBFD] flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
                  <PenTool size={14} className="text-[#E5322D]" />
                  <span>Saved Signatures</span>
                </div>
                <button
                  onClick={onOpenSignatureModal}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#E5322D] hover:underline cursor-pointer"
                >
                  <Plus size={13} />
                  New
                </button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {savedSignatures.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400">
                    <PenTool size={28} className="mx-auto mb-2 opacity-30" />
                    No saved signatures. Click "+ New" above to create typed or drawn signatures for 1-click placing.
                  </div>
                ) : (
                  savedSignatures.map((sig) => (
                    <div
                      key={sig.id}
                      onClick={() => onPlaceSavedSignature(sig.dataUrl, sig.type)}
                      className="group p-3 rounded-xl border border-[#E8EAEF] hover:border-[#E5322D] hover:bg-[#FFF0EE]/20 transition-all cursor-pointer bg-white"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{sig.label}</span>
                        <span className="text-[10px] text-[#E5322D] font-bold opacity-0 group-hover:opacity-100">
                          Click to Place ✍️
                        </span>
                      </div>
                      <div className="h-16 flex items-center justify-center bg-gray-50/70 rounded-lg p-2">
                        <img src={sig.dataUrl} alt={sig.label} className="max-h-full max-w-full object-contain" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ATTACHMENTS */}
          {activeTab === 'attachments' && (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-[#E8EAEF] bg-[#FAFBFD] flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
                  <Paperclip size={14} className="text-[#E5322D]" />
                  <span>Attachments ({attachments.length})</span>
                </div>
                <label className="flex items-center gap-1 text-[11px] font-bold text-[#E5322D] hover:underline cursor-pointer">
                  <Plus size={13} />
                  Add File
                  <input type="file" onChange={handleAttachmentUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {attachments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400">
                    <Paperclip size={28} className="mx-auto mb-2 opacity-30" />
                    No files attached. You can attach PDFs, spreadsheets, or documents directly into this PDF file.
                  </div>
                ) : (
                  attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#E8EAEF] bg-white text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip size={14} className="text-gray-500 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-gray-800 truncate">{att.name}</p>
                          <p className="text-[10px] text-gray-400">{(att.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onDeleteAttachment(att.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Remove attachment"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: COMMENTS */}
          {activeTab === 'comments' && (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-[#E8EAEF] bg-[#FAFBFD] flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-800">
                  <MessageSquare size={14} className="text-[#E5322D]" />
                  <span>Comments ({commentsList.length})</span>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                {commentsList.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400">
                    <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
                    No comments. Use the Sticky Note tool in Annotate mode to place notes on any page.
                  </div>
                ) : (
                  commentsList.map((comm) => (
                    <div
                      key={comm.id}
                      onClick={() => {
                        onSelectPage(comm.pageIndex);
                        onSelectObject(comm.id);
                      }}
                      className="p-3 rounded-xl border border-[#E8EAEF] hover:border-[#E5322D] bg-white transition-all cursor-pointer text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{comm.author || 'Reviewer'}</span>
                        <span className="text-[10px] text-gray-400">P.{comm.pageIndex + 1}</span>
                      </div>
                      <p className="text-gray-700 text-xs">{comm.text || 'Empty note...'}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <span className="text-[10px] text-gray-400">{comm.date}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCommentStatus(comm.id);
                          }}
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            comm.status === 'resolved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          <CheckCircle2 size={10} />
                          {comm.status === 'resolved' ? 'Resolved' : 'Open'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
