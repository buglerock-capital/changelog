'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const TAG_ACTIVE: Record<string, string> = {
  new:         'bg-emerald-500 text-white border-emerald-500',
  fix:         'bg-rose-500 text-white border-rose-500',
  improvement: 'bg-blue-500 text-white border-blue-500',
  performance: 'bg-amber-500 text-white border-amber-500',
  security:    'bg-orange-500 text-white border-orange-500',
  breaking:    'bg-red-600 text-white border-red-600',
  deprecated:  'bg-slate-500 text-white border-slate-500',
  internal:    'bg-[#3E3452] text-white border-[#3E3452]',
}
const DEFAULT_ACTIVE = 'bg-[#912F63] text-white border-[#912F63]'

interface Props {
  allTags: string[]
  resultCount: number
  totalCount: number
}

export function ChangelogFeed({ allTags, resultCount, totalCount }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTags = new Set(
    (searchParams.get('t') ?? '').split(',').filter(Boolean)
  )

  const toggle = (tag: string) => {
    const next = new Set(activeTags)
    next.has(tag) ? next.delete(tag) : next.add(tag)
    const params = new URLSearchParams(searchParams.toString())
    if (next.size > 0) {
      params.set('t', [...next].join(','))
    } else {
      params.delete('t')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clear = () => {
    router.replace(pathname, { scroll: false })
  }

  if (allTags.length === 0) return null

  return (
    /* Filter card — white card like the dashboard's filter row */
    <div className="bg-white rounded-xl border border-card-border shadow-sm px-5 py-4 mb-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-[10px] font-body font-semibold text-mid-grey uppercase tracking-widest mr-1">
          Filter
        </span>

        {allTags.map((tag) => {
          const isActive = activeTags.has(tag)
          const activeCls = TAG_ACTIVE[tag] ?? DEFAULT_ACTIVE
          return (
            <button
              key={tag}
              onClick={() => toggle(tag)}
              className={`text-[11px] font-body font-semibold px-3 py-1 border rounded-lg uppercase tracking-wider transition-all ${
                isActive
                  ? activeCls
                  : 'bg-card-meta text-br-charcoal border-card-border hover:border-berry hover:text-berry'
              }`}
            >
              {tag}
            </button>
          )
        })}

        {activeTags.size > 0 && (
          <>
            <button
              onClick={clear}
              className="text-[11px] font-body text-mid-grey hover:text-berry ml-1 underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
            <span className="text-[11px] font-body text-mid-grey ml-auto">
              {resultCount} of {totalCount} {totalCount === 1 ? 'entry' : 'entries'}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
