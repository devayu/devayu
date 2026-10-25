# Room build brief (shared by all four room builders)

You are building one room of Ayush Maurya's portfolio, "devayu" (Next.js 16 App Router, React 19, Tailwind CSS 4, TypeScript). The site is a gallery of four art-movement rooms: Bauhaus, Dada, Pop Art, Cubism. A select screen at `/` (already built: `src/components/gallery/`) shows the four rooms; the visitor enters one and explores the SAME true content rendered entirely in that movement's own practice. Read `PRODUCT.md` and `.impeccable/surfaces/src-app-page-tsx.md` (the direction contract) first, then your movement's dossier in `.impeccable/research/<movement>.md`. The bar is Awwwards Site of the Day: bold, specific, crafted, with micro-interactions that come from the movement itself, not generic hover effects.

## What you own (edit only these)
- `src/app/<slug>/` — `page.tsx` (replace the placeholder; keep `export const metadata`), optional `layout.tsx`, and `<slug>.css` (your stylesheet, imported from your page or layout).
- `src/components/worlds/<slug>/**` — your components, including `Cover.tsx` (see contract below).
- Anything else listed for you in your own brief.
Never edit shared files: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/gallery.css`, `src/components/gallery/**`, `src/lib/**`, `src/data/**`, `next.config.ts`, `package.json`. Do not add dependencies. If you need a shared change, say so in your report instead.

## Content (the truth; never invent facts, metrics, employers, testimonials, photos or skill levels)
- `src/data/personal.ts`: `personalInfo` (name, title "Full Stack Developer", location India, email, `calendarLink` cal.com, `currentProject` Beacon with blurb), `socialLinks` (GitHub, LinkedIn, X), `skills` (9 strings).
- `src/data/work.ts`: `workExperience` — Senior Software Engineer at agilon Health (Oct 2022 – Present; Groovy monolith → Spring Boot microservices, **60% performance boost**; React modules for reviewing patient conditions, **$10M revenue impact** estimated), Freelance for A1 Associates (2024; Next.js landing page; SEO to **top 5 Google results** for the company name). Phrases wrapped in `**` are highlights: render them with `src/components/Highlight.tsx` (pass your own className) or your own parser.
- `src/data/projects.ts`: `projects` — Beacon (accessibility checker, in progress, 2024, GitHub), Logbase (analytics/monitoring, 2024, GitHub + live), A1 Associates Landing Website (2024, live), The Kicks Store (sneaker e-commerce, 2022, GitHub + live). Each has techStack, description, links, status, year.
- `src/data/worlds.ts`: `getWorld(slug)` gives name, years, tagline, sound (the theme's description), href; `worlds` lists all four.
- Import from `@/data` (re-exports) or the files directly.
- Real links only: email (mailto), cal.com booking link, GitHub, LinkedIn, X, project GitHub/live links.

## Voice and structure
- Copy is Ayush talking directly to the visitor, first person, conversational, in your movement's voice (you may write new copy; facts must come from the data above). No résumé-speak.
- The hero is the movement's scene only: NEVER Ayush's name in the hero. The introduction ("I'm Ayush…") starts below the hero.
- Every room carries all of it: who I am, where I've been (work), what I can do (skills), things I've made (projects), what's next and how to reach me (Beacon as the current thing; email, cal.com, GitHub, LinkedIn, X). Your room leads with its emphasis (given in your brief) but must not drop the rest.
- The room ends on a real close: a way to reach Ayush.

## Required parts in every room
- `<WorldMount slug="<slug>" />` from `@/components/gallery/WorldMount` (music, Esc → gallery).
- An in-room navigation rebuilt in your movement's vocabulary (not a generic navbar) containing: a way back to the gallery (`WorldLink href="/"` from `@/components/gallery/WorldLink`), links to the other three rooms (`WorldLink href={w.href}`), and a sound control: `useAudio()` from `@/lib/audio/use-audio` for state (`enabled`, `playing`) and `audio.toggle()` from `@/lib/audio/manager`; the button MUST carry the `data-sound-toggle` attribute. Show the theme's description (`getWorld(slug).sound`) somewhere near it.
- Interaction sounds, sparingly, from `audio.sfx(kind)`: Bauhaus "click", Dada "stamp" / "tear", Pop "pop", Cubism "slide".
- `src/components/worlds/<slug>/Cover.tsx`: the transition INTO your room, in your room's material (replace the placeholder). Contract: `export const timing = { cover: number, reveal: number }` (ms, each ≤ 900) and `export default function Cover({ phase }: { phase: "cover" | "reveal" })`. It renders `position: fixed; inset: 0` content that animates CLOSED over the old page during "cover" (finish within timing.cover) and OPEN to reveal your room during "reveal" (within timing.reveal). It mounts fresh at "cover" and re-renders with "reveal". Keep it self-contained (put its CSS in a `<style>` tag inside it or in a CSS module); it renders on any page, so do not rely on your room stylesheet. Use your dossier's transition idea.

## Type and styling
- Fonts are already loaded as CSS variables (no preload; a face downloads only when used): `--font-archivo` (variable width: use `font-stretch` 62–125%), `--font-work`, `--font-jost`, `--font-holtwood`, `--font-abril`, `--font-archivo-black`, `--font-elite`, `--font-old-standard` (400/700, italic), `--font-bodoni` (variable, italic), `--font-ultra`, `--font-anton`, `--font-familjen`, `--font-big-stencil` (variable weight), `--font-stardos` (400/700), `--font-poiret`. Use only your movement's faces. Tailwind has matching utilities (e.g. `font-archivo`, `font-old-standard`).
- Prefix your CSS classes (bh-, dd-, pp-, cb-). Scope global-ish rules (`::selection`, scrollbar, body background) to `html[data-world="<slug>"]` (WorldMount sets it). Set your page background on your root element too, because the html background is the gallery's dark wall.
- `gsap` 3.13 is installed if you need timeline choreography; CSS and small hooks are usually enough. Inline SVG for all art (no raster images exist; do not fetch any). Icons: authored SVG; `lucide-react` is installed if a plain icon is ever needed (rarely appropriate here).

## Craft floor (non-negotiable)
- BAN: no kicker/eyebrow label above a heading. Let headings speak.
- No section numbers (01/02/03) unless the content is truly a sequence. No gradient text, no glassmorphism, no generic same-size icon cards, no soft rounded SaaS UI, no centred hero-headline-plus-buttons template.
- Body text: 16px+, measure 65–75ch, contrast ≥ 4.5:1 (large text ≥ 3:1). Text stays readable over any art.
- Motion: movement-native, orchestrated, not one identical fade-up on every section. Content visible by default (no content that depends on JS to appear). `prefers-reduced-motion: reduce` gets the settled state.
- States: hover, focus-visible (themed, never removed), active/pressed, and empty/fallback where relevant. Theme `::selection`, focus rings, link underlines, scrollbar.
- Phones are first-class: everything works at 390px wide with touch (no hover-only information). No horizontal page scroll unless it is a deliberate, contained scroller.
- Semantics: one `<h1>` per page (not the name in the hero; it can be the intro), landmarks, real links/buttons, alt text or aria-hidden on decorative SVG.
- Performance: no layout thrash on scroll (use IntersectionObserver / rAF), no huge DOM; animations on transform/opacity/clip-path/mask where possible.

## Verify (you have no browser of your own; use the script)
- The dev server is ALREADY running at http://localhost:3000 (the user's; it hot-reloads). Never start another server and never run `next build` (it would collide).
- Typecheck: `npx tsc --noEmit -p .`; lint: `npx eslint <your files>`.
- Screenshots: `node --experimental-websocket /private/tmp/claude-501/-Users-ayushmaurya-Projects-devayu/2192c470-10ba-4552-9aae-ea3630200930/scratchpad/snap.mjs <plan.json>` with a plan like:
  `{ "width": 1440, "height": 900, "shots": [ { "url": "http://localhost:3000/<slug>", "load": 4000, "steps": [ {"wait": 1500, "snap": "<slug>-top.png"}, {"scroll": 900}, {"wait": 800, "snap": "<slug>-2.png"}, {"hover": ".some-selector"}, {"wait": 500, "snap": "<slug>-hover.png"}, {"eval": "document.title"}, {"wait": 300, "full": true, "snap": "<slug>-full.png"} ] } ] }`
  Steps run in order within a step object as: wait → eval → hover/click/move → key → scroll → snap, so put a hover in its own step before a step that waits and snaps. `"mobile": true, "width": 390, "height": 844, "dpr": 2` for phones. `full: true` captures the whole page (cap 16000px). Screenshots save next to the script (that scratchpad folder); prefix every file with your slug. The script prints console errors at the end: fix them. Then view the PNGs with your Read tool.
- Look at desktop (1440×900) and phone (390×844), top and full page, plus key hover/interaction states. Fix what you see; two inspection rounds, then stop polishing.

## Report back (concise)
What you built (sections and their form), the micro-interactions and where they live, the Cover, files touched, screenshot paths, known gaps, and any shared change you need.
