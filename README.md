# Studio Green

Modern, natural garden design by Verena Hoffmann, Andernach.

A static marketing website built with [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/), and [Tailwind CSS 4](https://tailwindcss.com/). Content is managed via [Sveltia CMS](https://github.com/sveltia/sveltia-cms) and stored as Markdown files with YAML front matter.

## Features

- Full-viewport hero with SVG mask reveal animation on scroll
- Four content sections (About, Studio, Philosophy, Services) loaded from Markdown
- Scroll-triggered fade-in/slide-up animations via IntersectionObserver
- Responsive layout with mobile hamburger navigation
- Sveltia CMS at `/cms/` for non-technical content editing
- Fully static export, deployed to GitHub Pages

## Development

```bash
pnpm install
pnpm dev        # start dev server on http://localhost:3000
pnpm build      # static export to /out/
pnpm lint       # ESLint (flat config)
pnpm test       # Playwright E2E smoke tests
```

## Content

Edit the Markdown files in `content/sections/` directly or use the CMS (`/cms/`). The CMS connects to the GitHub repo and commits changes on save.

## Deployment

Pushes to `main` trigger a [GitHub Actions](.github/workflows/deploy.yml) workflow that runs tests, builds, and deploys to GitHub Pages.