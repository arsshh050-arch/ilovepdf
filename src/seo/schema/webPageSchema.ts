import { WebPageSchemaOptions } from './types';
import { sanitizeSchema } from './sanitizeSchema';

export function buildWebPageSchema(opts: WebPageSchemaOptions) {
  const normalizedSlug = opts.slug.startsWith('/') ? opts.slug : `/${opts.slug}`;

  return sanitizeSchema({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://ilovepdf.in${normalizedSlug}#webpage`,
    name: opts.name,
    url: `https://ilovepdf.in${normalizedSlug}`,
    description: opts.description,
    publisher: {
      '@id': 'https://ilovepdf.in/#organization'
    }
  });
}
