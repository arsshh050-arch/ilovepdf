import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  schema?: Record<string, any>[];
  noIndex?: boolean;
}

export function SEO({
  title,
  description,
  canonicalPath,
  ogImage = 'https://www.ilovepdf.in/og-image.png',
  schema = [],
  noIndex = false
}: SEOProps) {
  const canonicalUrl = `https://www.ilovepdf.in${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="ilovepdf-in-official-verification-code-2026" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="iLovePDF.in" />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data / JSON-LD */}
      {schema.map((s, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

