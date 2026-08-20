export interface BreadcrumbItemInput {
  name: string;
  path: string;
}

export interface WebAppSchemaOptions {
  name: string;
  slug: string;
  description: string;
  category?: string;
  browserRequirements?: string;
}

export interface FaqItemInput {
  question: string;
  answer: string;
}

export interface ArticleSchemaOptions {
  headline: string;
  slug: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
}

export interface WebPageSchemaOptions {
  name: string;
  slug: string;
  description: string;
}
