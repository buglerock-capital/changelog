import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SECTIONS, getPostsForSection, getPosts, getTextPreview } from '@/lib/mdx'
import type { Post } from '@/lib/mdx'


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

function EntryCard({ post, href }: { post: Post; href: string }) {
  const preview = getTextPreview(post.content)

  return (
    <div className="flex gap-0 mb-3">
      <div className="flex flex-col items-center w-7 flex-shrink-0">
        <div className="w-[11px] h-[11px] rounded-full border-2 border-berry bg-dash-bg flex-shrink-0 mt-[22px] z-10" />
        <div className="flex-1 w-px bg-card-border mt-1" />
      </div>
      <div className="flex-1">
        <div className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[188px_1fr]">

            <div className="bg-card-meta border-b md:border-b-0 md:border-r border-card-border px-5 py-5">
              <p className="text-[10px] font-body font-semibold text-mid-grey uppercase tracking-widest mb-1">Date</p>
              <p className="text-[13px] text-br-charcoal font-body font-medium">{formatDate(post.frontmatter.date)}</p>
              <p className="text-[11px] text-mid-grey font-body mt-0.5">{post.frontmatter.author}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {post.frontmatter.tags.map((tag) => <Tag key={tag} name={tag} />)}
              </div>
            </div>

            <div className="px-6 py-5">
              <Link href={href}>
                <h2 className="font-display text-[21px] font-bold text-plum hover:text-berry transition-colors leading-snug">
                  {post.frontmatter.title}
                </h2>
              </Link>
              {preview && (
                <p className="text-[13px] text-br-charcoal font-body mt-2 line-clamp-2 leading-relaxed">{preview}</p>
              )}
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 mt-3 text-[12px] font-body font-semibold text-berry hover:gap-3 transition-all duration-150"
              >
                Read more <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const allEntries: { post: Post; href: string }[] = []
  for (const s of SECTIONS) {
    for (const post of getPostsForSection(s.slug)) {
      allEntries.push({ post, href: `/${s.slug}/${post.slug}` })
    }
  }
  for (const post of getPosts()) {
    allEntries.push({ post, href: `/changelog/${post.slug}` })
  }
  allEntries.sort(
    (a, b) => new Date(b.post.frontmatter.date).getTime() - new Date(a.post.frontmatter.date).getTime()
  )

  return (
    <main className="min-h-screen flex flex-col bg-dash-bg">
      <nav className="bg-dash-bg border-b border-card-border px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <BugleRockLogo />
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto w-full px-8">
        <div className="pt-16 pb-10 flex items-end justify-between">
          <div>
            <h1 className="font-display font-bold text-[52px] text-plum tracking-tight leading-tight">Changelog</h1>
            <p className="text-[14px] text-mid-grey mt-3 font-body">New updates and improvements.</p>
          </div>
        </div>

        <div className="pb-16">
          {allEntries.length === 0 ? (
            <div className="bg-white rounded-xl border border-card-border shadow-sm py-16 text-center">
              <p className="text-sm text-mid-grey font-body">No entries yet.</p>
            </div>
          ) : (
            allEntries.map(({ post, href }) => (
              <EntryCard key={href} post={post} href={href} />
            ))
          )}
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
