import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getResultSession, getLatestSessionForTool } from '../utils/sessionStore';
import { ToolResultLayout } from '../components/results/ToolResultLayout';
import { PDF_TOOLS } from '../config/pdfTools';

export function ToolResultPage() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tool slug from path (e.g. /compress-pdf/result/123 -> compress-pdf)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const toolSlugPart = pathParts[0] || 'merge-pdf';
  const tool = PDF_TOOLS.find((t) => t.slug === `/${toolSlugPart}` || t.id === toolSlugPart);
  const toolId = tool ? tool.id : toolSlugPart;

  // Retrieve session data
  const sessionData = sessionId
    ? getResultSession(sessionId)
    : getLatestSessionForTool(toolId);

  const handleBack = () => {
    navigate(tool ? tool.slug : `/${toolSlugPart}`);
  };

  const handleResetTool = () => {
    navigate(tool ? tool.slug : `/${toolSlugPart}`);
  };

  return (
    <ToolResultLayout
      toolId={toolId}
      sessionId={sessionId || sessionData?.sessionId}
      sessionData={sessionData}
      onBack={handleBack}
      onResetTool={handleResetTool}
    />
  );
}
