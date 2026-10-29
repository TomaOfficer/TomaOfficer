import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublished, newestFirst } from '../src/lib/publication.mjs';
test('only an explicit publication decision can be deployed', () => {
  assert.equal(isPublished({data:{draft:false}}), true);
  assert.equal(isPublished({data:{draft:true}}), false);
  assert.equal(isPublished({data:{}}), false);
});
test('articles are listed newest first', () => {
  const posts = [1,3,2].map(n => ({data:{pubDate:new Date(`2026-10-0${n}`)}}));
  assert.deepEqual(posts.sort(newestFirst).map(p => p.data.pubDate.getUTCDate()), [3,2,1]);
});
