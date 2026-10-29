import rss from '@astrojs/rss';
import { publishedPosts } from '../lib/posts';
export async function GET(context: { site: URL | undefined }) {
  const posts = await publishedPosts();
  return rss({ title: 'Thomas Officer — Writing', description: 'Articles by Thomas Officer.', site: context.site!, trailingSlash: false,
    items: posts.map(post => ({ title: post.data.title, description: post.data.description, pubDate: post.data.pubDate, link: `/writing/${post.id}` })) });
}
