import React from 'react';
import { Share2, MessageCircle, Link as LinkIcon, Heart, Globe } from 'lucide-react';

interface ShareSectionProps {
  toolSlug: string;
  toolName: string;
  onShowToast: (msg: string) => void;
}

export function ShareSection({ toolSlug, toolName, onShowToast }: ShareSectionProps) {
  const shareUrl = `https://ilovepdf.in${toolSlug}`;
  const shareText = encodeURIComponent(`I just used ${toolName} on ilovepdf.in - fast, free, and secure PDF tools!`);

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedinShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsappShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      onShowToast('Tool link copied to clipboard!');
    }).catch(() => {
      onShowToast('Unable to copy link.');
    });
  };

  return (
    <div className="w-full max-w-2xl text-center mt-10 mb-4 flex flex-col items-center">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[#E5322D] uppercase tracking-wider mb-1">
        <Heart size={14} fill="#E5322D" />
        <span>Enjoying ilovepdf.in?</span>
      </div>

      <p className="text-sm text-[#525560] mb-4">
        Share this tool with others who may find it useful.
      </p>

      {/* SHARE BUTTONS */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleTwitterShare}
          className="p-2.5 bg-white hover:bg-gray-100 border border-[#D0D5E2] rounded-full text-[#1DA1F2] transition-all hover:scale-105 shadow-2xs"
          title="Share on X (Twitter)"
          aria-label="Share on X (Twitter)"
        >
          <Share2 size={18} />
        </button>

        <button
          type="button"
          onClick={handleLinkedinShare}
          className="p-2.5 bg-white hover:bg-gray-100 border border-[#D0D5E2] rounded-full text-[#0A66C2] transition-all hover:scale-105 shadow-2xs"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <Globe size={18} />
        </button>

        <button
          type="button"
          onClick={handleWhatsappShare}
          className="p-2.5 bg-white hover:bg-gray-100 border border-[#D0D5E2] rounded-full text-[#25D366] transition-all hover:scale-105 shadow-2xs"
          title="Share on WhatsApp"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle size={18} />
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="p-2.5 bg-white hover:bg-gray-100 border border-[#D0D5E2] rounded-full text-[#272830] transition-all hover:scale-105 shadow-2xs"
          title="Copy tool link"
          aria-label="Copy tool link"
        >
          <LinkIcon size={18} />
        </button>
      </div>
    </div>
  );
}
