import { sanitizeSchema } from './sanitizeSchema';

export function buildOrganizationSchema() {
  return sanitizeSchema({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.ilovepdf.in/#organization',
    name: 'iLovePDF.in',
    url: 'https://www.ilovepdf.in/',
    logo: 'https://www.ilovepdf.in/favicon-512x512.png'
  });
}
