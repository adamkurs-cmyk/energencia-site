# Energencia — website build brief

This file tells you (Claude Code) how to build this site. Read it fully before writing anything.
All design values live in `tokens.css`. Always style from those variables, never hard-code colours,
fonts or spacing. The logo files are in `assets/`. Adam is a designer, not a coder: explain choices
in plain language, work one section at a time, and open a preview after each change.

## What this site is

A **static** site (plain HTML + CSS + a little JS). Mobile-first, lightweight, fast, highly readable,
emotionally memorable. No framework, no build step, no database.

**Primary purpose: the sound healing facilitation TRAINING.** This is the flagship and the main
conversion goal of the whole site. Everything leads toward enrolling in the training.

Secondary: Adam's 1:1 practice (sound, Reiki, bodywork, Kobido facial massage, nervous-system
regulation). Keep this present but subordinate to the training.

**Strategic shape (important).** The model is: training first, then a studio, then selling singing
bowls and further trainings later. Build the site so it can grow into that. Right now that means a
clean training funnel, with clearly marked, easy-to-extend hooks for a future Services page and a
future Shop. Do not build the shop yet; just don't paint us into a corner.

## Audience & voice

- Audience order: internationals in Valencia first, then locals, then practitioners for the training.
- Language: English first. Structure so Spanish can be added later.
- Voice: plain, warm, slightly alternative, honest. Independent art-magazine, not wellness brand.
  Never mystical, never corporate, no overclaiming, no "woo".

## Copy rules (do not break)

- **All real copy is written by Adam.** Use clearly marked placeholders (e.g. `[[ Adam's hero line ]]`)
  for anything you don't have. Never invent testimonials, claims, prices, or outcomes.
- The training is **Adam's own program. It is NOT a Peter Hess certification** and must never be
  presented as one. (He trained in the Peter Hess method; the course he teaches is his own.)
- Client numbers: "350+ individual 1:1 clients", and group sound baths for **many more** — frame the
  group figure qualitatively, never as a made-up number.

## Brand system (all in tokens.css)

- **Fonts:** Jost (wordmark + headlines, CAPS for the wordmark), Outfit (headings, body, UI),
  DM Mono (labels, prices, nav meta, captions). All free, loaded from Google Fonts.
- **Colour:** White `#FEFDFA` ground (dominant). Ink `#14110D` text. Signal Yellow `#FFD400` (brand
  hit). Klein Blue `#1400F0` (anchor, buttons). Fluoro Pink `#FB3F9C` (spark, sparing).
  - Long text is only ever ink on white. On yellow, text is ink, never white. Never set body copy on
    blue or pink. **One accent colour per screen.**
- **Logo:** hand-drawn face, use exactly as given. Never redraw, recolour, rotate, stretch or add
  effects. `logo-face-ink.png` on light grounds, `logo-face-white.png` on dark/accent grounds,
  `logo-tile-yellow.png` for the yellow tile / avatar / favicon.
- **Lockup ratio:** wordmark cap height = one third of the mark height; clear space = one cap height.
  Three approved lockups: stacked centred, **stacked offset (preferred for the hero)**, and inline
  (for header/footer). Word stays in caps everywhere. Body text is never set in Jost.

## Page structure (single-page training landing, conversion-ordered)

This landing page IS the training page. Build `index.html` as one scrolling page with anchor nav.
The section order is a conversion sequence: each section does one job, and by the time the visitor
reaches the price they've already decided. Build them top to bottom in exactly this order. Copy is
Adam's; use marked placeholders. Draft copy for several sections lives in `training-content.md`.

1. **Header** — inline lockup left; nav right; one primary CTA button. Sticky, minimal.
2. **Hero (above the fold)** — offset lockup, one outcome-driven headline (what they'll be able to
   *do*, e.g. "Learn to hold a sound bath"), a subline naming who it's for and the difference
   (body-led, person-led, València, English), the primary CTA, and a mono fact line: next dates,
   location, early-bird price, limited spots. Must answer what is this / is it for me / what next.
3. **The transformation** — a short from → to. Where they are now (curious about sound; a yoga
   teacher or massage therapist wanting depth; a beginner) → where they'll be (confidently
   facilitating a group sound bath). Sell the outcome and feeling, not features.
4. **Who it's for (and who it's not)** — name the three audiences plainly, then a short "this isn't
   for you if" line. The honesty makes the right people feel it was written for them.
