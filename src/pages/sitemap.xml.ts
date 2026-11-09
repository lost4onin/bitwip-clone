import type { APIRoute } from 'astro';
import { getNews, locales, type Locale } from '../lib/i18n';

type Entry = { alternates: Partial<Record<Locale, string>>; lastmod?: Date };

/**
 * Hand-rolled sitemap (no extra dependency) listing every localised page
 * with its hreflang alternates.
 */
export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('http://localhost:4321');
  const abs = (path: string) => new URL(path, origin).href;

  const entries: Entry[] = [{ alternates: Object.fromEntries(locales.map((l) => [l, `/${l}/`])) }];

  const articles = (await Promise.all(locales.map(async (l) => (await getNews(l)).map((a) => ({ l, a }))))).flat();
  const byKey = Map.groupBy(articles, ({ a }) => a.data.key);
  for (const group of byKey.values()) {
    entries.push({
      alternates: Object.fromEntries(group.map(({ l, a }) => [l, `/${l}/news/${a.slug}/`])),
      lastmod: group[0].a.data.date,
    });
  }

  const urls = entries.flatMap(({ alternates, lastmod }) =>
    Object.values(alternates).map((path) => {
      const links = Object.entries(alternates)
        .map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(p!)}"/>`)
        .join('\n');
      const mod = lastmod ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
      return `  <url>\n    <loc>${abs(path!)}</loc>${mod}\n${links}\n  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
