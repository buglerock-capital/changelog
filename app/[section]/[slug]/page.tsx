import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getSection, getPostForSection, getPostsForSection, SECTIONS } from '@/lib/mdx'

export async function generateStaticParams() {
  const params: { section: string; slug: string }[] = []
  for (const s of SECTIONS) {
    for (const p of getPostsForSection(s.slug)) {
      params.push({ section: s.slug, slug: p.slug })
    }
  }
  return params
}

function BugleRockLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-berry flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[17px] font-body font-bold select-none leading-none">ü</span>
      </div>
      <span className="font-display font-bold text-[19px] text-plum tracking-tight leading-none">BugleRock</span>
    </div>
  )
}

const TAG_CLASSES: Record<string, string> = {
  new:         'bg-emerald-50 text-emerald-700 border border-emerald-200',
  fix:         'bg-rose-50 text-rose-700 border border-rose-200',
  improvement: 'bg-blue-50 text-blue-700 border border-blue-200',
  performance: 'bg-amber-50 text-amber-700 border border-amber-200',
  security:    'bg-orange-50 text-orange-700 border border-orange-200',
  breaking:    'bg-red-100 text-red-800 border border-red-300',
  deprecated:  'bg-slate-100 text-slate-600 border border-slate-200',
  internal:    'bg-[#3E3452]/10 text-[#3E3452] border border-[#3E3452]/20',
}
const DEFAULT_TAG = 'bg-[#912F63]/10 text-[#912F63] border border-[#912F63]/20'

function Tag({ name }: { name: string }) {
  const cls = TAG_CLASSES[name.toLowerCase()] ?? DEFAULT_TAG
  return (
    <span className={`${cls} text-[10px] font-body font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider`}>
      {name}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function ScreenshotGrid({ images }: { images: string[] }) {
  const shots = images.slice(0, 4)
  if (shots.length === 0) return null
  const gridCls = shots.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
  return (
    <div className={`grid ${gridCls} gap-3 my-8`}>
      {shots.map((src, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-card-border bg-card-meta">
          <Image src={src} alt={`Screenshot ${i + 1}`} width={600} height={400} className="w-full h-auto object-cover" />
        </div>
      ))}
    </div>
  )
}

interface Props {
  params: Promise<{ section: string; slug: string }>
}

export default async function EntryDetailPage({ params }: Props) {
  const { section: sectionSlug, slug } = await params
  if (!getSection(sectionSlug)) notFound()

  const post = getPostForSection(sectionSlug, slug)
  if (!post) notFound()

  const { title, date, author, tags, images } = post.frontmatter
  const screenshots = (images ?? []).filter(Boolean).slice(0, 4)

  return (
    <main className="min-h-screen flex flex-col bg-dash-bg">
      <nav className="bg-dash-bg border-b border-card-border px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <BugleRockLogo />
          <Link href="/" className="flex items-center gap-1.5 text-[12px] text-mid-grey hover:text-berry transition-colors font-body">
            <ArrowLeft className="w-3.5 h-3.5" /> Changelog
          </Link>
        </div>
      </nav>

      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-8 pt-14 pb-4">
          <h1 className="font-display font-bold text-[42px] text-plum tracking-tight leading-tight mb-5">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-card-border">
            <div className="bg-card-meta border border-card-border rounded-lg px-4 py-2.5">
              <p className="text-[10px] font-body font-semibold text-mid-grey uppercase tracking-widest mb-0.5">Date</p>
              <p className="text-[13px] text-br-charcoal font-body font-medium">{formatDate(date)}</p>
            </div>
            <div className="bg-card-meta border border-card-border rounded-lg px-4 py-2.5">
              <p className="text-[10px] font-body font-semibold text-mid-grey uppercase tracking-widest mb-0.5">Author</p>
              <p className="text-[13px] text-br-charcoal font-body font-medium">{author}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {tags.map((tag) => <Tag key={tag} name={tag} />)}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 pb-16">
          <div className="bg-white rounded-xl border border-card-border shadow-sm p-8 md:p-10">
            <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-plum prose-a:text-berry prose-strong:text-plum prose-code:text-berry prose-code:bg-[#FAF7F4] prose-pre:bg-[#F5F1FB] prose-pre:border prose-pre:border-card-border">
              <MDXRemote source={post.content} />
            </div>
            {screenshots.length > 0 && <ScreenshotGrid images={screenshots} />}
          </div>

          <div className="mt-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-mid-grey hover:text-berry transition-colors font-body font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Changelog
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-card-border bg-dash-bg px-8 py-4 mt-auto">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-[11px] text-mid-grey font-body">© 2026 BugleRock. Internal use only.</span>
          <span className="text-[11px] text-muted-purple tracking-widest uppercase font-body font-light">#SoundOfClarity</span>
        </div>
      </footer>
    </main>
  )
}
