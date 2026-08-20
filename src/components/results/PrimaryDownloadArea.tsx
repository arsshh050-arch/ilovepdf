import React, { useState } from 'react';
import { ArrowLeft, Download, HardDrive, Link as LinkIcon, Box, Trash2, Check, Loader2 } from 'lucide-react';
import { deleteResultSession } from '../../utils/sessionStore';
import { getDriveAccessToken, signInWithGoogleDrive, uploadFileToDrive } from '../../lib/googleDrive';

interface PrimaryDownloadAreaProps {
  downloadUrl: string | null;
  downloadLabel: string;
  filename: string;
  sessionId?: string;
  toolSlug: string;
  onBack: () => void;
  onFileDeleted: () => void;
  onShowToast: (msg: string) => void;
}

export function PrimaryDownloadArea({
  downloadUrl,
  downloadLabel,
  filename,
  sessionId,
  toolSlug,
  onBack,
  onFileDeleted,
  onShowToast,
}: PrimaryDownloadAreaProps) {
  const [downloading, setDownloading] = useState(false);
  const [savingDrive, setSavingDrive] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDownload = () => {
    if (!downloadUrl) return;
    setDownloading(true);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloading(false);
    }, 1200);
  };

  const handleCopyToolLink = () => {
    const fullUrl = `${window.location.origin}${toolSlug}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      onShowToast('Tool link copied to clipboard!');
    }).catch(() => {
      onShowToast('Unable to copy link.');
    });
  };

  const handleDriveSave = async () => {
    if (!downloadUrl) return;

    setSavingDrive(true);
    try {
      let token = getDriveAccessToken();
      if (!token) {
        onShowToast('Signing in to Google Drive...');
        const authRes = await signInWithGoogleDrive();
        token = authRes.accessToken;
      }

      onShowToast('Saving file to your Google Drive...');
      await uploadFileToDrive(downloadUrl, filename, token);
      onShowToast(`Successfully saved '${filename}' to Google Drive!`);
    } catch (err: any) {
      console.error('Save to Google Drive failed:', err);
      onShowToast(err.message || 'Failed to save file to Google Drive.');
    } finally {
      setSavingDrive(false);
    }
  };

  const handleDropboxSave = () => {
    onShowToast('Dropbox integration requires account connection.');
  };

  const handleDeleteNow = async () => {
    if (!sessionId) {
      onFileDeleted();
      return;
    }

    setDeleting(true);
    try {
      await fetch(`/api/session/${sessionId}`, { method: 'DELETE' }).catch(() => {});
      deleteResultSession(sessionId);
      onFileDeleted();
      onShowToast('This file has been permanently deleted.');
    } catch (e) {
      deleteResultSession(sessionId);
      onFileDeleted();
      onShowToast('File deleted.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl">
        
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={onBack}
          className="w-[42px] h-[42px] shrink-0 bg-[#4B4C54] hover:bg-[#272830] text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105"
          title="Back to tool"
          aria-label="Back to tool"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {/* PRIMARY DOWNLOAD BUTTON */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={!downloadUrl || downloading}
          className="flex-1 min-h-[74px] w-full sm:w-auto bg-[#E5322D] hover:bg-[#C92A26] active:bg-[#B0221E] text-white font-bold text-[20px] md:text-[22px] px-8 py-4 rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.12)] hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <Loader2 size={26} className="animate-spin" />
              <span>Preparing download...</span>
            </>
          ) : (
            <>
              <Download size={26} strokeWidth={2.5} />
              <span className="truncate">{downloadLabel}</span>
            </>
          )}
        </button>

        {/* COMPACT ACTION BUTTONS (2x2 Grid or Row) */}
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDriveSave}
            disabled={savingDrive}
            className="w-[38px] h-[38px] md:w-[42px] md:h-[42px] bg-[#E5322D] hover:bg-[#C92A26] text-white rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer hover:scale-105 disabled:opacity-50"
            title="Save to Google Drive"
            aria-label="Save to Google Drive"
          >
            {savingDrive ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <HardDrive size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyToolLink}
            className="w-[38px] h-[38px] md:w-[42px] md:h-[42px] bg-[#E5322D] hover:bg-[#C92A26] text-white rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer hover:scale-105"
            title="Copy secure tool link"
            aria-label="Copy secure tool link"
          >
            <LinkIcon size={18} />
          </button>

          <button
            type="button"
            onClick={handleDropboxSave}
            className="w-[38px] h-[38px] md:w-[42px] md:h-[42px] bg-[#E5322D] hover:bg-[#C92A26] text-white rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer hover:scale-105"
            title="Save to Dropbox"
            aria-label="Save to Dropbox"
          >
            <Box size={18} />
          </button>

          <button
            type="button"
            onClick={handleDeleteNow}
            disabled={deleting}
            className="w-[38px] h-[38px] md:w-[42px] md:h-[42px] bg-[#E5322D] hover:bg-[#C92A26] text-white rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer hover:scale-105 disabled:opacity-50"
            title="Delete file now"
            aria-label="Delete file now"
          >
            {deleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
