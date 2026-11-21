import { Download, Mail, MessageCircle } from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Img from '@/components/Img'
import styles from './CardPage.module.css'
import { getUi } from '@/lib/ui'
import type { Locale } from '@/lib/i18n'

type Props = { locale: Locale; email: string; whatsappLink?: string }

// The digital business card: both sides of the card, plus "Save contact", WhatsApp and email.
export default function CardPage({ locale, email, whatsappLink }: Props) {
  const t = getUi(locale).card
  return (
    <main className="inner-page">
      <SiteNav solid />

      <section className={styles.wrap}>
        <p className="eyebrow">◆ {t.eyebrow}</p>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.lead}>{t.lead}</p>

        <div className={styles.cards}>
          <Img className={styles.card} src="/brand/card-front.webp" alt={t.frontAlt} width={1800} height={1038} priority />
          <Img className={styles.card} src="/brand/card-back.webp" alt={t.backAlt} width={1800} height={1038} />
        </div>

        <div className={styles.actions}>
          <a className="button button-berry" href="/api/vcard" download>
            <Download size={16} /> {t.save}
          </a>
          {whatsappLink && (
            <a className="button button-ghost-dark" href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} /> {t.whatsapp}
            </a>
          )}
          <a className="button button-ghost-dark" href={`mailto:${email}`}>
            <Mail size={16} /> {t.email}
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
