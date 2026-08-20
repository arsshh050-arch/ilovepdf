import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { getToolResultConfig } from '../../config/toolResults';
import { ResultSessionData } from '../../utils/sessionStore';
import { PrimaryDownloadArea } from './PrimaryDownloadArea';
import { ResultSummary } from './ResultSummary';
import { RelatedToolsGrid } from './RelatedToolsGrid';
import { ResultInfoBar } from './ResultInfoBar';
import { ShareSection } from './ShareSection';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ToolResultLayoutProps {
  toolId: string;
  sessionId?: string;
  sessionData: ResultSessionData | null;
  onBack?: () => void;
  onResetTool?: () => void;
}

export function ToolResultLayout({
  toolId,
  sessionId,
  sessionData,
  onBack,
  onResetTool,
}: ToolResultLayoutProps) {
  const navigate = useNavigate();
  const config = getToolResultConfig(toolId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(sessionData?.isDeleted || false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(config.slug);
    }
  };

  const handleProcessAnother = () => {
    if (onResetTool) {
      onResetTool();
    } else {
      navigate(config.slug);
    }
  };

  const canonicalUrl = `https://ilovepdf.in${config.slug}`;

  // EXPIRED OR DELETED FILE STATE
  if (!sessionData || isDeleted || !sessionData.downloadUrl) {
    return (
      <div className="min-h-screen bg-[#F7F7FC] flex flex-col items-center justify-center p-6 text-center">
        <Helmet>
          <title>{`${config.name} Result | iLovePDF.in`}</title>
          <meta name="robots" content="noindex,nofollow" />
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>

        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-5 shadow-sm">
          <AlertCircle size={32} />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#272830] mb-3">
          This download has expired or was deleted
        </h1>

        <p className="text-[#686B74] max-w-md mb-8 text-sm md:text-base leading-relaxed">
          For privacy and storage security, processed files are stored temporarily. Please upload and process your file again.
        </p>

        <button
          type="button"
          onClick={handleProcessAnother}
          className="px-8 py-3.5 bg-[#E5322D] hover:bg-[#C92A26] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
        >
          <RefreshCw size={18} />
          <span>Process another file</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7FC]">
      <Helmet>
        <title>{`${config.name} Result | iLovePDF.in`}</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#202126] text-white text-sm py-2.5 px-5 rounded-full shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MAIN CONTAINER: MAX-WIDTH 900px, CENTERED */}
      <div className="max-w-[900px] mx-auto pt-[28px] px-[20px] pb-[60px] flex flex-col items-center">
        
        {/* RESULT SUCCESS HEADING */}
        <h1 className="text-[24px] md:text-[28px] lg:text-[30px] font-semibold text-[#272830] text-center mb-[24px]">
          {config.successTitle}
        </h1>

        {/* PRIMARY DOWNLOAD AREA */}
        <PrimaryDownloadArea
          downloadUrl={sessionData.downloadUrl}
          downloadLabel={config.downloadLabel}
          filename={sessionData.filename}
          sessionId={sessionId || sessionData.sessionId}
          toolSlug={config.slug}
          onBack={handleBack}
          onFileDeleted={() => setIsDeleted(true)}
          onShowToast={showToast}
        />

        {/* TOOL-SPECIFIC RESULT SUMMARY */}
        <ResultSummary toolId={toolId} sessionData={sessionData} />

        {/* CONTINUE TO RELATED TOOLS */}
        <RelatedToolsGrid relatedToolIds={config.relatedToolIds} />

        {/* OPTIONAL INFO / PRODUCTIVITY BAR */}
        <ResultInfoBar />

        {/* SHARE / FEEDBACK SECTION */}
        <ShareSection
          toolSlug={config.slug}
          toolName={config.name}
          onShowToast={showToast}
        />

      </div>
    </div>
  );
}
