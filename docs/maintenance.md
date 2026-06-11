# Maintenance Guide

## Principles

- Keep content, layout, styling, and product data separate.
- Add new AI tools through `data/tools.yaml` first.
- Promote a tool from preview to live by adding its launch URL and page content, not by rewriting the homepage.
- Keep reusable UI in partials under `layouts/partials/`.
- Keep brand tokens in `data/design.yaml` and `assets/css/main.css`.

## Reservation Flow

The site is static, so the reservation form supports two modes:

- `data/site.yaml > reservation.endpoint` is empty: the form opens an email draft.
- `reservation.endpoint` is set: the form sends JSON to that endpoint.

Recommended endpoint:

- Google Apps Script Web App. See `docs/google-contact-form.md`.

Other possible endpoints:

- Formspree or Getform for the earliest public launch.
- Cloudflare Worker or Supabase Edge Function when COSKY.AI needs a controlled data flow.
- A Go service only when the AI tool platform needs a real backend.

## Product Expansion

Add new tools in this order:

1. Add or update the tool item in `data/tools.yaml`.
2. Add a dedicated page under `content/tools/`.
3. Add a layout only if the default tool page cannot express the product.
4. Link to the live product after access control and analytics are ready.

## Figma Sync

Use the Figma file as visual source of truth for:

- Color palette
- Typography direction
- Button and form styles
- Ribbon motion language
- Page spacing and hierarchy

When the Figma MCP limit resets, refresh screenshots and update `docs/visual-guidelines.md` before broad visual changes.
