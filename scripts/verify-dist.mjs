import { readdir, readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const base = 'dist';
async function walk(dir) { return (await Promise.all((await readdir(dir, {withFileTypes:true})).map(e => e.isDirectory() ? walk(join(dir,e.name)) : join(dir,e.name)))).flat(); }
const files = await walk(base);
for (const path of ['index.html','resume.html','work/echo.html','work/afterpattern.html','work/blueridgelabs.html','writing.html','404.html','rss.xml','llms.txt','sitemap-index.xml']) await access(join(base,path));
for (const file of files.filter(f => f.endsWith('.html'))) {
  const html = await readFile(file,'utf8');
  assert.equal((html.match(/<title>/g)||[]).length,1,`${file}: title`);
  for (const key of ['description']) assert(html.includes(`name="${key}"`),`${file}: ${key}`);
  for (const key of ['og:title','og:description','og:image']) assert(html.includes(`property="${key}"`),`${file}: ${key}`);
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert(canonical.startsWith('https://www.thomasofficer.com/'),`${file}: canonical`);
  assert(!canonical.endsWith('.html'),`${file}: legacy canonical`);
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) JSON.parse(m[1]);
  for (const m of html.matchAll(/property="og:image" content="([^"]+)"/g)) await access(join(base,new URL(m[1]).pathname));
  if (file.includes('/writing/') && !file.endsWith('/index.html')) {
    assert(html.includes('BlogPosting') && html.includes('article:published_time') && html.includes('summary_large_image'), `${file}: article metadata`);
  }
  assert(!html.includes('PRIVATE_DRAFT_SENTINEL'),`${file}: draft leak`);
}
const sitemap = (await Promise.all(files.filter(f=>/sitemap.*\.xml$/.test(f)).map(f=>readFile(f,'utf8')))).join('');
assert(!sitemap.includes('/404') && !sitemap.includes('.html'),'sitemap contains excluded routes');
const headers = await readFile(join(base,'_headers'),'utf8');
assert(headers.includes('immutable'),'immutable asset caching');
const robots = await readFile(join(base,'robots.txt'),'utf8');
assert(robots.includes('User-agent: *') && robots.includes('Allow: /') && robots.includes('/sitemap-index.xml'),'robots');
for (const file of files.filter(f=>f.endsWith('.html') && f.includes('/work/'))) {
 const html=await readFile(file,'utf8'); assert(html.includes('image/avif') && html.includes('image/webp'),`${file}: responsive formats`);
}
console.log(`Verified ${files.filter(f=>f.endsWith('.html')).length} pages and discovery files.`);
