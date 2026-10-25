# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primarily Ayush himself. The site is a personal identity piece first; career outcomes are a bonus, not the goal. The people who land on it are whoever finds the link (recruiters, clients, peers, friends), and none of them is the design target.

## Product Purpose

devayu is Ayush Maurya's personal portfolio. It presents the same person inside four art movements, Bauhaus, Dada, Pop Art and Cubism, chosen from a select screen like rooms in a gallery. Each room tells his whole story in that movement's own language.

Success: the visitor leaves remembering him. No specific action (call, email, repo visit) is required for a visit to count as a success, though those paths stay available.

## Positioning

The portfolio is a gallery of four rooms, not a page. Each room is built from its movement's real practice (its type, materials, composition and the way its art moved), not a filter over a template, and presents the same real content: who Ayush is, where he has worked, what he can do, what he has built, and how to reach him. Ambition: Awwwards-level craft, with micro-interactions that come from each movement.

## Operating Context

- Visitors arrive from a shared link on desktop or phone.
- Entry is the gallery select screen (first visit asks once whether to enter with sound). Esc returns to the gallery from any room.
- Sound is part of the experience: each movement has an original generative Web Audio theme, previewed on hover in the gallery and continued into its room. All themes share one tempo and downbeat, so moving between rooms crossfades on the beat.
- A Notion database feeds a separate "Fragments" page of collected thoughts, quotes and images.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19, Tailwind CSS 4. Content lives in `src/data/` (projects, work, personal, worlds) and is shared by every room.
- Rooms: Bauhaus (`/bauhaus`), Dada (`/dada`), Pop Art (`/pop`), Cubism (`/cubism`). Research dossiers for each live in `.impeccable/research/`.
- All sound is generated in the browser (`src/lib/audio`); no recordings are hosted.
- Fragments needs `NOTION_TOKEN` and `NOTION_DB_ID`; without them the page shows its empty state.
- Must work well on phones.
- No reproductions of artworks, artists' images or real brands; every composition is original SVG/CSS made from each movement's grammar.

## Brand Commitments

- Name: Ayush Maurya. Handle: devayu. Seal: 歩 ("ayu(mu)", to walk).
- Voice: first person, conversational, as if Ayush is talking directly to the visitor and telling them who he is.
- Hero sections show only the scene; the name and introduction start below the hero.
- Each room's interactions come from its movement (for example Bauhaus parts sliding on rails, Dada chance and rubber stamps, Pop silkscreen pulls and misregistration, Cubist planes shifting viewpoint).

## Evidence on Hand

- Projects (`src/data/projects.ts`): Beacon (accessibility checker, in progress), Logbase (analytics and monitoring), A1 Associates landing site, The Kicks Store (e-commerce).
- Work (`src/data/work.ts`): Senior Software Engineer at agilon Health, Oct 2022 to present (Groovy-to-Spring Boot migration with a 60% performance boost; React modules with an estimated $10M revenue impact). Freelance for A1 Associates, 2024 (SEO work reaching the top 5 Google results for the company name).
- Skills list (`src/data/personal.ts`), links to GitHub, LinkedIn, X, email and a cal.com booking page.
- Absent, and not to be fabricated: testimonials, client logos, skill levels or percentages, photos of Ayush, metrics beyond those above.

## Product Principles

1. Identity over conversion: every choice should make the visitor feel who Ayush is, not funnel them toward a CTA.
2. Practice, not skins: a room earns its place by working the way its movement worked.
3. One person, many rooms: every room tells the same true story from the same data.
4. Talk to the visitor: copy is Ayush speaking, never a résumé.
5. Phones are first-class: every room must hold up on a small screen.
