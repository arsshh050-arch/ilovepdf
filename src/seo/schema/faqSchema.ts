import { FaqItemInput } from './types';
import { sanitizeSchema } from './sanitizeSchema';

export function buildFaqSchema(faqs: FaqItemInput[] | undefined, slug: string) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;

  const mainEntity = faqs
    .filter(f => f && f.question && f.question.trim() && f.answer && f.answer.trim())
    .map(f => {
      // Strip HTML tags for clean text in structured data
      const cleanAnswer = f.answer.replace(/<[^>]*>?/gm, '').trim();
      return {
        '@type': 'Question',
        name: f.question.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: cleanAnswer
        }
      };
    });

  if (mainEntity.length === 0) {
    return null;
  }

  return sanitizeSchema({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://ilovepdf.in${normalizedSlug}#faq`,
    mainEntity
  });
}
