import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getPreCallForm, getSiteSettings } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import PreCallForm from '@/components/PreCallForm'
import s from './pre-call.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    fallbackSeo: settings.seo.default,
    title: 'Pre-Call Form — Share Your Retreat Vision',
    description:
      'Tell us about your community and the retreat you would like to create in Egypt, so we can make our discovery call as useful and personal as possible.',
    path: '/pre-call',
  })
}

export default async function PreCallPage() {
  const form = await getPreCallForm()

  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className={s.layout}>
        <aside className={s.intro}>
          <BackButton />
          <p className="eyebrow">◆ {form.eyebrow}</p>
          <h1 className={s.title}>{form.title}</h1>
          {form.intro.split(/\n{2,}/).map((p, i) => (
            <p key={i} className={s.introText}>{p}</p>
          ))}
          <figure className={s.introFigure}>
            <img src="/brand/journal.webp" alt="" loading="lazy" />
            <figcaption>Tell us your story.</figcaption>
          </figure>
        </aside>

        <div className={s.formCol}>
          <PreCallForm form={form} />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
