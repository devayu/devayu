# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primarily Ayush himself. The site is a personal identity piece first; career outcomes are a bonus, not the goal. The people who land on it are whoever finds the link (recruiters, clients, peers, friends), and none of them is the design target.

## Product Purpose

devayu is Ayush Maurya's personal portfolio. It tells the visitor who Ayush is through the games that define him. Gaming is central to his identity, so the site presents the same person inside four game worlds he loves, chosen from a start screen like a character select.

Success: the visitor leaves remembering him. No specific action (call, email, repo visit) is required for a visit to count as a success, though those paths stay available.

## Positioning

The portfolio is a set of playable worlds, not a page. Each world borrows the signature mechanics of its game (not just its look) to present the same real content: who Ayush is, what he has built, where he has worked, and how to reach him.

## Operating Context

- Visitors arrive from a shared link on desktop or phone.
- Entry is a "press any key" title screen, then a world select. Esc returns to the select screen from any world.
- Sound is part of the experience: each world has a soundtrack, previewed on hover in the select screen and continued into the world.
- A Notion database feeds a separate "Fragments" page of collected thoughts, quotes and images.

## Capabilities and Constraints

- Next.js 16 (App Router), React 19, Tailwind CSS 4. Content lives in `src/data/` (projects, work, personal, worlds) and is shared by every world.
- Worlds: Noir (Max Payne 2), Frontier (Red Dead Redemption 2), Night City (Cyberpunk 2077 and Deus Ex), Yōtei (Ghost of Yōtei and Ghost of Tsushima, with Atsu and Jin variants).
- Soundtracks play only through YouTube's embedded player (video ids in `src/data/worlds.ts`); they are never downloaded or re-hosted. YouTube requires the player to stay visible while it plays. Generative Web Audio themes are the fallback when a video cannot embed.
- Fragments needs `NOTION_TOKEN` and `NOTION_DB_ID`; without them the page shows its empty state.
- Must work well on phones.
- No game logos, screenshots or copyrighted assets; all art is original SVG/CSS. Game names appear only as "inspired by" credits.

## Brand Commitments

- Name: Ayush Maurya. Handle: devayu. Seal: 歩 ("ayu(mu)", to walk).
- Voice: first person, conversational, as if Ayush is talking directly to the visitor and telling them who he is.
- Hero sections show only the scene; the name and introduction start below the hero.
- Each world's mechanics come from its game (for example bullet time, Dead Eye, Breach Protocol, the Yōtei Six sash, haiku composing, Kurosawa mode).

## Evidence on Hand

- Projects (`src/data/projects.ts`): Beacon (accessibility checker, in progress), Logbase (analytics and monitoring), A1 Associates landing site, The Kicks Store (e-commerce).
- Work (`src/data/work.ts`): Senior Software Engineer at agilon Health, Oct 2022 to present (Groovy-to-Spring Boot migration with a 60% performance boost; React modules with an estimated $10M revenue impact). Freelance for A1 Associates, 2024 (SEO work reaching the top 5 Google results for the company name).
- Skills list (`src/data/personal.ts`), links to GitHub, LinkedIn, X, email and a cal.com booking page.
- Absent, and not to be fabricated: testimonials, client logos, skill levels or percentages, photos of Ayush, metrics beyond those above.

## Product Principles

1. Identity over conversion: every choice should make the visitor feel who Ayush is, not funnel them toward a CTA.
2. Mechanics, not skins: a world earns its place by using what its game is famous for.
3. One person, many worlds: every world tells the same true story from the same data.
4. Talk to the visitor: copy is Ayush speaking, never a résumé.
5. Phones are first-class: every world must hold up on a small screen.
