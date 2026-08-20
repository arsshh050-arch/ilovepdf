import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  FileText,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  Layers,
} from 'lucide-react';
import {
  signInWithGoogleDrive,
  getDriveAccessToken,
  listDrivePdfFiles,
  downloadFileFromDrive,
  signOutGoogleDrive,
  DriveFileItem,
  auth,
} from '../../lib/googleDrive';
import { launchGooglePicker } from '../../lib/googlePicker';
import { User } from 'firebase/auth';

interface GoogleDrivePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  multiSelect?: boolean;
}

export function GoogleDrivePickerModal({
  isOpen,
  onClose,
  onFilesSelected,
  title = 'Import from Google Drive',
  multiSelect = true,
}: GoogleDrivePickerModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [token, setToken] = useState<string | null>(getDriveAccessToken());
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Drive files when modal opens or token changes
  useEffect(() => {
    if (isOpen && token) {
      loadFiles(token);
    }
  }, [isOpen, token]);

  const loadFiles = async (accessToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const files = await listDrivePdfFiles(accessToken);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Failed to list Drive files:', err);
      setError(err.message || 'Failed to load files from Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchPicker = async () => {
    setError(null);
    setPickerLoading(true);

    try {
      let activeToken = token;
      if (!activeToken) {
        const res = await signInWithGoogleDrive();
        setCurrentUser(res.user);
        setToken(res.accessToken);
        activeToken = res.accessToken;
      }

      await launchGooglePicker({
        accessToken: activeToken,
        multiSelect,
        onSelect: async (pickedDocs) => {
          if (pickedDocs.length === 0) return;
          setDownloading(true);
          try {
            const downloadedFiles: File[] = [];
            for (const doc of pickedDocs) {
              const fileObj = await downloadFileFromDrive(doc.id, doc.name, activeToken!);
              downloadedFiles.push(fileObj);
            }
            onFilesSelected(downloadedFiles);
            onClose();
          } catch (dlErr: any) {
            console.error('Download picked file error:', dlErr);
            setError(dlErr.message || 'Failed to download selected file(s) from Google Drive.');
          } finally {
            setDownloading(false);
          }
        },
        onError: (err) => {
          console.error('Google Picker error:', err);
          setError('Could not open Google Picker dialog. You can select files directly below.');
        },
      });
    } catch (err: any) {
      console.error('Launch Google Picker failed:', err);
      setError(err.message || 'Failed to open Google Picker.');
    } finally {
      setPickerLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithGoogleDrive();
      setCurrentUser(res.user);
      setToken(res.accessToken);
      await loadFiles(res.accessToken);
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setError(err.message || 'Google Drive authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogleDrive();
    setCurrentUser(null);
    setToken(null);
    setDriveFiles([]);
    setSelectedFileIds([]);
  };

  const toggleFileSelect = (fileId: string) => {
    if (!multiSelect) {
      setSelectedFileIds([fileId]);
      return;
    }

    if (selectedFileIds.includes(fileId)) {
      setSelectedFileIds(selectedFileIds.filter((id) => id !== fileId));
    } else {
      setSelectedFileIds([...selectedFileIds, fileId]);
    }
  };

  const handleImport = async () => {
    if (!token || selectedFileIds.length === 0) return;

    setDownloading(true);
    setError(null);

    try {
      const selectedItems = driveFiles.filter((f) => selectedFileIds.includes(f.id));
      const downloadedFiles: File[] = [];

      for (const item of selectedItems) {
        const fileObj = await downloadFileFromDrive(item.id, item.name, token);
        downloadedFiles.push(fileObj);
      }

      onFilesSelected(downloadedFiles);
      onClose();
      setSelectedFileIds([]);
    } catch (err: any) {
      console.error('Import failed:', err);
      setError(err.message || 'Failed to download selected file(s) from Google Drive.');
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  const filteredFiles = driveFiles.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E5322D] flex items-center justify-center font-bold">
              <HardDrive size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-500">Access your cloud PDF files directly</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-2 text-red-800 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5 font-medium">
                <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
              {error.includes('authorized') && (
                <div className="ml-7 mt-1 p-2.5 bg-white/80 border border-red-200 rounded-lg text-gray-700 text-xs space-y-1">
                  <p className="font-semibold text-gray-900">How to authorize your custom domain:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-gray-600">
                    <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">Firebase Console</a> &gt; Authentication &gt; Settings &gt; Authorized Domains.</li>
                    <li>Add domain: <code className="bg-gray-100 px-1 py-0.5 rounded text-red-700 font-mono">{window.location.hostname}</code></li>
                    <li>In Google Cloud Console, add <code className="bg-gray-100 px-1 py-0.5 rounded text-red-700 font-mono">https://{window.location.hostname}</code> to Authorized JavaScript Origins.</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {!token ? (
            /* NOT SIGNED IN STATE */
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#E5322D] flex items-center justify-center mb-4 shadow-sm">
                <HardDrive size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Connect to Google Drive</h4>
              <p className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
                Sign in with your Google Account to pick PDF files directly from your Google Drive and import them into iLovePDF.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={loading || pickerLoading}
                  className="gsi-material-button flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin text-[#E5322D]" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleLaunchPicker}
                  disabled={loading || pickerLoading}
                  className="flex items-center justify-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto text-sm"
                >
                  {pickerLoading ? (
                    <Loader2 size={18} className="animate-spin text-white" />
                  ) : (
                    <Layers size={18} />
                  )}
                  <span>Launch Google Picker</span>
                </button>
              </div>
            </div>
          ) : (
            /* SIGNED IN STATE & FILE EXPLORER */
            <div className="flex flex-col gap-4">
              
              {/* ACCOUNT BAR */}
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-8 h-8 rounded-full border border-gray-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#E5322D] text-white flex items-center justify-center text-xs font-bold">
                      {currentUser?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-gray-900">{currentUser?.displayName || 'Google Account'}</div>
                    <div className="text-[11px] text-gray-500">{currentUser?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLaunchPicker}
                    disabled={pickerLoading || downloading}
                    className="text-xs font-semibold text-[#1A73E8] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    title="Launch native Google Picker dialog"
                  >
                    {pickerLoading ? (
                      <Loader2 size={14} className="animate-spin text-[#1A73E8]" />
                    ) : (
                      <Layers size={14} />
                    )}
                    <span>Google Picker UI</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search PDF files in Google Drive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E5322D]/20 focus:border-[#E5322D] transition-all"
                />
              </div>

              {/* FILE LIST */}
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center text-gray-400">
                  <Loader2 size={28} className="animate-spin text-[#E5322D] mb-2" />
                  <span className="text-sm font-medium">Scanning Google Drive for PDFs...</span>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center text-gray-500">
                  <FileText size={36} className="text-gray-300 mb-2" />
                  <p className="text-sm font-medium">No PDF files found in your Google Drive.</p>
                  <p className="text-xs text-gray-400 mt-1">Upload a PDF to Google Drive or try another query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {filteredFiles.map((f) => {
                    const isSelected = selectedFileIds.includes(f.id);
                    return (
                      <div
                        key={f.id}
                        onClick={() => toggleFileSelect(f.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-red-50/60 border-[#E5322D] shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#E5322D] text-white' : 'bg-red-100 text-[#E5322D]'
                          }`}>
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-gray-900 truncate">{f.name}</div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {f.size ? `${(parseInt(f.size) / (1024 * 1024)).toFixed(2)} MB` : 'PDF Document'}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <CheckCircle2 size={18} className="text-[#E5322D]" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        {token && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              {selectedFileIds.length} file{selectedFileIds.length === 1 ? '' : 's'} selected
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleImport}
                disabled={selectedFileIds.length === 0 || downloading}
                className="px-5 py-2 bg-[#E5322D] hover:bg-[#C92A26] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <span>Import {selectedFileIds.length > 0 ? `(${selectedFileIds.length})` : ''}</span>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
