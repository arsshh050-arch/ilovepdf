import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Merge, 
  Split, 
  Minimize2, 
  Lock, 
  Unlock, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  RotateCw, 
  Stamp, 
  EyeOff, 
  Edit3, 
  Search, 
  Layers, 
  Bot, 
  CheckCircle2, 
  ArrowRight,
  Download,
  FolderKanban,
  FileSearch,
  HardDrive
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schema';

interface FeatureItem {
  id: string;
  title: string;
  category: 'organization' | 'conversion' | 'editing' | 'security' | 'ai';
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  badge?: string;
  link: string;
}

const ALL_FEATURES: FeatureItem[] = [
  // Organization
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    category: 'organization',
    description: 'Combine multiple PDF files into a single structured document in any sequence you choose.',
    icon: Merge,
    iconColor: 'text-[#E5322D]',
    iconBg: 'bg-[#FFF2F2]',
    link: '/merge-pdf'
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    category: 'organization',
    description: 'Separate page ranges or extract individual pages into independent PDF files instantly.',
    icon: Split,
    iconColor: 'text-[#4285F4]',
    iconBg: 'bg-[#E8F0FE]',
    link: '/split-pdf'
  },
  {
    id: 'remove-pages',
    title: 'Remove & Reorder Pages',
    category: 'organization',
    description: 'Delete unnecessary pages or drag-and-drop page thumbnails to reorder your document.',
    icon: FolderKanban,
    iconColor: 'text-[#9333EA]',
    iconBg: 'bg-[#F3E8FF]',
    link: '/remove-pages'
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    category: 'organization',
    description: 'Rotate individual pages or entire documents 90°, 180°, or 270° clockwise and counterclockwise.',
    icon: RotateCw,
    iconColor: 'text-[#059669]',
    iconBg: 'bg-[#ECFDF5]',
    link: '/rotate-pdf'
  },

  // Compression & Optimization
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    category: 'editing',
    description: 'Reduce file size up to 90% while maintaining crisp typography and optical resolution.',
    icon: Minimize2,
    iconColor: 'text-[#34A853]',
    iconBg: 'bg-[#E6F4EA]',
    badge: 'Popular',
    link: '/compress-pdf'
  },
  {
    id: 'ocr-pdf',
    title: 'OCR Text Recognition',
    category: 'editing',
    description: 'Convert scanned PDF documents and photos into selectable, searchable, and editable text.',
    icon: FileSearch,
    iconColor: 'text-[#D97706]',
    iconBg: 'bg-[#FEF3C7]',
    badge: 'Pro',
    link: '/ocr-pdf'
  },
  {
    id: 'edit-pdf',
    title: 'Edit PDF',
    category: 'editing',
    description: 'Add custom text, annotations, shapes, highlights, and images directly onto your PDF pages.',
    icon: Edit3,
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-[#EFF6FF]',
    link: '/edit-pdf'
  },
  {
    id: 'watermark-pdf',
    title: 'Watermark PDF',
    category: 'editing',
    description: 'Stamp custom text or image watermarks onto documents with precise opacity and placement.',
    icon: Stamp,
    iconColor: 'text-[#7C3AED]',
    iconBg: 'bg-[#F5F3FF]',
    link: '/watermark-pdf'
  },

  // Conversion
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    category: 'conversion',
    description: 'Convert PDF files into fully editable Microsoft Word (.docx) documents without layout loss.',
    icon: FileText,
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-[#EFF6FF]',
    link: '/pdf-to-word'
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    category: 'conversion',
    description: 'Convert DOCX and DOC documents into clean, standard-compliant PDF files.',
    icon: FileText,
    iconColor: 'text-[#E5322D]',
    iconBg: 'bg-[#FFF2F2]',
    link: '/word-to-pdf'
  },
  {
    id: 'pdf-to-excel',
    title: 'PDF to Excel',
    category: 'conversion',
    description: 'Extract tables from PDF files directly into structured Microsoft Excel spreadsheets.',
    icon: FileSpreadsheet,
    iconColor: 'text-[#059669]',
    iconBg: 'bg-[#ECFDF5]',
    link: '/pdf-to-excel'
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG / PNG',
    category: 'conversion',
    description: 'Convert document pages into high-resolution images or extract all embedded images.',
    icon: ImageIcon,
    iconColor: 'text-[#D97706]',
    iconBg: 'bg-[#FEF3C7]',
    link: '/pdf-to-jpg'
  },

  // Security
  {
    id: 'protect-pdf',
    title: 'Protect PDF',
    category: 'security',
    description: 'Encrypt documents with strong AES 256-bit password protection to prevent unauthorized opening.',
    icon: Lock,
    iconColor: 'text-[#E5322D]',
    iconBg: 'bg-[#FFF2F2]',
    badge: 'Essential',
    link: '/protect-pdf'
  },
  {
    id: 'unlock-pdf',
    title: 'Unlock PDF',
    category: 'security',
    description: 'Remove password protection and printing/copying restrictions from secured PDF documents.',
    icon: Unlock,
    iconColor: 'text-[#34A853]',
    iconBg: 'bg-[#E6F4EA]',
    link: '/unlock-pdf'
  },
  {
    id: 'sign-pdf',
    title: 'Sign PDF',
    category: 'security',
    description: 'Draw, type, or upload your electronic signature to legally sign PDF contracts online.',
    icon: Stamp,
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-[#EFF6FF]',
    link: '/sign-pdf'
  },
  {
    id: 'redact-pdf',
    title: 'Redact PDF',
    category: 'security',
    description: 'Permanently remove or blackout sensitive financial, medical, or personal text from documents.',
    icon: EyeOff,
    iconColor: 'text-[#DC2626]',
    iconBg: 'bg-[#FEF2F2]',
    link: '/redact-pdf'
  },

  // AI & Smart Tools
  {
    id: 'ai-summary',
    title: 'AI PDF Summarizer',
    category: 'ai',
    description: 'Generate instant executive summaries, bullet points, and key insights from long PDF documents.',
    icon: Bot,
    iconColor: 'text-[#9333EA]',
    iconBg: 'bg-[#F3E8FF]',
    badge: 'AI Powered',
    link: '/ai-summary'
  },
  {
    id: 'ai-chat',
    title: 'Chat with PDF',
    category: 'ai',
    description: 'Ask questions, search details, and interact conversationally with your PDF content.',
    icon: Sparkles,
    iconColor: 'text-[#2563EB]',
    iconBg: 'bg-[#EFF6FF]',
    badge: 'AI Powered',
    link: '/chat-pdf'
  }
];

export function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFeatures = ALL_FEATURES.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Features', path: '/features' }], '/features');
  const webpageSchema = buildWebPageSchema({
    name: 'All Features & PDF Tools',
    slug: '/features',
    description: 'Browse the complete suite of capabilities on ilovepdf.in. From optimizing file size to securing documents with digital signatures, find everything you need.'
  });

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#272830] font-['Inter',sans-serif]">
      <SEO
        title="All Features & PDF Tools | ilovepdf.in"
        description="Browse the complete suite of capabilities on ilovepdf.in. From optimizing file size to securing documents with digital signatures, find everything you need."
        canonicalPath="/features"
        schema={[breadcrumbSchema, webpageSchema]}
      />

      {/* HERO SECTION */}
      <section className="bg-white border-b border-[#E0E2E8] pt-14 pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF2F2] border border-[#FFD9D9] text-[#E5322D] text-sm font-semibold mb-6">
            <Sparkles size={16} />
            <span>Complete PDF Capability Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#272830] tracking-tight mb-5">
            Every feature you need to handle PDFs effortlessly.
          </h1>

          <p className="text-base sm:text-lg text-[#686B74] max-w-2xl mx-auto mb-8 leading-relaxed">
            Convert, organize, edit, compress, and secure PDF files with 100% browser-based tools. No downloads, installation, or complex setup required.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-xl mx-auto relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#999BA3]">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g. Merge, Compress, OCR, Password)..."
              className="w-full h-12 pl-11 pr-4 bg-white border border-[#D4D6DE] rounded-xl text-sm sm:text-base placeholder-[#AEB2BC] focus:outline-none focus:border-[#E5322D] focus:ring-4 focus:ring-[#E5322D]/10 transition-all shadow-xs"
            />
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Features' },
              { id: 'organization', label: 'Organization' },
              { id: 'conversion', label: 'Conversion' },
              { id: 'editing', label: 'Edit & Optimize' },
              { id: 'security', label: 'Security & Rights' },
              { id: 'ai', label: 'AI Tools' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#272830] text-white shadow-xs'
                    : 'bg-[#F5F6FA] border border-[#E0E2E8] text-[#686B74] hover:bg-[#EAEBFF] hover:text-[#272830]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {filteredFeatures.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E0E2E8]">
            <Search size={48} className="mx-auto text-[#AEB2BC] mb-4" />
            <h3 className="text-lg font-bold text-[#272830] mb-1">No features found</h3>
            <p className="text-sm text-[#686B74]">Try searching for different keywords like "Merge", "Split", "Password", or "Compress".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map(feature => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className="group bg-white p-6 rounded-2xl border border-[#E0E2E8] hover:border-[#E5322D] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center ${feature.iconColor}`}>
                        <Icon size={24} />
                      </div>
                      {feature.badge && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          feature.badge === 'AI Powered' 
                            ? 'bg-[#F3E8FF] text-[#9333EA]' 
                            : feature.badge === 'Popular'
                            ? 'bg-[#E6F4EA] text-[#34A853]'
                            : 'bg-[#FFF2F2] text-[#E5322D]'
                        }`}>
                          {feature.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[#272830] group-hover:text-[#E5322D] transition-colors mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-[#686B74] leading-relaxed mb-6">
                      {feature.description}
                    </p>
                  </div>

                  <div className="flex items-center text-sm font-semibold text-[#E5322D] group-hover:translate-x-1 transition-transform">
                    <span>Use {feature.title}</span>
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* PLATFORM HIGHLIGHTS */}
      <section className="py-16 bg-white border-t border-[#E0E2E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#272830] mb-3">
              Engineered for Speed, Privacy, and Precision
            </h2>
            <p className="text-[#686B74] max-w-2xl mx-auto">
              Our architecture ensures your files remain safe, private, and quickly processed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[#F8F9FA] border border-[#E0E2E8]">
              <div className="w-10 h-10 rounded-lg bg-[#E6F4EA] text-[#34A853] flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#272830] mb-2">Automatic File Cleanup</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                All uploaded and converted files are automatically purged from our servers within 2 hours. We never view or store your content.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F9FA] border border-[#E0E2E8]">
              <div className="w-10 h-10 rounded-lg bg-[#FFF2F2] text-[#E5322D] flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#272830] mb-2">Client & Server Processing</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                We utilize client-side WebAssembly rendering alongside distributed cloud processing to process tasks in seconds.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F9FA] border border-[#E0E2E8]">
              <div className="w-10 h-10 rounded-lg bg-[#E8F0FE] text-[#4285F4] flex items-center justify-center mb-4">
                <HardDrive size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#272830] mb-2">Cross-Platform Access</h3>
              <p className="text-sm text-[#686B74] leading-relaxed">
                Seamlessly accessible on Windows, macOS, Linux, iOS, Android, and Chromebooks through any modern web browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4 sm:px-6 text-center bg-[#24252A] text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Start processing your PDFs today
          </h2>
          <p className="text-gray-300 mb-8 text-base">
            Streamline your digital document management alongside thousands of professionals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/pdf-tools"
              className="px-6 py-3 bg-[#E5322D] text-white font-semibold rounded-lg hover:bg-[#d42d28] transition-colors"
            >
              Explore All PDF Tools
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 bg-white/10 text-white border border-white/20 font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
