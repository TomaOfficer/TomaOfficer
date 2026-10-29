import { getCollection } from 'astro:content';
import { isPublished, newestFirst } from './publication.mjs';
export async function publishedPosts() {
  return (await getCollection('writing')).filter(isPublished).sort(newestFirst);
}
export async function visiblePosts() {
  const published = await publishedPosts();
  if (!import.meta.env.DEV) return published;
  const drafts = await getCollection('localDrafts');
  return [...published, ...drafts.map(post => ({ ...post, data: { ...post.data, draft: true } }))].sort(newestFirst);
}
export function dateLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
