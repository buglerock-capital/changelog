import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPosts, getPost } from '@/lib/mdx'
import { Tag, formatDate } from '../ChangelogEntry'
import type { ReactNode, CSSProperties } from 'react'

export async function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }))
}

function BugleRockLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-berry flex items-center justify-center flex-shrink-0">
        <span className="text-white text-[17px] font-body font-bold select-none leading-none">ü</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-display font-bold text-[19px] text-plum tracking-tight leading-none">
          BugleRock
        </span>
        <span className="text-[10px] font-body font-semibold text-mid-grey uppercase tracking-[0.18em]">
          Admin
        </span>
      </div>
    </div>
  )
}

// Read width from PNG header (bytes 16–19, big-endian uint32). Returns 0 on failure.
function pngNaturalWidth(src: string): number {
  try {
    const filePath = path.join(process.cwd(), 'public', src)
    const fd = fs.openSync(filePath, 'r')
    const buf = Buffer.alloc(24)
    fs.readSync(fd, buf, 0, 24, 0)
    fs.closeSync(fd)
    // PNG signature: 0x89 0x50 0x4E 0x47
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
      return buf.readUInt32BE(16)
    }
  } catch {}
  return 0
}

function MdxImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null
  const w = pngNaturalWidth(src)
  const sizeStyle: CSSProperties = w > 0 ? { maxWidth: `${w}px` } : {}

  return (
    <figure className="my-10 not-prose mx-auto w-full" style={sizeStyle}>
      <div className="rounded-2xl overflow-hidden border border-card-border shadow-[0_4px_32px_rgba(62,52,82,0.10)] bg-card-meta">
        <img src={src} alt={alt ?? ''} className="w-full h-auto block" />
      </div>
      {alt && (
        <figcaption className="mt-3 text-center text-[12px] text-mid-grey font-body italic leading-relaxed">
          {alt}
        </figcaption>
      )}
    </figure>
  )
}

const mdxComponents = {
  img: MdxImage,
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="not-prose font-display font-bold text-[21px] text-plum mt-12 mb-5 flex items-center gap-3">
      <span className="w-[3px] h-[22px] rounded-full bg-berry flex-shrink-0 inline-block" />
      {children}
    </h2>
  ),
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ChangelogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const { title, date, author, tags } = post.frontmatter

  return (
    <main className="min-h-screen flex flex-col bg-dash-bg">

      <nav className="bg-dash-bg border-b border-card-border px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <BugleRockLogo />
          <Link
            href="/"
            className="flex items-center gap-2 text-[12px] text-mid-grey hover:text-berry transition-colors font-body font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Changelog
          </Link>
        </div>
      </nav>

      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-8 pt-14 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] text-mid-grey hover:text-berry transition-colors font-body mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All entries
          </Link>

          <h1 className="font-display font-bold text-[42px] text-plum tracking-tight leading-tight mb-5">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-card-border">
            <div className="bg-card-meta border border-card-border rounded-lg px-4 py-2.5">
              <p className="text-[10px] font-body font-semibold text-mid-grey uppercase tracking-widest mb-0.5">Date</p>
              <p className="text-[13px] text-br-charcoal font-body font-medium">{formatDate(date)}</p>
            </div>
            <div className="bg-card-meta border border-card-border rounded-lg px-4 py-2.5">
              <p className="text-[10px] font-body font-semibold text-mid-grey uppercase tracking-widest mb-0.5">Author</p>
              <p className="text-[13px] text-br-charcoal font-body font-medium">{author}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {tags.map((tag) => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 pb-16">
          <div className="bg-white rounded-2xl border border-card-border shadow-sm p-10 md:p-12">
            <div className="prose prose-slate max-w-none
              prose-headings:font-display prose-headings:text-plum
              prose-p:text-[15px] prose-p:leading-[1.8] prose-p:text-br-charcoal
              prose-a:text-berry prose-a:no-underline hover:prose-a:underline
              prose-strong:text-plum prose-strong:font-semibold
              prose-li:text-[15px] prose-li:leading-relaxed prose-li:text-br-charcoal
              prose-ul:my-5 prose-li:my-1
              prose-code:text-berry prose-code:bg-[#FAF7F4] prose-code:text-[13px] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-[#F5F1FB] prose-pre:border prose-pre:border-card-border prose-pre:rounded-xl
              prose-hr:border-card-border
            ">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12px] text-mid-grey hover:text-berry transition-colors font-body font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to all entries
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-card-border bg-dash-bg px-8 py-4 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-[11px] text-mid-grey font-body">© 2026 BugleRock. Internal use only.</span>
          <span className="text-[11px] text-muted-purple tracking-widest uppercase font-body font-light">#SoundOfClarity</span>
        </div>
      </footer>

    </main>
  )
}
