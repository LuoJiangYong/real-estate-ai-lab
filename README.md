# COSKY.AI real estate Ai lab

COSKY.AI 是一个面向行业构建垂直 AI 解决方案的人工智能团队，目前正在开发首个房地产行业的 AI Lab 项目，围绕 “AI for Better Living” 构建地产全场景智能工具体系，覆盖客户研究、产品策略、故事线生成与营销内容等关键环节，帮助团队更高效地理解客户、组织策略并产出高质量项目内容。

Website: [https://coskyai.com/](https://coskyai.com/)

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
- Google contact form setup: `docs/google-contact-form.md`

## Deployment

Push to the `main` branch. GitHub Actions builds the Hugo site and publishes it to GitHub Pages.

The current production domain is `coskyai.com`. DNS setup notes are in `docs/domain-setup.md`.
