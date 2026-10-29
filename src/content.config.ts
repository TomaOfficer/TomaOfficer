import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const schema = ({ image }: SchemaContext) => z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  ogImage: image().optional(),
  draft: z.boolean().default(true),
});
export const collections = {
  writing: defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/writing' }), schema }),
  localDrafts: defineCollection({
    loader: import.meta.env.DEV ? glob({ pattern: '**/*.md', base: './.local-drafts' }) : { name: 'exclude-local-drafts', load: async ({ store }) => { store.clear(); } },
    schema,
  }),
};
