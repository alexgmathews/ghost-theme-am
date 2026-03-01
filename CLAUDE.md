# Ghost CMS theme: alexmathews.blog (based on TryGhost/Dawn)

Custom Ghost theme for alexmathews.blog with tag-based color schemes, custom typography hierarchy, and plugin integration for math/code rendering.

## What It Is

- Ghost 5.0+ theme template (hbs + CSS)
- Requires deployment via Ghost admin panel or ZIP upload
- Fork of TryGhost/Dawn theme with alexmathews customizations
- MIT licensed

## Theme Engine

- Handlebars templating (Ghost CMS native)
- Mustache-style syntax for partials and conditionals
- Tag-based conditional logic drives CSS variables (`#format-poem`, `#plugin-katex`, `#plugin-prism`)
- Navigation and tag color injection via `default.hbs` style blocks
- No custom JS beyond shared Ghost theme assets + jQuery slim

## Fonts

Root CSS variables in `typography.css`:

- `--font-serif`: Crimson Pro (headings, body)
- `--font-serif-alt`: Lora (poem formatting)
- `--font-caption`: Cabin 95x (nav, metadata)
- `--font-sans`: Source Sans 3 (fallback)
- `--font-mono`: JetBrains Mono (code blocks)

Preload directives commented out in `default.hbs` (lines 12-28); fonts referenced via CSS variables only.

## CSS Architecture

Modular import cascade in `screen.css`:

1. TryGhost shared base (`@tryghost/shared-theme-assets v2.5.2`)
2. General (basics, buttons)
3. Site layout (layout, header)
4. Blog (feed, pagination, single, tags)
5. Miscellaneous (utils)
6. Custom overrides (`typography.css`, `color.css`)

Custom CSS files:
- `typography.css`: font stacks, heading hierarchy, article body sizing, poem/code formatting, blockquote styling
- `color.css`: tag-specific navigation/calendar colors (essays=teal, stories/poems=blue, technology=orange)

## Custom Templates

- `default.hbs`: layout wrapper, plugin CDN links (KaTeX, Prism), style injection for tag accent colors
- `index.hbs`: post feed loop (inherits default, uses `loop` partial)
- `post.hbs`: single post view (inherits default, renders `content` partial)

## Build System

Gulp 5.0 pipeline (`gulpfile.js`):

- **CSS**: postcss (easyimport, purgecss) → csso minification → `assets/built/screen.css`
- **JS**: concat shared Ghost assets + custom `assets/js/main.js` → uglify → `assets/built/main.min.js`
- **ZIP**: bundles theme (excludes node_modules, source assets, gulpfile) → `dist/ghost-theme-am.zip` for upload

PurgeCSS targets scrape directory (`../site-scrape/*.html`) for unused CSS removal.

## Config

`package.json`:

- Engine: Ghost ≥5.0.0
- Posts per page: 50
- Image sizes: 400w (s), 750w (m), 960w (l), 1140w (xl)
- Card assets disabled
- DevDeps: postcss, gulp, plugins for minification and zipping

## Plugins

Conditionally loaded via tags on posts:

- `#plugin-katex`: KaTeX CDN + auto-render script for LaTeX math
- `#plugin-prism`: Prism JS CDN + local CSS for syntax highlighting
- jQuery slim for DOM manipulation
