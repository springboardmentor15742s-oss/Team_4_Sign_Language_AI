---
name: portfolio
description: Build or improve Chinmayee Badiger's personal portfolio website using polished prebuilt React components and design-system primitives. Use when asked to create, redesign, or refine the portfolio so it feels human-made, professional, and not AI-generated.
---

# Chinmayee Portfolio Skill

Use this skill for Chinmayee Badiger's portfolio website work. The goal is a portfolio that feels designed by a real frontend developer: calm, specific, polished, readable, and useful. Preserve existing functionality when redesigning; improve the look, interaction quality, content hierarchy, and responsiveness without deleting working features.

## Non-Negotiables

- Do not build every UI component from scratch.
- Use prebuilt component systems first, especially shadcn/ui primitives and registry components.
- Customize with CSS, Tailwind tokens, spacing, typography, and content choices so the result does not look like a default template.
- Avoid obvious AI-generated styling: giant gradients, floating blobs, decorative orbs, emoji-heavy labels, fake-perfect metrics, excessive glassmorphism, card-on-card layouts, generic "AI-powered" copy, and too many animations.
- Keep all existing portfolio functionality intact unless the user explicitly asks to remove it.
- Put changes for this project under `MEMBERS_WORK/02_Chinmayee_Badiger/portfolio`.

## Setup Commands To Use

These commands were gathered from current frontend/component/Figma MCP docs and should be copied or adapted inside the portfolio project as needed.

Install the shadcn/ui agent skill:

```bash
npx skills add shadcn/ui
```

Initialize shadcn/ui in a Vite or existing React project:

```bash
npx shadcn@latest init
```

For a new Vite portfolio project with shadcn/create style setup, use the generated command from shadcn/create or start with:

```bash
npm create vite@latest portfolio -- --template react
cd portfolio
npm install
npx shadcn@latest init
```

Add shadcn/ui components instead of hand-rolling primitives:

```bash
npx shadcn@latest add button card badge tabs sheet dialog dropdown-menu navigation-menu separator progress tooltip input textarea form avatar
```

Add React Bits components through the shadcn registry when an animation or visual flourish is actually useful:

```bash
npx shadcn@latest add @react-bits/BlurText-TS-TW
```

Connect Codex to the official Figma MCP server:

```bash
codex mcp add figma --url https://mcp.figma.com/mcp
```

After running the Figma MCP command, authenticate when prompted, then ask Codex to use Figma MCP tools for design context, screenshots, and design-to-code handoff.

## Component Strategy

Start from shadcn/ui for structure and interaction:

- Use `Button`, `Card`, `Badge`, `Tabs`, `Sheet`, `Dialog`, `NavigationMenu`, `Separator`, `Progress`, `Tooltip`, and form controls.
- Use lucide-react icons for small actions and section markers.
- Use React Bits only for one or two controlled moments, such as a restrained name reveal, project image hover, or subtle text animation.
- For special landing-page sections, inspect registries such as Magic UI, Aceternity UI, 21st.dev, Origin UI, and React Bits before writing custom layout code.
- Treat installed registry components as source code owned by the project. Adapt CSS and class names to the portfolio's visual language.

## Visual Direction

Make the portfolio feel like a personal professional site, not a generated SaaS dashboard.

- Layout: editorial but practical. Use generous whitespace, strong section rhythm, and clear scan paths.
- Color: restrained neutral base with one confident accent. Avoid one-note purple/blue gradients and beige-only palettes.
- Typography: readable, modern, and consistent. Avoid oversized headings inside small panels.
- Corners: keep cards and controls around 6px to 10px unless a component needs otherwise.
- Motion: subtle and purposeful. Use animation to guide attention, not to decorate every section.
- Imagery: include real project screenshots, interface previews, diagrams, or meaningful visual assets where available.
- Copy: specific and grounded. Prefer "Gesture recognition API", "Dataset pipeline", "Learning dashboard", and "Model evaluation" over vague claims like "innovative AI solution".

## Recommended Portfolio Structure

Use the first screen as the actual portfolio, not a marketing splash.

- Header: name, role, compact nav, resume/contact action.
- Hero: "Chinmayee Badiger" as the main signal, a concise role line, and two grounded CTAs.
- Featured work: 2-4 project cards with problem, contribution, stack, and outcome.
- Case study section: Sign Language Learning and Assessment Platform with backend, ML, dataset, and frontend contributions.
- Skills: grouped by frontend, backend, ML/data, and tools. Use badges or compact lists.
- Experience or internship timeline: concise milestones and responsibilities.
- Contact: email, GitHub/LinkedIn if available, and a simple form or direct links.

## Inspiration Notes

Borrow qualities, not entire designs:

- Linear: calm hierarchy, restrained surfaces, precise spacing.
- Vercel: crisp typography, strong project previews, minimal chrome.
- shadcn/ui examples: composed primitives, consistent tokens, accessible controls.
- React Bits: memorable interaction moments, used sparingly.
- 21st.dev/component registries: fast component sourcing through shadcn-compatible commands.
- Designer/developer portfolios: project thumbnails, case-study storytelling, and honest contribution notes.

## Redesign Checklist

Before finishing any portfolio redesign:

- Remove obvious placeholder or AI-ish copy.
- Replace emoji labels with icons or plain text.
- Keep navigation, project links, contact actions, and any existing interactive sections working.
- Check desktop and mobile layouts.
- Verify text does not overflow buttons, cards, nav, or badges.
- Run the app locally and inspect the actual rendered page, preferably with a screenshot.
- Run available lint/build commands.

## Default /goal Prompt

Use this goal when starting or continuing the portfolio work:

```text
/goal Build Chinmayee Badiger's portfolio website in MEMBERS_WORK/02_Chinmayee_Badiger/portfolio. Make it look polished, human-designed, and not AI-generated while keeping all existing functionality intact. Do not make components from scratch by default. Use prebuilt components from shadcn/ui and compatible registries such as React Bits, Magic UI, Aceternity UI, 21st.dev, or Origin UI, then customize the CSS/Tailwind styling to make it pretty and personal. Use Figma MCP when a Figma design or design inspiration is available, and use the fetched frontend skills/MCP/plugin setup commands where appropriate.
```

## Source References

- shadcn/ui skills docs: `https://ui.shadcn.com/docs/skills`
- shadcn/ui Vite installation docs: `https://ui.shadcn.com/docs/installation/vite`
- React Bits installation/docs: `https://reactbits.dev/get-started/installation`
- React Bits GitHub registry command example: `https://github.com/DavidHDev/react-bits`
- Figma MCP Codex setup docs: `https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/`
- Agent Skills quickstart: `https://agentskills.io/skill-creation/quickstart`
