import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * News articles live in `src/content/news/<locale>/<slug>.md`.
 * The entry id is `<locale>/<slug>`, which is how pages filter by language.
 */
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    /** Shared by every translation of the same article; links /en ↔ /fr. */
    key: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    excerpt: z.string(),
    image: z.string(),
    alt: z.string(),
  }),
});

export const collections = { news };
