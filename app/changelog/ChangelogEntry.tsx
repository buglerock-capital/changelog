import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PostFrontmatter } from '@/lib/mdx'

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
const DEFAULT_TAG_CLASS = 'bg-[#912F63]/10 text-[#912F63] border border-[#912F63]/20'

export function Tag({ name }: { name: string }) {
  const cls = TAG_CLASSES[name.toLowerCase()] ?? DEFAULT_TAG_CLASS
  return (
    <span className={`${cls} text-[10px] font-body font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider`}>
      {name}
    </span>
  )
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface Props {
  frontmatter: PostFrontmatter
  slug: string
  preview: string
}

export function ChangelogEntry({ frontmatter, slug, preview }: Props) {
  const { title, date, author, tags } = frontmatter

  return (
    <div className="flex gap-0">
      {/* Timeline column — dot + connecting line */}
      <div className="flex flex-col items-center w-7 flex-shrink-0">
        <div className="w-[11px] h-[11px] rounded-full border-2 border-berry bg-dash-bg flex-shrink-0 mt-[22px] z-10" />
        <div className="flex-1 w-px bg-card-border mt-1" />
      </div>

      {/* Card */}
      <div className="flex-1 mb-3">
        <div className="bg-white rounded-xl border border-card-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[188px_1fr]">

            {/* Left meta panel */}
            <div className="bg-card-meta border-b md:border-b-0 md:border-r border-card-border px-5 py-5">
              <p className="text-[10px] font-body font-semibold text-mid-grey uppercase tracking-widest mb-1">
                Date
              </p>
              <p className="text-[13px] text-br-charcoal font-body font-medium">
                {formatDate(date)}
              </p>
              <p className="text-[11px] text-mid-grey font-body mt-0.5">{author}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Tag key={tag} name={tag} />
                ))}
              </div>
            </div>

            {/* Right: title + preview + read more */}
            <div className="px-6 py-5">
              <Link href={`/changelog/${slug}`}>
                <h2 className="font-display text-[21px] font-bold text-plum hover:text-berry transition-colors leading-snug">
                  {title}
                </h2>
              </Link>
              {preview && (
                <p className="text-[13px] text-br-charcoal font-body mt-2 line-clamp-2 leading-relaxed">
                  {preview}
                </p>
              )}
              <Link
                href={`/changelog/${slug}`}
                className="inline-flex items-center gap-1.5 mt-3 text-[12px] text-berry font-body font-semibold hover:gap-3 transition-all duration-150"
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
