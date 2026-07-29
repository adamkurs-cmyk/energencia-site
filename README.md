# Energencia website — starter kit

This folder is the backbone of your site. It already contains your brand, so Claude Code can build
on-brand from the first line. You don't need to touch any code by hand.

## What's in here

- `CLAUDE.md` — the brief. Claude Code reads this automatically and follows your brand rules and the
  training-first structure.
- `tokens.css` — your colours, fonts, type sizes, spacing and button styles. The single source of
  truth. Change a value here and the whole site updates.
- `index.html` — a starter homepage, already wired to your fonts and tokens, with every section
  laid out as a placeholder for Claude Code to build.
- `assets/` — your logo files and favicon.

## How to use it (no coding needed)

1. Install the **Claude Code desktop app** (Mac, Windows or Linux) and sign in with your Claude
   account. Setup: https://docs.claude.com/en/docs/claude-code
2. Open **this folder** (`energencia-site`) in Claude Code.
3. Ask it to set up version history first: *"Set up git so we can undo changes."*
4. Preview the starter: *"Open index.html in a preview so I can see it."* You should see your yellow
   logo, the lockup, and the section placeholders.
5. Build section by section, top to bottom. Example prompts:
   - *"Build out the Hero using the offset lockup. I'll give you the headline."*
   - *"Now build The Training section as a clean list of modules with dates and price."*
   - *"Style the mobile menu."*
6. Give Claude Code your own written copy when it asks. It will use placeholders until you do.

## Booking

Pick one external tool (Cal.com or Calendly for 1:1, Fresha or an application form for the training),
copy the link or embed code from its dashboard, and tell Claude Code:
*"Point the Enrol button at this link"* or *"Embed this booking snippet in the Enrol section."*

## Going live

When you're happy, drag this folder onto **Netlify Drop** (https://app.netlify.com/drop) for a free
live URL in seconds. Later, buy a domain (energencia.es or .com) and point it at Netlify. Claude Code
can walk you through connecting the domain when you're ready.

## The one rule

Keep everything reading from `tokens.css`. If you ever want to change a colour or size, change it
there, once, and it updates everywhere.
