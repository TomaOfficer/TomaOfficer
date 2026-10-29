# Thomas Officer

Static Astro website, deployed to Cloudflare Pages.

## Work locally

Use the Node version in `.nvmrc`, install with `npm ci`, and start with `npm run dev`.
`npm run check`, `npm test`, and `npm run build` verify the site. `npm run preview` serves the build.

## Publish an article

Ask Codex to publish a finished article. Only approved, public writing belongs in this public repository.
Copy the final Markdown into `src/content/writing/<slug>.md` with title, description, pubDate (YYYY-MM-DD), and `draft: false`. An optional updatedDate and local ogImage are supported.
The filename supplies its permanent `/writing/<slug>` address. Review the result before pushing.

## Private drafts

Keep source drafts in your existing private writing folder, outside this repository. For a local website preview only, copy a draft into ignored `.local-drafts/` with the same metadata. Local drafts are labelled and never loaded by a static build. Never commit private writing or assets. PR previews are public and contain only approved content.
A missing draft flag defaults to private; `draft: true` entries in the public collection are excluded from every build, but do not use that flag to store private text in Git.

## Deploy

Cloudflare Pages builds `master` with `npm run build`, publishes `dist`, and uses the pinned Node version. PR deployments use the same publication rules. Enable basic Web Analytics in the Pages dashboard. Domain registration stays at GoDaddy; DNS and the apex-to-www redirect are managed in Cloudflare after cutover.

The previous static site is recoverable from Git commit `5ff6a53`. Downtime during this migration is acceptable. For a bad code deployment, use Cloudflare’s deployment rollback. For a domain rollback, restore the recorded DNS settings and verify the former host is serving with a valid certificate first.
