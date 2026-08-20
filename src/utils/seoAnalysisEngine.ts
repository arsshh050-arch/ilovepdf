import { PostModel, SeoAnalysisResult, SeoCheckItem } from '../types/postEditor';

// List of high-CTR power words commonly used in PDF & productivity domains
const POWER_WORDS = [
  'best', 'free', 'easy', 'fast', 'simple', 'quick', 'ultimate', 'guide', 'how to',
  'step by step', 'online', 'top', 'secure', 'instant', 'free download', 'tool', 'complete',
  'pro', 'tips', 'tricks', 'without watermark', 'safe', 'method', 'tutorial'
];

export function runSeoAnalysis(post: Partial<PostModel>): SeoAnalysisResult {
  const checks: SeoCheckItem[] = [];

  const focusKw = (post.seo?.focusKeyword || '').trim().toLowerCase();
  const rawTitle = (post.title || '').trim();
  const rawSeoTitle = (post.seo?.seoTitle || post.title || '').trim();
  const rawMetaDesc = (post.seo?.metaDescription || post.excerpt || '').trim();
  const rawSlug = (post.slug || '').trim().toLowerCase();
  const rawContent = (post.content || '').trim();

  // Strip HTML for text analysis
  const textOnly = rawContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textOnly ? textOnly.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // 1. BASIC SEO CHECKS
  // 1.1 Focus keyword in SEO title
  if (!focusKw) {
    checks.push({
      id: 'kw-in-title',
      category: 'basic',
      label: 'Focus Keyword in SEO Title',
      description: 'Add a Focus Keyword to your SEO title for better search targeting.',
      status: 'failed',
      scoreImpact: 10
    });
  } else if (rawSeoTitle.toLowerCase().includes(focusKw)) {
    const isNearStart = rawSeoTitle.toLowerCase().indexOf(focusKw) < 25;
    checks.push({
      id: 'kw-in-title',
      category: 'basic',
      label: 'Focus Keyword in SEO Title',
      description: isNearStart
        ? 'Great! Focus Keyword appears near the beginning of the SEO Title.'
        : 'Good, Focus Keyword is included in the SEO Title.',
      status: 'passed',
      scoreImpact: 12
    });
  } else {
    checks.push({
      id: 'kw-in-title',
      category: 'basic',
      label: 'Focus Keyword in SEO Title',
      description: `The Focus Keyword "${focusKw}" does not appear in the SEO Title tag.`,
      status: 'failed',
      scoreImpact: 12
    });
  }

  // 1.2 Focus keyword in Meta Description
  if (!focusKw) {
    checks.push({
      id: 'kw-in-meta',
      category: 'basic',
      label: 'Focus Keyword in Meta Description',
      description: 'Define a focus keyword and include it in your meta description.',
      status: 'failed',
      scoreImpact: 8
    });
  } else if (rawMetaDesc.toLowerCase().includes(focusKw)) {
    checks.push({
      id: 'kw-in-meta',
      category: 'basic',
      label: 'Focus Keyword in Meta Description',
      description: `Great! The Focus Keyword "${focusKw}" is present in the meta description.`,
      status: 'passed',
      scoreImpact: 10
    });
  } else {
    checks.push({
      id: 'kw-in-meta',
      category: 'basic',
      label: 'Focus Keyword in Meta Description',
      description: `The Focus Keyword "${focusKw}" does not appear in your Meta Description.`,
      status: 'failed',
      scoreImpact: 10
    });
  }

  // 1.3 Focus keyword in URL Slug
  const cleanKwSlug = focusKw.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!focusKw) {
    checks.push({
      id: 'kw-in-slug',
      category: 'basic',
      label: 'Focus Keyword in URL Slug',
      description: 'Add your primary keyword to the permalink slug.',
      status: 'warning',
      scoreImpact: 6
    });
  } else if (rawSlug.includes(cleanKwSlug) || focusKw.split(/\s+/).every(w => rawSlug.includes(w))) {
    checks.push({
      id: 'kw-in-slug',
      category: 'basic',
      label: 'Focus Keyword in URL Slug',
      description: `The Focus Keyword is correctly integrated into the URL slug (/${rawSlug}).`,
      status: 'passed',
      scoreImpact: 8
    });
  } else {
    checks.push({
      id: 'kw-in-slug',
      category: 'basic',
      label: 'Focus Keyword in URL Slug',
      description: `The Focus Keyword was not found in the URL slug. Consider using /${cleanKwSlug}.`,
      status: 'warning',
      scoreImpact: 8
    });
  }

  // 1.4 Focus keyword in the first 10% of content
  const first10PercentWordCount = Math.max(25, Math.ceil(wordCount * 0.1));
  const firstChunk = words.slice(0, first10PercentWordCount).join(' ').toLowerCase();

  if (!focusKw) {
    checks.push({
      id: 'kw-in-intro',
      category: 'basic',
      label: 'Focus Keyword in First 10% Content',
      description: 'Include your focus keyword in the opening paragraph.',
      status: 'failed',
      scoreImpact: 6
    });
  } else if (firstChunk.includes(focusKw)) {
    checks.push({
      id: 'kw-in-intro',
      category: 'basic',
      label: 'Focus Keyword in First 10% Content',
      description: 'Focus Keyword appears early in the opening section of your article.',
      status: 'passed',
      scoreImpact: 8
    });
  } else {
    checks.push({
      id: 'kw-in-intro',
      category: 'basic',
      label: 'Focus Keyword in First 10% Content',
      description: 'Focus Keyword is missing from the first 10% of the content. Mention it early to hook Google and readers.',
      status: 'warning',
      scoreImpact: 8
    });
  }

  // 1.5 Content length check
  if (wordCount >= 1500) {
    checks.push({
      id: 'content-length',
      category: 'basic',
      label: 'Content Length Evaluation',
      description: `Outstanding! Article length is ${wordCount} words (exceeds recommended 1,200+ words).`,
      status: 'passed',
      scoreImpact: 12,
      currentValue: `${wordCount} words`,
      recommendedValue: '1200+ words'
    });
  } else if (wordCount >= 800) {
    checks.push({
      id: 'content-length',
      category: 'basic',
      label: 'Content Length Evaluation',
      description: `Good content length (${wordCount} words). Expand with FAQs or troubleshooting steps to rank higher.`,
      status: 'passed',
      scoreImpact: 8,
      currentValue: `${wordCount} words`,
      recommendedValue: '1200+ words'
    });
  } else if (wordCount >= 400) {
    checks.push({
      id: 'content-length',
      category: 'basic',
      label: 'Content Length Evaluation',
      description: `Content is slightly short (${wordCount} words). Aim for at least 800-1,200 words for competitive search queries.`,
      status: 'warning',
      scoreImpact: 5,
      currentValue: `${wordCount} words`,
      recommendedValue: '800+ words'
    });
  } else {
    checks.push({
      id: 'content-length',
      category: 'basic',
      label: 'Content Length Evaluation',
      description: `Content is too thin (${wordCount} words). High-ranking PDF guides should have 1,000+ words.`,
      status: 'failed',
      scoreImpact: 0,
      currentValue: `${wordCount} words`,
      recommendedValue: '1000+ words'
    });
  }

  // 2. ADDITIONAL SEO CHECKS
  // 2.1 Keyword in Subheadings (H2, H3, H4)
  const headings = rawContent.match(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi) || [];
  const headingTexts = headings.map(h => h.replace(/<[^>]*>/g, '').toLowerCase());
  const kwInHeadings = focusKw ? headingTexts.some(ht => ht.includes(focusKw)) : false;

  if (focusKw && kwInHeadings) {
    checks.push({
      id: 'kw-in-headings',
      category: 'additional',
      label: 'Focus Keyword in Subheadings (H2/H3)',
      description: 'Focus Keyword is present in one or more H2/H3 subheadings.',
      status: 'passed',
      scoreImpact: 8
    });
  } else if (focusKw) {
    checks.push({
      id: 'kw-in-headings',
      category: 'additional',
      label: 'Focus Keyword in Subheadings (H2/H3)',
      description: 'Consider adding your Focus Keyword to at least one H2 or H3 heading.',
      status: 'warning',
      scoreImpact: 6
    });
  } else {
    checks.push({
      id: 'kw-in-headings',
      category: 'additional',
      label: 'Focus Keyword in Subheadings (H2/H3)',
      description: 'Add subheadings to structure your article.',
      status: 'failed',
      scoreImpact: 5
    });
  }

  // 2.2 Keyword Density
  if (focusKw && wordCount > 50) {
    const kwRegex = new RegExp(`\\b${focusKw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    const matches = (textOnly.match(kwRegex) || []).length;
    const density = parseFloat(((matches / wordCount) * 100).toFixed(2));

    if (density >= 0.8 && density <= 2.5) {
      checks.push({
        id: 'kw-density',
        category: 'additional',
        label: 'Focus Keyword Density',
        description: `Optimal keyword density: ${density}% (${matches} occurrences). Natural and non-spammy.`,
        status: 'passed',
        scoreImpact: 8,
        currentValue: `${density}%`,
        recommendedValue: '1.0% - 2.5%'
      });
    } else if (density > 2.5) {
      checks.push({
        id: 'kw-density',
        category: 'additional',
        label: 'Focus Keyword Density',
        description: `Keyword density is high: ${density}% (${matches} occurrences). Reduce to prevent over-optimization penalty.`,
        status: 'warning',
        scoreImpact: 4,
        currentValue: `${density}%`,
        recommendedValue: '1.0% - 2.5%'
      });
    } else {
      checks.push({
        id: 'kw-density',
        category: 'additional',
        label: 'Focus Keyword Density',
        description: `Keyword density is low: ${density}% (${matches} occurrences). Aim for 1.0% - 2.5%.`,
        status: 'warning',
        scoreImpact: 5,
        currentValue: `${density}%`,
        recommendedValue: '1.0% - 2.5%'
      });
    }
  } else {
    checks.push({
      id: 'kw-density',
      category: 'additional',
      label: 'Focus Keyword Density',
      description: 'Write more content with natural mentions of your Focus Keyword.',
      status: 'warning',
      scoreImpact: 4
    });
  }

  // 2.3 Image Alt Tag Analysis
  const imgTags: string[] = (rawContent.match(/<img[^>]+>/gi) || []) as string[];
  const hasFeaturedImg = !!post.featuredImage?.url;
  const totalImages = imgTags.length + (hasFeaturedImg ? 1 : 0);

  if (totalImages === 0) {
    checks.push({
      id: 'images-check',
      category: 'additional',
      label: 'Image & Media Optimization',
      description: 'No images or diagrams found. Articles with screenshots and visuals have 40% higher engagement.',
      status: 'warning',
      scoreImpact: 4
    });
  } else {
    const featuredAlt = (post.featuredImage?.alt || '').toLowerCase();
    const hasAlt = imgTags.some((img: string) => /alt=["'][^"']+["']/i.test(img)) || (hasFeaturedImg && !!featuredAlt);
    const altHasKw = (focusKw && featuredAlt.includes(focusKw)) || imgTags.some((img: string) => focusKw && img.toLowerCase().includes(focusKw));

    if (hasAlt && altHasKw) {
      checks.push({
        id: 'images-check',
        category: 'additional',
        label: 'Image & Media Optimization',
        description: `Great! Found ${totalImages} image(s) with ALT attributes containing the target keyword.`,
        status: 'passed',
        scoreImpact: 8
      });
    } else if (hasAlt) {
      checks.push({
        id: 'images-check',
        category: 'additional',
        label: 'Image & Media Optimization',
        description: `Images have ALT text, but consider adding your Focus Keyword "${focusKw}" to at least one image ALT.`,
        status: 'passed',
        scoreImpact: 6
      });
    } else {
      checks.push({
        id: 'images-check',
        category: 'additional',
        label: 'Image & Media Optimization',
        description: 'Images are missing ALT attributes. Add descriptive alt text for accessibility and image SEO.',
        status: 'warning',
        scoreImpact: 3
      });
    }
  }

  // 2.4 Internal & Outbound Links
  const linkMatches: string[] = (rawContent.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi) || []) as string[];
  let internalLinks = 0;
  let externalLinks = 0;

  linkMatches.forEach((l: string) => {
    if (l.includes('ilovepdf.in') || l.includes('href="/"') || l.includes('href="/merge') || l.includes('href="/compress')) {
      internalLinks++;
    } else if (l.includes('http://') || l.includes('https://')) {
      externalLinks++;
    } else if (l.includes('href="/')) {
      internalLinks++;
    }
  });

  if (post.relatedTool?.slug) {
    internalLinks++;
  }

  if (internalLinks >= 2) {
    checks.push({
      id: 'internal-links',
      category: 'additional',
      label: 'Internal Links & Tool Integration',
      description: `Great! Found ${internalLinks} internal link(s) connecting to PDF tools or related guides.`,
      status: 'passed',
      scoreImpact: 8
    });
  } else if (internalLinks === 1) {
    checks.push({
      id: 'internal-links',
      category: 'additional',
      label: 'Internal Links & Tool Integration',
      description: 'Found 1 internal link. Add 1-2 more contextual links to relevant PDF tools to boost crawl equity.',
      status: 'warning',
      scoreImpact: 5
    });
  } else {
    checks.push({
      id: 'internal-links',
      category: 'additional',
      label: 'Internal Links & Tool Integration',
      description: 'No internal links found. Link to iLovePDF converter tools or related articles to build authority.',
      status: 'warning',
      scoreImpact: 2
    });
  }

  // 3. TITLE READABILITY CHECKS
  // 3.1 Title Length (Optimal: 40 - 60 chars)
  const titleLen = rawSeoTitle.length;
  if (titleLen >= 35 && titleLen <= 60) {
    checks.push({
      id: 'title-length',
      category: 'title',
      label: 'SEO Title Length (SERP Snippet)',
      description: `Optimal title length (${titleLen}/60 characters). Will not get truncated in Google Search.`,
      status: 'passed',
      scoreImpact: 8,
      currentValue: `${titleLen} chars`,
      recommendedValue: '40 - 60 chars'
    });
  } else if (titleLen > 60) {
    checks.push({
      id: 'title-length',
      category: 'title',
      label: 'SEO Title Length (SERP Snippet)',
      description: `Title is too long (${titleLen} characters). It will be cut off with ellipsis (...) in Google results.`,
      status: 'warning',
      scoreImpact: 5,
      currentValue: `${titleLen} chars`,
      recommendedValue: '40 - 60 chars'
    });
  } else {
    checks.push({
      id: 'title-length',
      category: 'title',
      label: 'SEO Title Length (SERP Snippet)',
      description: `Title is very short (${titleLen} characters). Utilize 45-60 chars to maximize search CTR.`,
      status: 'warning',
      scoreImpact: 4,
      currentValue: `${titleLen} chars`,
      recommendedValue: '40 - 60 chars'
    });
  }

  // 3.2 Power Words in Title
  const hasPowerWord = POWER_WORDS.some(pw => rawSeoTitle.toLowerCase().includes(pw));
  if (hasPowerWord) {
    checks.push({
      id: 'title-power-words',
      category: 'title',
      label: 'High-CTR Power Words in Title',
      description: 'Your SEO Title contains persuasive power words (e.g. Free, Easy, Step-by-Step, Guide) that increase click-through rates.',
      status: 'passed',
      scoreImpact: 6
    });
  } else {
    checks.push({
      id: 'title-power-words',
      category: 'title',
      label: 'High-CTR Power Words in Title',
      description: 'Consider adding a compelling modifier like "Free", "Step-by-Step", or "Fast Online" to improve organic CTR.',
      status: 'warning',
      scoreImpact: 3
    });
  }

  // 3.3 Number in Title (e.g. 5 Easy Steps, 2026 Guide)
  const hasNumber = /\d+/.test(rawSeoTitle);
  if (hasNumber) {
    checks.push({
      id: 'title-number',
      category: 'title',
      label: 'Number in Title',
      description: 'Title contains a number (e.g. year, steps, or tips count). Numbers boost CTR on Google SERPs.',
      status: 'passed',
      scoreImpact: 5
    });
  } else {
    checks.push({
      id: 'title-number',
      category: 'title',
      label: 'Number in Title',
      description: 'Adding a number (e.g., "5 Steps", "2026 Edition") can increase CTR by up to 20%.',
      status: 'warning',
      scoreImpact: 3
    });
  }

  // 4. READABILITY & STRUCTURE
  // 4.1 Meta Description Length (120 - 160 chars)
  const metaLen = rawMetaDesc.length;
  if (metaLen >= 120 && metaLen <= 160) {
    checks.push({
      id: 'meta-desc-length',
      category: 'readability',
      label: 'Meta Description Length',
      description: `Perfect meta description length (${metaLen}/160 characters). Captures maximum SERP real estate.`,
      status: 'passed',
      scoreImpact: 8,
      currentValue: `${metaLen} chars`,
      recommendedValue: '120 - 160 chars'
    });
  } else if (metaLen > 160) {
    checks.push({
      id: 'meta-desc-length',
      category: 'readability',
      label: 'Meta Description Length',
      description: `Meta description is over 160 characters (${metaLen} chars) and may be truncated by search engines.`,
      status: 'warning',
      scoreImpact: 5,
      currentValue: `${metaLen} chars`,
      recommendedValue: '120 - 160 chars'
    });
  } else if (metaLen > 50) {
    checks.push({
      id: 'meta-desc-length',
      category: 'readability',
      label: 'Meta Description Length',
      description: `Meta description is slightly short (${metaLen} characters). Expand to ~140-155 characters for higher CTR.`,
      status: 'warning',
      scoreImpact: 4,
      currentValue: `${metaLen} chars`,
      recommendedValue: '120 - 160 chars'
    });
  } else {
    checks.push({
      id: 'meta-desc-length',
      category: 'readability',
      label: 'Meta Description Length',
      description: 'Meta description is missing or too short. Write a persuasive summary with a call to action.',
      status: 'failed',
      scoreImpact: 0,
      currentValue: `${metaLen} chars`,
      recommendedValue: '120 - 160 chars'
    });
  }

  // 4.2 Quick Answer / Featured Snippet Box
  if (post.quickAnswer && post.quickAnswer.length >= 60) {
    checks.push({
      id: 'quick-answer',
      category: 'readability',
      label: 'Google AI Overview & Featured Snippet',
      description: 'Quick Answer summary is configured, enabling direct answers in Google AI Overviews.',
      status: 'passed',
      scoreImpact: 6
    });
  } else {
    checks.push({
      id: 'quick-answer',
      category: 'readability',
      label: 'Google AI Overview & Featured Snippet',
      description: 'Add a 2-sentence Quick Answer box to compete for position 0 and AI Overview snippets.',
      status: 'warning',
      scoreImpact: 3
    });
  }

  // 4.3 FAQs with Schema
  if (post.faqs && post.faqs.length >= 2) {
    checks.push({
      id: 'faqs-schema',
      category: 'readability',
      label: 'FAQ Schema Rich Results',
      description: `Article has ${post.faqs.length} FAQ items eligible for expandable rich snippet accordions in SERPs.`,
      status: 'passed',
      scoreImpact: 6
    });
  } else {
    checks.push({
      id: 'faqs-schema',
      category: 'readability',
      label: 'FAQ Schema Rich Results',
      description: 'Add 2-4 FAQs to enable FAQPage rich snippet accordions in Google search results.',
      status: 'warning',
      scoreImpact: 2
    });
  }

  // Calculate Total Score (Scale 0 - 100)
  const totalEarned = checks.reduce((acc, c) => acc + (c.status === 'passed' ? c.scoreImpact : c.status === 'warning' ? Math.floor(c.scoreImpact * 0.5) : 0), 0);
  const maxPossible = checks.reduce((acc, c) => acc + c.scoreImpact, 0);

  let score = Math.min(100, Math.max(10, Math.round((totalEarned / Math.max(1, maxPossible)) * 100)));

  // If no focus keyword is supplied, cap score at 50
  if (!focusKw) {
    score = Math.min(score, 45);
  }

  let scoreStatus: 'poor' | 'fair' | 'good' | 'great' = 'poor';
  if (score >= 80) scoreStatus = 'great';
  else if (score >= 65) scoreStatus = 'good';
  else if (score >= 45) scoreStatus = 'fair';

  const passedCount = checks.filter(c => c.status === 'passed').length;
  const warningCount = checks.filter(c => c.status === 'warning').length;
  const failedCount = checks.filter(c => c.status === 'failed').length;

  return {
    score,
    scoreStatus,
    checks,
    passedCount,
    warningCount,
    failedCount
  };
}
