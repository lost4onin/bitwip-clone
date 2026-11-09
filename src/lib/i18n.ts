import { getCollection } from 'astro:content';

import type enSite from '../data/en/site.json';
import type enAbout from '../data/en/about.json';
import type enServices from '../data/en/services.json';
import type enWork from '../data/en/work.json';
import type enTestimonials from '../data/en/testimonials.json';
import type enNews from '../data/en/news.json';
import type enFaq from '../data/en/faq.json';

export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { label: string; htmlLang: string; ogLocale: string }> = {
  en: { label: 'English', htmlLang: 'en', ogLocale: 'en_GB' },
  fr: { label: 'Français', htmlLang: 'fr', ogLocale: 'fr_FR' },
};

/** Shape of every per-locale JSON file; the English files are the source of truth. */
export interface Content {
  site: typeof enSite;
  about: typeof enAbout;
  services: typeof enServices;
  work: typeof enWork;
  testimonials: typeof enTestimonials;
  news: typeof enNews;
  faq: typeof enFaq;
}

const files = import.meta.glob<Record<string, unknown>>('../data/{en,fr}/*.json', {
  eager: true,
  import: 'default',
});

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Load every content file for one locale. */
export function getContent(locale: Locale): Content {
  const prefix = `../data/${locale}/`;
  const entries = Object.entries(files)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, data]) => [path.slice(prefix.length, -'.json'.length), data]);
  return Object.fromEntries(entries) as unknown as Content;
}

/** News entries for a locale, newest first. */
export async function getNews(locale: Locale) {
  const entries = await getCollection('news', ({ id }) => id.startsWith(`${locale}/`));
  return entries
    .map((entry) => ({ ...entry, slug: entry.id.slice(locale.length + 1) }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Replace `{name}` placeholders in a UI string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeMeta[locale].htmlLang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
