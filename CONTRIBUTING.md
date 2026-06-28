# Contributing to the BugleRock Developer Portal

This guide explains exactly how to add new changelog entries to the portal. It is written to be followed precisely by a human or an AI agent with no prior context.

---

## How the portal works

The portal is a Next.js 15 app (App Router). Content lives entirely in MDX files inside the `content/` directory. There is no CMS, no database, and no admin UI — adding a new entry means adding a new `.mdx` file and pushing to GitHub. Vercel picks up the push and redeploys automatically (typically under 60 seconds).

Images are served from `public/images/`. Image display size is determined automatically at build time by reading the PNG header — no manual sizing needed.

---

## Repository structure

```
content/
├── changelog/          ← general Rocky / platform entries (most common)
├── email/              ← email triage & search features
├── calendar/           ← calendar & scheduling features
├── phone/              ← AI phone calling features
├── voice/              ← voice notes features
├── images/             ← image analysis / vision features
├── legal/              ← legal document features
└── enterprise/         ← Asana, Google Workspace, infrastructure

public/
└── images/             ← all images referenced in MDX files

app/
└── changelog/[slug]/   ← detail page renderer (do not edit for content)
```

---

## Step 1 — Choose the right section

| What the entry is about | Directory to use |
|---|---|
| Rocky desktop agent, platform-wide releases, multi-feature updates | `content/changelog/` |
| Gmail triage, email search, drafting | `content/email/` |
| Google Calendar, scheduling, availability | `content/calendar/` |
| Outbound AI calls, call summaries | `content/phone/` |
| WhatsApp voice note transcription | `content/voice/` |
| Image analysis, document reading, vision | `content/images/` |
| NDA, agreements, DOCX/PDF generation | `content/legal/` |
| Asana, Google Workspace, infra, audit logs | `content/enterprise/` |

---

## Step 2 — Create the MDX file

### File naming

```
YYYY-MM-DD-short-slug.mdx
```

Examples:
```
2026-07-01-rocky-voice-commands.mdx
2026-07-15-asana-bulk-sync.mdx
```

Rules:
- Date must match the `date` field in frontmatter
- Slug is lowercase, hyphen-separated, no special characters
- File goes inside the correct section directory from Step 1

### Frontmatter

Every MDX file must start with this frontmatter block:

```mdx
---
title: "Your entry title here"
date: "2026-07-01"
author: "Platform Team"
tags: ["new"]
---
```

**Field reference:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Shown as the entry heading on the feed and detail page |
| `date` | string | yes | ISO format `YYYY-MM-DD`. Used for sorting on the feed. |
| `author` | string | yes | Shown in the metadata bar. Use `"Platform Team"` for team releases. |
| `tags` | string[] | yes | At least one tag. See tag list below. |

**Available tags:**

| Tag | When to use |
|---|---|
| `new` | Brand new capability or feature |
| `fix` | Bug fix or correction |
| `improvement` | Enhancement to an existing feature |
| `performance` | Speed, latency, or efficiency improvement |
| `security` | Security patch or hardening |
| `breaking` | Breaking change that requires user action |
| `deprecated` | Feature being phased out |
| `internal` | Internal tooling, infrastructure, or non-user-facing change |

Multiple tags are allowed: `tags: ["new", "internal"]`

---

## Step 3 — Write the content

Content goes after the frontmatter `---` closing delimiter. Write in standard Markdown / MDX.

### Structure to follow

```mdx
One or two sentences introducing the release — what changed and why it matters.

## Section heading

Explain the feature clearly. Lead with a plain-English summary paragraph,
then use **bold** to call out the specific capability name at the start of
each feature description.

**Feature Name** does X. Give a precise, accurate description. Avoid vague
language like "improved" or "better" — say specifically what changed.

![Caption that describes exactly what the screenshot shows](/images/your-image.png)

## Next section heading

Continue with the next logical group of features.
```

### Writing rules

- The intro paragraph (before the first `##`) should be 1–3 sentences maximum
- Use `##` for section headings (renders with a Berry accent bar)
- Use `**Bold term**` at the start of a feature description, not standalone headers
- Write in plain English — no marketing fluff, no vague superlatives
- Captions must describe what the screenshot literally shows, not what it "demonstrates"
- Do not use `###` or deeper headings — the visual hierarchy only has two levels

---

## Step 4 — Add images (optional)

### Prepare the image

- Format: **PNG preferred**, JPEG accepted
- Width: any — the portal reads the PNG header at build time and renders each image at its natural pixel width, centered. Small UI screenshots stay small; full-interface shots fill the container. No manual sizing needed.
- Do not upscale screenshots — use the original capture size

### Add the image to the repo

Place the file in `public/images/`:

```
public/images/your-image-filename.png
```

Naming convention: descriptive kebab-case or the original screenshot filename. No spaces.

### Reference the image in MDX

Use standard Markdown image syntax. The alt text becomes the visible caption below the image:

```mdx
![The permission picker showing Ask for approval, Approve for me, and Full access options](/images/your-image-filename.png)
```

Rules:
- Always write a descriptive alt text — it renders as a caption and is used by screen readers
- Place the image directly after the paragraph it illustrates, not before
- Images placed inside a section appear inline in the flow at that position
- Maximum ~4 images per section keeps the page readable

---

## Step 5 — Deploy

The portal deploys automatically on every push to `main` on GitHub. No manual step needed.

```bash
git add content/changelog/2026-07-01-your-entry.mdx public/images/your-image.png
git commit -m "Add changelog: your entry title"
git push origin main
```

Vercel will rebuild and the entry will be live at `changelog.buglerockadvisors.com` within ~60 seconds.

---

## Complete example

**File:** `content/changelog/2026-07-01-rocky-voice-commands.mdx`

```mdx
---
title: "Rocky Desktop: Voice Command Input"
date: "2026-07-01"
author: "Platform Team"
tags: ["new"]
---

Rocky now accepts voice input directly from the desktop app — speak a task and Rocky begins executing it without any typing required.

## How it works

**Voice activation** is triggered by the microphone button in the composer or the keyboard shortcut `Cmd+Shift+M`. Rocky records until you release, then transcribes and executes the prompt.

**Accuracy** is handled by Whisper large-v3. Transcription happens locally on-device — audio is never sent to an external API.

![The composer with the microphone button active and a voice prompt being transcribed](/images/voice-input-active.png)

## Supported languages

**English and Hindi** are fully supported in this release. Additional languages are in progress.
```

---

## Common mistakes to avoid

| Mistake | Correct approach |
|---|---|
| Using `###` or deeper headings | Only use `##` for sections |
| Putting images before the text they relate to | Image goes after the paragraph, not before |
| Writing vague alt text like "screenshot of the app" | Describe what is literally visible in the screenshot |
| Using a date in the filename that differs from frontmatter | They must match exactly |
| Committing `.env` or secrets | Always check `git status` before committing |
| Pushing images to `public/images/[section]/` subfolders | All images go directly in `public/images/` |
