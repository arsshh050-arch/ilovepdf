import { BreadcrumbItemInput } from './types';
import { sanitizeSchema } from './sanitizeSchema';

export function buildBreadcrumbSchema(items: BreadcrumbItemInput[], currentSlug: string) {
  const normalizedSlug = currentSlug.startsWith('/') ? currentSlug : `/${currentSlug}`;
  
  // Always ensure 'Home' is position 1 if not explicitly provided
  const allItems: BreadcrumbItemInput[] = [];
  if (items.length === 0 || items[0].path !== '/') {
    allItems.push({ name: 'Home', path: '/' });
  }
  allItems.push(...items);

  const itemListElement = allItems.map((item, index) => {
    const absUrl = item.path.startsWith('http')
      ? item.path
      : `https://ilovepdf.in${item.path.startsWith('/') ? item.path : `/${item.path}`}`;

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absUrl
    };
  });

  return sanitizeSchema({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `https://ilovepdf.in${normalizedSlug}#breadcrumb`,
    itemListElement
  });
}
