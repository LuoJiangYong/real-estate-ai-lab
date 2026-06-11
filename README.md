# real estate Ai lab

COSKY.AI is building `real estate Ai lab`, a real estate AI product website and future tool gateway.

The first release is a Hugo-powered project introduction site with:

- Brand homepage based on the COSKY.AI Figma direction
- About page
- AI tools preview catalog
- Email reservation flow
- Design system and component reference page
- GitHub Pages deployment workflow

## Local Preview

Install Hugo Extended, then run:

```powershell
hugo server
```

The local site will be available at the URL printed by Hugo.

## Content Updates

- Site-wide copy: `data/site.yaml`
- AI tools catalog: `data/tools.yaml`
- Visual tokens: `data/design.yaml`
- Page content: `content/`
- Layouts and components: `layouts/`
- Styles and interaction scripts: `assets/`

## Deployment

Push to the `main` branch. GitHub Actions builds the Hugo site and publishes it to GitHub Pages.

The current production domain is `coskyai.com`. DNS setup notes are in `docs/domain-setup.md`.
