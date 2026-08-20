import { WebAppSchemaOptions } from './types';
import { sanitizeSchema } from './sanitizeSchema';

export function buildWebApplicationSchema(opts: WebAppSchemaOptions) {
  const normalizedSlug = opts.slug.startsWith('/') ? opts.slug : `/${opts.slug}`;
  const appCategory = opts.category || 'UtilitiesApplication';

  return sanitizeSchema({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `https://ilovepdf.in${normalizedSlug}#webapp`,
    name: `${opts.name} - ilovepdf.in`,
    url: `https://ilovepdf.in${normalizedSlug}`,
    description: opts.description,
    applicationCategory: appCategory,
    operatingSystem: 'All Browser Platforms',
    browserRequirements: opts.browserRequirements || 'Requires HTML5 and JavaScript compatible web browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@id': 'https://ilovepdf.in/#organization'
    }
  });
}
