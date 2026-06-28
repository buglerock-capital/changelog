import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

export const SECTIONS = [
  {
    slug: 'email',
    label: 'Email',
    description: 'Inbox triage, smart search, drafting and sending — all from WhatsApp.',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    accentBorder: 'border-blue-200',
    accentDot: 'bg-blue-500',
    accentHover: 'hover:text-blue-700',
  },
  {
    slug: 'calendar',
    label: 'Calendar',
    description: 'Event creation, availability search and pre-meeting intelligence.',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-200',
    accentDot: 'bg-emerald-500',
    accentHover: 'hover:text-emerald-700',
  },
  {
    slug: 'phone',
    label: 'AI Phone Calling',
    description: 'Outbound AI-driven calls with context injection and post-call summaries.',
    accentBg: 'bg-violet-50',
    accentText: 'text-violet-700',
    accentBorder: 'border-violet-200',
    accentDot: 'bg-violet-500',
    accentHover: 'hover:text-violet-700',
  },
  {
    slug: 'voice',
    label: 'Voice Notes',
    description: 'Voice message transcription, summarisation and smart replies.',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    accentBorder: 'border-amber-200',
    accentDot: 'bg-amber-500',
    accentHover: 'hover:text-amber-700',
  },
  {
    slug: 'images',
    label: 'Images',
    description: 'Vision analysis, document reading and image generation via WhatsApp.',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
    accentBorder: 'border-rose-200',
    accentDot: 'bg-rose-500',
    accentHover: 'hover:text-rose-700',
  },
  {
    slug: 'legal',
    label: 'Legal Docs',
    description: 'NDA, agreements and DOCX/PDF generation from org-approved templates.',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-700',
    accentBorder: 'border-orange-200',
    accentDot: 'bg-orange-500',
    accentHover: 'hover:text-orange-700',
  },
  {
    slug: 'enterprise',
    label: 'Enterprise',
    description: 'Asana integration, Google Workspace, audit logs and monitoring.',
    accentBg: 'bg-slate-50',
    accentText: 'text-slate-700',
    accentBorder: 'border-slate-200',
    accentDot: 'bg-slate-500',
    accentHover: 'hover:text-slate-700',
  },
] as const

export type SectionSlug = (typeof SECTIONS)[number]['slug']
export type Section = (typeof SECTIONS)[number]

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((s) => s.slug === slug) as Section | undefined
}

// ---------------------------------------------------------------------------
// Post types
// ---------------------------------------------------------------------------

export interface PostFrontmatter {
  title: string
  date: string
  author: string
  tags: string[]
  coverImage?: string
  images?: string[]   // max 4 screenshots
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  content: string
}

export interface SectionSummary {
  section: Section
  count: number
  latestDate: string | null
  latestTitle: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readPostsFromDir(dir: string): Post[] {
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(dir, filename), 'utf-8')
      const { data, content } = matter(raw)
      return { slug, frontmatter: data as PostFrontmatter, content }
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
}

export function getTextPreview(content: string, maxLength = 180): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
  if (plain.length <= maxLength) return plain
  return plain.slice(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

// ---------------------------------------------------------------------------
// Section-aware API
// ---------------------------------------------------------------------------

export function getPostsForSection(section: string): Post[] {
  const dir = path.join(process.cwd(), 'content', section)
  return readPostsFromDir(dir)
}

export function getPostForSection(section: string, slug: string): Post | undefined {
  const posts = getPostsForSection(section)
  return posts.find((p) => p.slug === slug)
}

export function getSectionSummaries(): SectionSummary[] {
  return SECTIONS.map((section) => {
    const posts = getPostsForSection(section.slug)
    return {
      section,
      count: posts.length,
      latestDate: posts[0]?.frontmatter.date ?? null,
      latestTitle: posts[0]?.frontmatter.title ?? null,
    }
  })
}

// ---------------------------------------------------------------------------
// Legacy API — keeps /changelog/* working
// ---------------------------------------------------------------------------

const CHANGELOG_DIR = path.join(process.cwd(), 'content/changelog')

export function getPosts(): Post[] {
  return readPostsFromDir(CHANGELOG_DIR)
}

export function getPost(slugOrSection: string, slug?: string): Post | undefined {
  if (slug !== undefined) {
    return getPostForSection(slugOrSection, slug)
  }
  return getPosts().find((p) => p.slug === slugOrSection)
}
