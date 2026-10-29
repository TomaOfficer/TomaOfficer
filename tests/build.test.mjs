import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, rm, readFile, readdir, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
const publicDir = 'src/content/writing';
const prefix = `verification-${randomUUID()}`;
const [published, privatePost, unset, local] = ['published','private','unset','local'].map(name => `${prefix}-${name}`);
const fixtureNames = [published, privatePost, unset].map(name => `${name}.md`);
const frontmatter = (draft, body) => `---\ntitle: Test article\ndescription: Synthetic verification fixture\npubDate: 2026-10-29\n${draft}\n---\n${body}\n`;
test('all static builds exclude private drafts, on production, preview and unset branch environments', async () => {
  await mkdir('.local-drafts', {recursive:true});
  try {
    await writeFile(`${publicDir}/${published}.md`, frontmatter('draft: false','PUBLIC_ARTICLE_SENTINEL'));
    await writeFile(`${publicDir}/${privatePost}.md`, frontmatter('draft: true','PRIVATE_DRAFT_SENTINEL'));
    await writeFile(`${publicDir}/${unset}.md`, frontmatter('','PRIVATE_DRAFT_SENTINEL'));
    await writeFile(`.local-drafts/${local}.md`, frontmatter('draft: false','PRIVATE_DRAFT_SENTINEL'));
    for (const branch of ['master','preview',undefined]) {
      const env = {...process.env};
      if (branch) env.CF_PAGES_BRANCH=branch; else delete env.CF_PAGES_BRANCH;
      execFileSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{env,stdio:'pipe'});
      execFileSync(process.execPath,['scripts/verify-dist.mjs'],{stdio:'pipe'});
      assert((await readFile(`dist/writing/${published}.html`,'utf8')).includes('PUBLIC_ARTICLE_SENTINEL'));
      const routes = await readdir('dist/writing');
      assert(routes.includes(`${published}.html`));
      for (const name of [privatePost, unset, local]) assert(!routes.includes(`${name}.html`));
      for (const file of ['writing.html','rss.xml','llms.txt','sitemap-0.xml']) {
        const output=await readFile(`dist/${file}`,'utf8');
        for (const privateName of [privatePost, unset, local, 'PRIVATE_DRAFT_SENTINEL']) assert(!output.includes(privateName),`${branch}: ${file} leaks ${privateName}`);
      }
    }
  } finally {
    for (const name of fixtureNames) await rm(`${publicDir}/${name}`,{force:true});
    await rm(`.local-drafts/${local}.md`,{force:true});
    execFileSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{stdio:'pipe'});
    execFileSync(process.execPath,['scripts/verify-dist.mjs'],{stdio:'pipe'});
  }
});