5. **What you'll learn** — the curriculum as a clear module list. Must feel substantial and specific.
   Use the module scaffold in `training-content.md` (Adam edits the wording).
6. **How it works** — logistics that remove doubt: format, total hours, dates, location, group size
   (keep it small and say so), language. Small cohort = intimate + scarce.
7. **About the guide** — the biggest lever; people buy the teacher. Adam's story, bodywork-plus-sound
   background, and his real difference (body-led, person-led, not protocol-led). Honest experience
   framing (350+ 1:1 clients; group sound baths for many more). Clear note: his own program, informed
   by the Peter Hess method but NOT a Peter Hess certification.
8. **What's included** — a tangible value stack: contact hours, materials, practice sessions,
   follow-up, a certificate of completion from Adam, small group access after. Builds value before price.
9. **Voices** — real testimonials only. Until training-specific ones exist, 1:1 client testimonials
   work here (they prove he's good with people and with sound). First names / faces with permission.
10. **Price** — only now, after they're convinced. Early bird and standard side by side, a recap of
    what's included, and the early-bird deadline as a real date. One clear number to act on.
11. **FAQ** — each answer removes a reason not to enrol: experience needed, own bowls needed,
    certification, missed sessions, refunds, what to bring. Answer the objections that come by email.
12. **Final call** — restate the promise in one line and repeat the SAME CTA with date + early-bird
    deadline. Many decide here.
13. **Footer** — stacked lockup, five-colour strip, contact, "Made in València". Quiet.

Leave two commented hooks for later growth:
`<!-- HOOK: 1:1 Services section/page -->` and `<!-- HOOK: Shop / singing bowls -->`.

## Conversion principles (apply throughout)

- **One single action, repeated.** The same CTA appears in the header, hero, after the curriculum,
  after the price, and in the final call — always identical words.
- **First-cohort framing.** The action is **"Apply"** or **"Reserve your spot"** with a short form or a
  small deposit, not instant full payment. It frames the training as selective, raises perceived
  value, and lets Adam choose who's in the room (which suits a body-led practice).
- **Scarcity, honestly.** State the small group size and the early-bird deadline as facts, never faked.
- **One accent colour per section**, with mono section numbers (01, 02, 03…) for the editorial feel.
- Keep the reading rhythm calm: white ground, ink text, colour used as punctuation.

## Booking (external, do not build it)

Booking and payments are handled by an external tool; the site only links to or embeds it. Ask Adam
which provider he picked, then place the snippet at the Enrol section. Sensible options:
Cal.com or Calendly for 1:1 sessions; for the training, an application form or a Fresha / payment
link. Default pattern: the "Enrol" button opens the provider in a new tab. If Adam gives an embed
snippet, drop it into the Enrol section instead.

## Technical

- Plain HTML + `tokens.css` (+ a small `main.css` for layout if useful, and minimal JS only if needed
  for the mobile menu / smooth scroll).
- Mobile-first. Semantic HTML, real headings, alt text on the logo and images, visible focus states.
- Keep it fast: no heavy libraries. Google Fonts + the CSS is enough.
- Deployment: static, so it can be dropped onto Netlify. Keep all paths relative.

## Legal & privacy (EU / Spain)

Fonts are self-hosted from `assets/fonts/` — never re-link to Google's font CDN directly, it sends
visitor IPs to Google before consent (a real GDPR issue, ruled on by a German court in 2022).

`legal/legal-notice.html`, `legal/privacy-policy.html`, `legal/cookies.html`, and `legal/terms.html`
are scaffolded per Spain's LSSI-CE and GDPR/LOPDGDD, linked from the footer. They're placeholder-filled
like the rest of the site's copy — **Adam must fill in his real legal name, NIF, address, and get a
Spanish gestor/abogado to sign off before the site takes real applications or payments**, especially
the consumer right-of-withdrawal wording in `terms.html`.

The site currently sets zero cookies, so no cookie-consent banner is shown (none is legally required
yet). The moment a booking tool (Cal.com/Calendly/Fresha) or any analytics is embedded, add a
consent step before that script loads, and log the new cookie in `legal/cookies.html`'s table.

## How to work with Adam

1. First confirm `tokens.css` is wired into `index.html` and the fonts load. Show the lockup rendering.
2. Then build section by section, top to bottom, previewing after each.
3. Use placeholders for copy and pause to ask for his real words where it matters.
4. Set up git at the start so any change can be undone.
