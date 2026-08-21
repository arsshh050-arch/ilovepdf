import React, { useState, Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { Uploader } from '../components/Uploader';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ToolSeoSection } from '../components/seo/ToolSeoSection';
import { getToolSeoData } from '../content/seo/toolsSeo';
import { getToolConfig } from '../config/toolConfigurations';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import { Loader2 } from 'lucide-react';

const ToolWorkspace = lazyWithRetry(() =>
  import('../components/workspace/ToolWorkspace').then((m) => ({ default: m.ToolWorkspace }))
);
const PdfEditorMain = lazyWithRetry(() =>
  import('../components/editor/PdfEditorMain').then((m) => ({ default: m.PdfEditorMain }))
);
const SplitPdfWorkspace = lazyWithRetry(() =>
  import('../components/split/SplitPdfWorkspace').then((m) => ({ default: m.SplitPdfWorkspace }))
);

const EDITOR_TOOL_IDS = [
  'edit-pdf',
  'annotate-pdf',
  'sign-pdf',
  'pdf-forms',
];

export function UniversalToolPage() {
  const [initialFiles, setInitialFiles] = useState<File[]>([]);
  const location = useLocation();
  const path = location.pathname;

  const toolConfig = getToolConfig(path);
  const seoData = getToolSeoData(path, toolConfig.title, toolConfig.description);

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setInitialFiles(acceptedFiles);
  };

  const handleResetAll = () => {
    setInitialFiles([]);
  };

  // POST-UPLOAD WORKSPACE VIEW (If user has uploaded files)
  if (initialFiles.length > 0) {
    if (toolConfig.id === 'split-pdf') {
      return (
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
              <Loader2 className="w-8 h-8 text-[#E5322D] animate-spin" />
              <p className="text-sm font-medium text-[#5B5E6B]">Opening Split PDF Tool...</p>
            </div>
          }
        >
          <SplitPdfWorkspace
            file={initialFiles[0]}
            onReset={handleResetAll}
          />
        </Suspense>
      );
    }

    if (EDITOR_TOOL_IDS.includes(toolConfig.id)) {
      return (
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
              <Loader2 className="w-8 h-8 text-[#E5322D] animate-spin" />
              <p className="text-sm font-medium text-[#5B5E6B]">Opening PDF Editor...</p>
            </div>
          }
        >
          <PdfEditorMain
            file={initialFiles[0]}
            onExit={handleResetAll}
          />
        </Suspense>
      );
    }

    return (
      <main className="bg-[#F6F6FB] min-h-screen">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
              <Loader2 className="w-8 h-8 text-[#E5322D] animate-spin" />
              <p className="text-sm font-medium text-[#5B5E6B]">Loading Tool Workspace...</p>
            </div>
          }
        >
          <ToolWorkspace
            toolId={toolConfig.id}
            initialFiles={initialFiles}
            onResetAll={handleResetAll}
          />
        </Suspense>
      </main>
    );
  }

  // PRE-UPLOAD LANDING HERO VIEW (0 Files Uploaded)
  return (
    <main className="bg-[#F7F8FC] min-h-screen">
      <div className="pt-8 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: 'PDF Tools', path: '/pdf-tools' },
              { label: seoData.name || toolConfig.title, path: toolConfig.slug }
            ]}
          />

          <div className="text-center mb-10">
            <h1 className="text-[32px] md:text-[42px] font-bold text-[#272830] mb-3 leading-tight tracking-tight">
              {seoData.h1 || toolConfig.title}
            </h1>
            <p className="text-base md:text-lg text-[#686B74] max-w-2xl mx-auto leading-relaxed">
              {seoData.intro || toolConfig.description}
            </p>
          </div>

          <Uploader
            onFilesAccepted={handleFilesAccepted}
            acceptedTypes={toolConfig.acceptedFileTypes}
            multiple={toolConfig.multiple}
            className="min-h-[350px] md:min-h-[400px] shadow-xs bg-white border border-[#E8EAEF] rounded-3xl"
          />
        </div>
      </div>

      {/* SUPPORTING SEO CONTENT BELOW HERO */}
      <ToolSeoSection slug={toolConfig.slug} fallbackName={toolConfig.title} fallbackDesc={toolConfig.description} />
    </main>
  );
}
