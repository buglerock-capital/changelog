import { redirect } from 'next/navigation'
import { SECTIONS } from '@/lib/mdx'

export async function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.slug }))
}

export default async function SectionPage() {
  redirect('/')
}
