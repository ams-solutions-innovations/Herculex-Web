import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string(),
    publisher: z.string().optional(),
    source: z.string(),
  }),
});

export const collections = { legal };
