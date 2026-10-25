# Bauhaus (1919–1933): research dossier, condensed

Sources: Bauhaus Kooperation works database, Bauhaus-Archiv, Harvard Art Museums, bauhaus-bookshelf.org (all 14 Bauhausbücher), fontsinuse "Typefaces at the Bauhaus", Tate Papers 08 (Light Prop), Goethe-Institut, Cooper Hewitt, MoMA.

## Heart → page rules
- Form follows function / Sachlichkeit: no shape without a job. A circle is a bullet, status light or button; a bar is a divider or heading anchor.
- Vorkurs: build the UI from a tiny kit (point, line, plane; circle, square, triangle); complexity only from combination. Albers' paper folding.
- Kunst und Technik, eine neue Einheit (1923): one system for type, layout, motion, cursor, sound. Motion looks engineered: rods, hinges, rails, pulleys. No blobs.
- Workshops: map content to workshops (intro = stage, work = print shop, skills = weaving/toys, projects = metal workshop).
- Standardisation: DIN 476 (1922), √2 ratio (1:1.414) drives cards and frames.
- Elementare Gestaltung (Kandinsky, Point and Line to Plane, 1926): hierarchy from weight, size, position. No shadows, no gradients.

## Works to borrow grammar from
- Joost Schmidt, 1923 exhibition poster: diagonal cross of circles and squares (30–45°), type along the arms, red/black on paper.
- Herbert Bayer, universal alphabet (1925): lowercase only, arcs + straight lines, single-storey a/g, monoline. Letterhead "wir schreiben alles klein".
- Bayer, Kandinsky 60th birthday poster (1926): tilted photo held by a thick red bar at left edge. Photo + bar + type, nothing else.
- Bayer, "extended field of vision" (1930 Werkbund Paris): panels angled toward the viewer, eye diagram.
- Moholy-Nagy, typophoto (Bauhausbuch 8, 1925): type and image as one unit. Bauhausbücher covers: heavy bars, big numerals, solid fields.
- Moholy-Nagy, Light Prop (1930): perforated rotating discs, glass spiral, moving shadows. Film "Lichtspiel schwarz weiss grau".
- Kandinsky 1923 questionnaire: yellow triangle, red square, blue circle (a teaching nod, not law).
- Schlemmer, Triadic Ballet (1922): acts yellow / pink / black; padded geometric costumes (spirals, discs, cones, rotating skirts), motion locked to axes.
- Albers glass (Fugue, 1925): stacked horizontal/vertical bars. (Homage to the Square is post-Bauhaus; don't label it Bauhaus.)
- Breuer B3 chair (1925): open tubular frame, taut fabric planes. Model for outlines.
- Gunta Stölzl, 5 Chöre (1928): warp/weft grid of stripes and rectangles.
- Marianne Brandt MT49 tea infuser (1924): hemisphere on a cross base, disc lid, metal vs ebony.
- Alma Siedhoff-Buscher, Small Ship-Building Game (1923): 22 painted wooden pieces (arches, cubes, triangles, cylinder, sticks) in red, yellow, blue, green, white.
- Dessau building (1925–26): pinwheel plan, glass curtain wall, BAUHAUS lettered vertically.

## Type
House face was a wide semibold grotesk (Breite halbfette Grotesk); Futura only from 1927. Practice: lowercase only, heavy black/red bars, vertical/diagonal text, flush-left asymmetric, big numerals, no centred symmetric titles.
Google Fonts: **Archivo** (variable width; expanded + semibold/bold = breite halbfette Grotesk; Archivo Black for poster weight), **Work Sans** (body), **Jost** (sparingly: nav, numerals). Draw hero letterforms as SVG arcs/lines in Bayer's manner where a drawn word is needed.

## Colour
Paper #EDE7D9 / buff #E4DCC8 / grey card #D9D6CF. Ink #161514, grey rule #8A8781. Vermilion #D0331F (workhorse), cadmium yellow #F0B419, ultramarine #1E3C8C; rare green #2E7D4F, Schlemmer pink #E7A9B4.
Proportion ≈ 65% paper, 20% black, 10% red, 5% yellow+blue. Mostly red + black on paper; full triad only for stage/intro, colour questionnaire, toys/skills. Flat hard-edged fields; overlaps multiply like overprinting. Light (Light Prop) is the only place grey gradients/shadows appear.

## Composition
Asymmetric grid on a strong axis rotated 15/30/45°. Heavy bars anchor text. Circles as focal stops. Arrows direct the eye. Cut-out photomontage with type along edges. Lots of empty paper; every element touches an axis or bar.
Layout ideas: intro as the 1923 poster (diagonal cross axis, lowercase text along one arm, links at arm ends); work as a shelf of Bauhausbücher (√2 cards, huge year numerals, black top bar, red role block, coloured spines); skills as Stölzl loom draft or the ship-building kit; projects as Bayer's tilted panels that turn to face you on hover with a red arrow to the active one; contact as a Brandt object (hemisphere + cross base, disc lid closes on send).

## Motion (mechanical, quantised; cam-like ease, hard stops, visible pivots; no floaty springs)
1. Poster assembly entry: bars, then circles, then type slide on straight rails, ~80ms stagger, 300–450ms, sharp ease-out, hard stop.
2. Triadic transition: a Schlemmer shape (disc, spiral cone, bell skirt) crosses the screen rotating in 90° steps (4 steps ≈ 600ms), wipes to the next view, colour yellow → pink → black.
3. Light-play loader (Hirschfeld-Mack): triangle/square/circle stencils slide behind a translucent screen, multiply-blended, ~1.2s phrases.
4. Light Prop cursor: small perforated disc, ~6s/turn, faint drifting shadow; speeds up over links.
5. Brandt hinge button: disc lid hinges ~20° on a visible pivot (120ms in / 180ms out, linear); red square marks engaged.
6. Kandinsky hover: nav marker morphs triangle/square/circle and snaps to yellow/red/blue, 200ms.
7. Link hover: thick red bar extends from left (180ms ease-out); on leave retracts to the right.
8. Loom shuttle: scroll weaves weft bands row by row.
9. Albers fold: cards unfold from a zigzag pleat, 3–4 panels hinge in sequence (100ms each).
10. Bauspiel stacking: blocks drop, fast fall, ~2px settle, no bounce; draggable, snap to grid.
11. Diagonal tilt in fixed steps (0/15/30°), never continuous mouse tilt.
12. Dessau façade: vertical label rises letter by letter while curtain-wall cells light 40ms apart.
Reduced motion: instant state changes plus a colour flash.

## Clichés to avoid
Primary-colour confetti; pure white and #FF0000/#FFFF00/#0000FF; Futura, Bauhaus 93/ITC Bauhaus as "the Bauhaus font"; centred symmetric layouts; Mondrian grids (De Stijl); soft bounces, glass, drop shadows, rounded cards; capitals in headings (lowercase is the tell); Homage to the Square as Bauhaus; decoration for its own sake.
