export interface PostAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface PostFeaturedImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface PostSeoData {
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  isCornerstone?: boolean;
  
  // Advanced
  robotsIndex?: 'index' | 'noindex';
  robotsFollow?: 'follow' | 'nofollow';
  robotsNoArchive?: boolean;
  robotsNoSnippet?: boolean;
  robotsMaxImagePreview?: 'large' | 'standard' | 'none';
  canonicalUrl?: string;
  breadcrumbTitle?: string;
  redirectOldSlug?: string;
  redirectStatusCode?: number;

  // Social
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary_large_image' | 'summary';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  // Schema
  schemaType?: 'BlogPosting' | 'Article' | 'HowTo' | 'FAQPage' | 'TechArticle' | 'SoftwareApplication';
  customSchemaJson?: string;
}

export interface PostFaqItem {
  question: string;
  answer: string;
}

export interface PostGuideStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface PostStepByStepGuide {
  title: string;
  toolName?: string;
  toolSlug?: string;
  steps: PostGuideStep[];
}

export interface PostTroubleshootingItem {
  issue: string;
  solution: string;
}

export interface PostRevision {
  id: string;
  timestamp: string;
  title: string;
  slug: string;
  content: string;
  wordCount: number;
  seoTitle?: string;
  metaDescription?: string;
  status: string;
}

export interface PostModel {
  id: string;
  title: string;
  slug: string;
  h1?: string;
  excerpt?: string;
  content: string;
  quickAnswer?: string;
  category: string;
  tags: string[];
  author: PostAuthor;
  featuredImage: PostFeaturedImage;
  status: 'draft' | 'published' | 'scheduled' | 'private' | 'trash';
  visibility?: 'public' | 'password' | 'private';
  publishedDate: string;
  updatedDate?: string;
  scheduledDate?: string;
  isFeatured?: boolean;
  
  // SEO & Rank Math Settings
  seo: PostSeoData;

  // Structured Content Sections
  stepByStepGuide?: PostStepByStepGuide;
  faqs?: PostFaqItem[];
  troubleshooting?: PostTroubleshootingItem[];
  commonMistakes?: string[];
  relatedTool?: {
    name: string;
    slug: string;
    description: string;
    ctaText: string;
  };
  
  // Metrics & History
  wordCount?: number;
  readTimeMinutes?: number;
  revisions?: PostRevision[];
  relatedPostSlugs?: string[];
}

export interface SeoCheckItem {
  id: string;
  category: 'basic' | 'additional' | 'title' | 'readability';
  label: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
  scoreImpact: number;
  currentValue?: string | number;
  recommendedValue?: string | number;
}

export interface SeoAnalysisResult {
  score: number;
  scoreStatus: 'poor' | 'fair' | 'good' | 'great';
  checks: SeoCheckItem[];
  passedCount: number;
  warningCount: number;
  failedCount: number;
}
