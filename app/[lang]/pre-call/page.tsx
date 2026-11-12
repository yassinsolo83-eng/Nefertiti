import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getUi } from '@/lib/ui'

import { currentLocale, getPreCallForm, getSiteSettings } from '@/sanity/lib/queries'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import BackButton from '@/components/BackButton'
import PreCallForm from '@/components/PreCallForm'
import s from './pre-call.module.css'
import Img from '@/components/Img'

export async function generateMetadata(): Promise<Metadata> {
  const m = getUi(await currentLocale()).meta.preCall
  const settings = await getSiteSettings()
  return buildMetadata({
    seo: settings.seo.preCall,
    fallbackSeo: settings.seo.default,
    title: m.title,
    description: m.description,
    path: '/pre-call',
  })
}

export default async function PreCallPage() {
  const form = await getPreCallForm()
  const story = getUi(await currentLocale()).meta.preCall.story

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
            <Img src="/brand/journal.webp" alt="" loading="lazy" />
            <figcaption>{story}</figcaption>
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
