import { discoveryText } from '../data/site';
import { publishedPosts } from '../lib/posts';
export async function GET() {
  const posts = await publishedPosts();
  const writing = ['## Writing', '', '- Writing: https://www.thomasofficer.com/writing', ...posts.map(p => `- ${p.data.title}: https://www.thomasofficer.com/writing/${p.id}`)];
  return new Response(`${discoveryText}\n${writing.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
