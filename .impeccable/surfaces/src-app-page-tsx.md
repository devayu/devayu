---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/components/journey"]
---

# Surface: the journey (home page)

Scope: the single scroll that replaces the four separate world pages. Visitor mode: Experience.
Audience and job: anyone with the link; success is that they remember Ayush. Content is the real data in src/data. Constraints: works on phones; soundtracks via local files or YouTube embeds only; nothing invented.
Memorable moment: scrolling between sections changes reality, one game world per part of the story.
Unresolved: whether projects should also surface in Night City; final music crossfade behaviour on YouTube.

## Direction contract

THESIS: One person, four realities, one scroll. Each game world tells exactly one part of the story and the scroll itself tears from one reality into the next. Refuses the category default of one themed page per world repeating the same bio, projects and skills.

OWN-WORLD: Each section keeps its incumbent world whole: Noir (black, rain, pale-yellow captions, Oswald and Special Elite), Frontier (sepia sunset, parchment and wood, Rye and IM Fell), Night City (black, Cyberpunk yellow slabs, cyan and magenta neon, Rajdhani and Share Tech Mono), Yōtei (snow and crimson for Atsu, gold pampas for Jin, Shippori Mincho and Zen Maru). Seams are each world's own WebGL transition shader.

STORY: Noir: who I am and the case I'm on (Beacon). Frontier: where I've been (work history, everything built). Night City: what I can do (skills as augmentations). Yōtei: what's next and you (the sash with the blank sixth name, haiku, contact). The visitor ends knowing who Ayush is and how to reach him.

FIRST VIEWPORT: After "Press any key", Noir's rain-on-glass city fills the screen edge to edge, a 3:12 AM caption at lower left, the chapter rail on the left edge naming four realities with Noir lit. No name in the hero; the typewritten "I'm Ayush." is the first thing below it. Primary action: scroll; the rail is the secondary jump.

FORM: Pinned scrollytelling with shader seams, user-pinned structure (no concept roll; the user chose this form in conversation). seed: none (unavailable)

Signature interaction: the seam. Scrolling into the next reality covers the screen with the outgoing world's shader, cuts on a chapter card in the incoming world's lettering, then uncovers the pinned hero with the incoming world's shader, fully reversible. Music follows the section.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
