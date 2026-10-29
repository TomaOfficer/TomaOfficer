// Missing draft flags stay private, including builds outside Cloudflare.
export function isPublished(post) { return post.data.draft === false; }
export function newestFirst(a, b) { return b.data.pubDate.valueOf() - a.data.pubDate.valueOf(); }
