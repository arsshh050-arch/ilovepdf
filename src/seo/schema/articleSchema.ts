import { ArticleSchemaOptions } from './types';
import { sanitizeSchema } from './sanitizeSchema';

export function buildArticleSchema(opts: ArticleSchemaOptions) {
  const normalizedSlug = opts.slug.startsWith('/') ? opts.slug : `/${opts.slug}`;
  const imageUrl = opts.image || 'https://ilovepdf.in/og-image.png';

  return sanitizeSchema({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `https://ilovepdf.in${normalizedSlug}#article`,
    headline: opts.headline,
    description: opts.description,
    url: `https://ilovepdf.in${normalizedSlug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ilovepdf.in${normalizedSlug}`
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl
    },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: {
      '@type': 'Organization',
      name: opts.authorName || 'ilovepdf.in Editorial Team',
      url: 'https://ilovepdf.in/about'
    },
    publisher: {
      '@id': 'https://ilovepdf.in/#organization'
    }
  });
}
