import { sanitizeSchema } from './sanitizeSchema';

export function buildWebsiteSchema(description?: string) {
  return sanitizeSchema({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.ilovepdf.in/#website',
    name: 'iLovePDF.in',
    url: 'https://www.ilovepdf.in/',
    description: description || 'Process your documents securely from your browser. Optimize, convert, edit, and organize files online.',
    publisher: {
      '@id': 'https://www.ilovepdf.in/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.ilovepdf.in/?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  });
}
