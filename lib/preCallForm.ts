import type { Locale } from '@/lib/i18n'

// ── Pre-Call Form ──
// Built-in version of the form. The website uses it until a "Pre-Call Form"
// document is published in the Studio (Import Defaults copies it there).

export type PreCallQuestionType =
  | 'name'
  | 'email'
  | 'shortText'
  | 'longText'
  | 'url'
  | 'single'
  | 'multiple'

export type PreCallQuestion = {
  _key: string
  label: string
  type: PreCallQuestionType
  help?: string
  placeholder?: string
  options?: string[]
  allowOther?: boolean
  required?: boolean
}

export type PreCallStep = {
  _key: string
  title: string
  description?: string
  questions: PreCallQuestion[]
}

export type PreCallForm = {
  eyebrow: string
  title: string
  intro: string
  submitLabel: string
  successTitle: string
  successText: string
  successSignature: string
  notificationEmail?: string
  steps: PreCallStep[]
}

const q = (
  _key: string,
  label: string,
  type: PreCallQuestionType,
  extra: Partial<PreCallQuestion> = {},
): PreCallQuestion => ({ _key, label, type, required: false, ...extra })

export const defaultPreCallForm: PreCallForm = {
  eyebrow: 'PRE-CALL FORM',
  title: 'Share your retreat vision',
  intro:
    'Thank you for your interest in creating a retreat in Egypt with Nefertiti Luxury Retreat Producer.\n\n' +
    'This short form helps us understand your vision, your community and the type of experience you would like to create before our call.\n\n' +
    'We don’t offer fixed retreat packages. Every experience is designed around your audience, your goals and the atmosphere you want your guests to feel.',
  submitLabel: 'Send my answers',
  successTitle: 'Thank you for sharing your retreat vision with us.',
  successText:
    'We’ll review your answers before our conversation so we can make the call as useful and personal as possible.\n\n' +
    'At Nefertiti, we believe the best retreats begin with understanding the people behind them.\n\n' +
    'You bring your community. We handle Egypt.',
  successSignature: '— Nefertiti Luxury Retreat Producer',
  steps: [
    {
      _key: 'step-about',
      title: 'About you',
      description: 'A little about you and your work.',
      questions: [
        q('q-name', 'Your name', 'name', { required: true }),
        q('q-email', 'Email address', 'email', { required: true }),
        q('q-brand', 'Business / brand / community name', 'shortText'),
        q('q-website', 'Website or social media', 'url', { placeholder: 'https:// or @handle' }),
        q('q-work', 'How would you describe your work?', 'multiple', {
          options: [
            'Wellness coach',
            'Yoga teacher',
            'Therapist',
            'Retreat leader',
            'Community founder',
            'Travel community',
            'Women’s community',
            'Creative / writing facilitator',
            'Personal development coach',
            'Corporate / wellbeing professional',
          ],
          allowOther: true,
        }),
      ],
    },
    {
      _key: 'step-community',
      title: 'Experience & community',
      description: 'Your retreat experience and the people you plan to bring.',
      questions: [
        q('q-hosted', 'Have you hosted a retreat before?', 'single', {
          options: ['Yes, several', 'Yes, once or twice', 'No, this would be my first', 'I currently run retreats regularly'],
        }),
        q('q-for', 'Who is the retreat for?', 'longText', {
          help: 'Please tell us about your audience or community, including age range, interests and anything important we should understand about them.',
        }),
        q('q-community', 'Do you already have a community or audience you plan to invite?', 'single', {
          options: [
            'Yes, I have an established community',
            'Yes, but it is still growing',
            'I have an email/newsletter audience',
            'I have a social media audience',
            'I will be building the audience specifically for this retreat',
            'Not yet',
          ],
        }),
        q('q-audience-size', 'Approximately how large is your current audience/community?', 'shortText'),
      ],
    },
    {
      _key: 'step-vision',
      title: 'Your retreat vision',
      description: 'The heart of the experience you want to create.',
      questions: [
        q('q-retreat', 'Tell us briefly about the retreat you would like to create in Egypt.', 'longText', { required: true }),
        q('q-feel', 'What would you like your guests to feel or experience by the end of the retreat?', 'longText'),
        q('q-atmosphere', 'What kind of atmosphere are you looking for?', 'multiple', {
          options: [
            'Rest and relaxation',
            'Connection and community',
            'Wellness',
            'Personal transformation',
            'Creativity',
            'Adventure',
            'Culture',
            'Luxury',
            'Nature',
            'Spiritual reflection',
            'Celebration',
          ],
          allowOther: true,
        }),
        q('q-success', 'What would make this retreat feel truly successful for you?', 'longText'),
      ],
    },
    {
      _key: 'step-logistics',
      title: 'Dates & destination',
      description: 'Group size, timing and where in Egypt.',
      questions: [
        q('q-group', 'What group size are you considering?', 'single', {
          options: ['8–12', '13–20', '21–30', '30+', 'Not decided yet'],
        }),
        q('q-when', 'When would you ideally like to host the retreat?', 'shortText', {
          help: 'If your dates are flexible, please tell us.',
          placeholder: 'e.g. March 2027, flexible',
        }),
        q('q-nights', 'How many nights are you considering?', 'single', {
          options: ['3–4 nights', '5–6 nights', '7 nights', '8+ nights', 'Not decided yet'],
        }),
        q('q-destination', 'Which type of destination interests you most?', 'multiple', {
          options: [
            'Red Sea / beach',
            'Cairo & Giza',
            'Desert',
            'Siwa',
            'Luxor',
            'Aswan',
            'Nile journey',
            'Countryside / farm retreat',
            'Multi-destination experience',
            'I’d like Nefertiti to recommend the best option',
          ],
        }),
      ],
    },
    {
      _key: 'step-support',
      title: 'Support & budget',
      description: 'What you would like us to take care of.',
      questions: [
        q('q-elements', 'Which elements would you like us to potentially include?', 'multiple', {
          options: [
            'Accommodation',
            'Airport transfers',
            'Private transport',
            'Full-board meals',
            'Wellness practitioners',
            'Yoga / meditation spaces',
            'Spa / hammam',
            'Private boat experience',
            'Cultural experiences',
            'Desert experiences',
            'Local workshops',
            'Private dining',
            'Photography / videography',
            'Welcome gifts',
            'Branding / retreat materials',
            'On-site retreat management',
          ],
          allowOther: true,
        }),
        q('q-role', 'What role would you like to personally play during the retreat?', 'single', {
          options: [
            'I will lead all sessions myself',
            'I will host the community but need facilitators',
            'I will bring my own facilitator team',
            'I need Nefertiti to help source practitioners',
            'A combination',
          ],
        }),
        q('q-support', 'What level of support are you looking for?', 'single', {
          options: [
            'Consultation and destination guidance',
            'Retreat design and planning',
            'Full retreat production',
            'Full production + on-ground management',
            'I’m not sure yet',
          ],
        }),
        q('q-budget', 'What is your estimated budget range per participant?', 'single', {
          help: 'This helps us recommend realistic destinations and experience levels.',
          options: ['Under €1,000', '€1,000–€1,500', '€1,500–€2,500', '€2,500+', 'Not decided yet'],
        }),
      ],
    },
    {
      _key: 'step-final',
      title: 'Final details',
      description: 'Almost there.',
      questions: [
        q('q-challenge', 'What is your biggest concern or challenge in making this retreat happen?', 'longText'),
        q('q-source', 'How did you hear about Nefertiti Luxury Retreat Producer?', 'single', {
          options: ['Facebook', 'Instagram', 'LinkedIn', 'Referral', 'Retreat community/group', 'Google', 'Partner'],
          allowOther: true,
        }),
        q('q-else', 'Is there anything else you would like us to know before our call?', 'longText'),
        q('q-ready', 'Are you ready to schedule a short discovery call?', 'single', {
          options: ['Yes', 'I still have a few questions', 'I’m just exploring possibilities at the moment'],
        }),
      ],
    },
  ],
}


// ── Italian version of the built-in form (same keys and order as the English one) ──
type QuestionText = { label: string; help?: string; placeholder?: string; options?: string[] }
const itQuestions: Record<string, QuestionText> = {
  'q-name': { label: 'Il tuo nome' },
  'q-email': { label: 'Indirizzo email' },
  'q-brand': { label: 'Nome della tua attività / brand / community' },
  'q-website': { label: 'Sito web o social media', placeholder: 'https:// oppure @nomeutente' },
  'q-work': {
    label: 'Come descriveresti il tuo lavoro?',
    options: [
      'Coach del benessere', 'Insegnante di yoga', 'Terapeuta', 'Guida di ritiri', 'Fondatore/fondatrice di una community',
      'Community di viaggiatori', 'Community femminile', 'Facilitatore creativo / di scrittura', 'Coach di sviluppo personale',
      'Professionista del benessere aziendale',
    ],
  },
  'q-hosted': {
    label: 'Hai già organizzato un ritiro?',
    options: ['Sì, diversi', 'Sì, una o due volte', 'No, sarebbe il mio primo', 'Al momento organizzo ritiri con regolarità'],
  },
  'q-for': {
    label: 'Per chi è il ritiro?',
    help: 'Raccontaci del tuo pubblico o della tua community: fascia d\'età, interessi e tutto ciò che è importante sapere su di loro.',
  },
  'q-community': {
    label: 'Hai già una community o un pubblico che pensi di invitare?',
    options: [
      'Sì, ho una community consolidata', 'Sì, ma è ancora in crescita', 'Ho un pubblico via email/newsletter', 'Ho un pubblico sui social media',
      'Costruirò il pubblico appositamente per questo ritiro', 'Non ancora',
    ],
  },
  'q-audience-size': { label: 'Quanto è grande, all\'incirca, il tuo pubblico/la tua community attuale?' },
  'q-retreat': { label: 'Raccontaci brevemente il ritiro che vorresti creare in Egitto.' },
  'q-feel': { label: 'Cosa vorresti che i tuoi ospiti sentano o vivano al termine del ritiro?' },
  'q-atmosphere': {
    label: 'Che tipo di atmosfera cerchi?',
    options: [
      'Riposo e relax', 'Connessione e community', 'Benessere', 'Trasformazione personale', 'Creatività', 'Avventura', 'Cultura', 'Lusso',
      'Natura', 'Riflessione spirituale', 'Celebrazione',
    ],
  },
  'q-success': { label: 'Cosa renderebbe questo ritiro davvero un successo per te?' },
  'q-group': { label: 'Che dimensione di gruppo stai considerando?', options: ['8–12', '13–20', '21–30', '30+', 'Non ancora deciso'] },
  'q-when': {
    label: 'Quando vorresti idealmente organizzare il ritiro?',
    help: 'Se le tue date sono flessibili, faccelo sapere.',
    placeholder: 'es. marzo 2027, flessibile',
  },
  'q-nights': { label: 'Quante notti stai considerando?', options: ['3–4 notti', '5–6 notti', '7 notti', '8+ notti', 'Non ancora deciso'] },
  'q-destination': {
    label: 'Quale tipo di destinazione ti interessa di più?',
    options: [
      'Mar Rosso / spiaggia', 'Il Cairo e Giza', 'Deserto', 'Siwa', 'Luxor', 'Assuan', 'Viaggio sul Nilo', 'Campagna / ritiro in fattoria',
      'Esperienza multi-destinazione', 'Vorrei che Nefertiti mi consigliasse l\'opzione migliore',
    ],
  },
  'q-elements': {
    label: 'Quali elementi vorresti che includessimo?',
    options: [
      'Alloggio', 'Transfer dall\'aeroporto', 'Trasporto privato', 'Pensione completa', 'Professionisti del benessere', 'Spazi per yoga / meditazione',
      'Spa / hammam', 'Esperienza in barca privata', 'Esperienze culturali', 'Esperienze nel deserto', 'Laboratori locali', 'Cene private',
      'Fotografia / video', 'Regali di benvenuto', 'Branding / materiali del ritiro', 'Gestione del ritiro sul posto',
    ],
  },
  'q-role': {
    label: 'Che ruolo vorresti ricoprire personalmente durante il ritiro?',
    options: [
      'Guiderò io tutte le sessioni', 'Ospiterò la community ma ho bisogno di facilitatori', 'Porterò il mio team di facilitatori',
      'Ho bisogno che Nefertiti mi aiuti a trovare i professionisti', 'Una combinazione',
    ],
  },
  'q-support': {
    label: 'Che livello di supporto stai cercando?',
    options: [
      'Consulenza e orientamento sulla destinazione', 'Progettazione e pianificazione del ritiro', 'Produzione completa del ritiro',
      'Produzione completa + gestione sul posto', 'Non ne sono ancora sicuro/a',
    ],
  },
  'q-budget': {
    label: 'Qual è il tuo budget stimato per partecipante?',
    help: 'Ci aiuta a consigliarti destinazioni ed esperienze realistiche.',
    options: ['Meno di 1.000 €', '1.000–1.500 €', '1.500–2.500 €', 'Oltre 2.500 €', 'Non ancora deciso'],
  },
  'q-challenge': { label: 'Qual è la tua preoccupazione o sfida principale nel realizzare questo ritiro?' },
  'q-source': {
    label: 'Come hai conosciuto Nefertiti Luxury Retreat Producer?',
    options: ['Facebook', 'Instagram', 'LinkedIn', 'Passaparola', 'Community/gruppo di ritiri', 'Google', 'Partner'],
  },
  'q-else': { label: 'C\'è altro che vorresti farci sapere prima della nostra call?' },
  'q-ready': {
    label: 'Sei pronto/a a fissare una breve call conoscitiva?',
    options: ['Sì', 'Ho ancora qualche domanda', 'Per ora sto solo esplorando le possibilità'],
  },
}
const itSteps: Record<string, { title: string; description: string }> = {
  'step-about': { title: 'Su di te', description: 'Qualcosa su di te e sul tuo lavoro.' },
  'step-community': { title: 'Esperienza e community', description: 'La tua esperienza con i ritiri e le persone che pensi di coinvolgere.' },
  'step-vision': { title: 'La visione del tuo ritiro', description: 'Il cuore dell\'esperienza che vuoi creare.' },
  'step-logistics': { title: 'Date e destinazione', description: 'Dimensione del gruppo, periodo e dove in Egitto.' },
  'step-support': { title: 'Supporto e budget', description: 'Di cosa vorresti che ci occupassimo.' },
  'step-final': { title: 'Ultimi dettagli', description: 'Ci siamo quasi.' },
}
const itFormTexts = {
  eyebrow: 'MODULO PRE-CALL',
  title: 'Condividi la visione del tuo ritiro',
  intro:
    'Grazie per l\'interesse a creare un ritiro in Egitto con Nefertiti Luxury Retreat Producer.\n\n' +
    'Questo breve modulo ci aiuta a capire la tua visione, la tua community e il tipo di esperienza che vorresti creare, prima della nostra call.\n\n' +
    'Non offriamo pacchetti di ritiro predefiniti. Ogni esperienza è progettata attorno al tuo pubblico, ai tuoi obiettivi e all\'atmosfera che vuoi far vivere ai tuoi ospiti.',
  submitLabel: 'Invia le mie risposte',
  successTitle: 'Grazie per aver condiviso con noi la visione del tuo ritiro.',
  successText:
    'Leggeremo le tue risposte prima del nostro confronto, per rendere la call il più utile e personale possibile.\n\n' +
    'In Nefertiti crediamo che i migliori ritiri nascano dalla comprensione delle persone che li guidano.\n\n' +
    'Tu porti la tua community. Noi ci occupiamo dell\'Egitto.',
  successSignature: '— Nefertiti Luxury Retreat Producer',
}

// The built-in form in the visitor's language. Question keys and order are the same in both.
export function defaultFormFor(locale: Locale): PreCallForm {
  if (locale !== 'it') return defaultPreCallForm
  return {
    ...defaultPreCallForm,
    ...itFormTexts,
    steps: defaultPreCallForm.steps.map((st) => ({
      ...st,
      ...(itSteps[st._key] || {}),
      questions: st.questions.map((qq) => ({ ...qq, ...(itQuestions[qq._key] || {}) })),
    })),
  }
}

// Label used for the free-text choice added by "allowOther"
export const OTHER_LABEL = 'Other'

// GROQ projection used by the page and the API
export const PRE_CALL_FORM_QUERY = `*[_id == "preCallForm"][0]{
  eyebrow, title, intro, submitLabel, successTitle, successText, successSignature, notificationEmail,
  eyebrow_it, title_it, intro_it, submitLabel_it, successTitle_it, successText_it, successSignature_it,
  steps[]{ _key, title, description, title_it, description_it,
    questions[]{ _key, label, type, help, placeholder, options, allowOther, required, label_it, help_it, placeholder_it, options_it } }
}`

const TYPES: PreCallQuestionType[] = ['name', 'email', 'shortText', 'longText', 'url', 'single', 'multiple']

// Turns the Studio document into a clean form. Empty texts keep the built-in wording;
// no published steps means the built-in questions are used.
export function normalizePreCallForm(raw: any, locale: Locale = 'en'): PreCallForm {
  const d = defaultFormFor(locale)
  if (!raw) return d
  const en = defaultPreCallForm
  // On Italian pages, a Studio text that is still the built-in English one shows in Italian
  const text = (v: unknown, fallback: string, english?: string) => {
    const t = typeof v === 'string' ? v.trim() : ''
    if (!t) return fallback
    return locale === 'it' && english !== undefined && t === english ? fallback : t
  }
  const enSteps = new Map(en.steps.map((st) => [st._key, st]))
  const enQuestions = new Map(en.steps.flatMap((st) => st.questions).map((qq) => [qq._key, qq]))
  const itSameQuestion = (key: string) => d.steps.flatMap((st) => st.questions).find((qq) => qq._key === key)

  const steps: PreCallStep[] = (Array.isArray(raw.steps) ? raw.steps : [])
    .map((s: any, si: number) => ({
      _key: String(s?._key || `step-${si}`),
      title: text(s?.title, locale === 'it' ? itSteps[String(s?._key)]?.title || `Step ${si + 1}` : `Step ${si + 1}`, enSteps.get(String(s?._key))?.title),
      description:
        typeof s?.description === 'string'
          ? locale === 'it' && s.description === enSteps.get(String(s?._key))?.description
            ? itSteps[String(s?._key)]?.description || s.description
            : s.description
          : '',
      questions: (Array.isArray(s?.questions) ? s.questions : [])
        .filter((qq: any) => qq && typeof qq.label === 'string' && qq.label.trim())
        .map((qq: any, qi: number) => {
          const type: PreCallQuestionType = TYPES.includes(qq.type) ? qq.type : 'shortText'
          const choice = type === 'single' || type === 'multiple'
          const key = String(qq._key || `${si}-${qi}`)
          const base = enQuestions.get(key)
          const it = locale === 'it' ? itSameQuestion(key) : undefined
          const same = (v: unknown, english: unknown) => JSON.stringify(v ?? '') === JSON.stringify(english ?? '')
          const options: string[] = choice ? (Array.isArray(qq.options) ? qq.options.filter((o: unknown) => typeof o === 'string' && o.trim()) : []) : []
          return {
            _key: key,
            label: it && qq.label.trim() === base?.label ? it.label : qq.label.trim(),
            type,
            help: typeof qq.help === 'string' ? (it && qq.help === base?.help ? it.help || qq.help : qq.help) : '',
            placeholder: typeof qq.placeholder === 'string' ? (it && qq.placeholder === base?.placeholder ? it.placeholder || qq.placeholder : qq.placeholder) : '',
            options: it && same(options, base?.options) && it.options ? it.options : options,
            allowOther: choice && !!qq.allowOther,
            required: !!qq.required,
          } as PreCallQuestion
        }),
    }))
    .filter((s: PreCallStep) => s.questions.length > 0)

  return {
    eyebrow: text(raw.eyebrow, d.eyebrow, en.eyebrow),
    title: text(raw.title, d.title, en.title),
    intro: text(raw.intro, d.intro, en.intro),
    submitLabel: text(raw.submitLabel, d.submitLabel, en.submitLabel),
    successTitle: text(raw.successTitle, d.successTitle, en.successTitle),
    successText: text(raw.successText, d.successText, en.successText),
    successSignature: typeof raw.successSignature === 'string' ? raw.successSignature : d.successSignature,
    notificationEmail: typeof raw.notificationEmail === 'string' ? raw.notificationEmail.trim() : '',
    steps: steps.length ? steps : d.steps,
  }
}

// ── Answer checks, shared by the browser (per step) and the API (whole form) ──

export type PreCallAnswer = string | string[]
export type PreCallAnswers = Record<string, PreCallAnswer>
// Text typed into the "Other" box, stored as answers[`${key}__other`]
export const otherKey = (key: string) => `${key}__other`

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isAnswered(q: PreCallQuestion, answers: PreCallAnswers) {
  const v = answers[q._key]
  if (Array.isArray(v)) return v.length > 0
  return typeof v === 'string' && v.trim() !== ''
}

export type PreCallMessages = { choose: string; required: string; email: string; other: string }
export const englishMessages: PreCallMessages = {
  choose: 'Please choose an option.',
  required: 'This question is required.',
  email: 'Please enter a valid email address.',
  other: 'Please tell us what "Other" means for you.',
}

export function validateQuestion(q: PreCallQuestion, answers: PreCallAnswers, m: PreCallMessages = englishMessages): string | null {
  const v = answers[q._key]
  const other = answers[otherKey(q._key)]
  if (q.required && !isAnswered(q, answers)) {
    return q.type === 'single' || q.type === 'multiple' ? m.choose : m.required
  }
  if (q.type === 'email' && typeof v === 'string' && v.trim() && !EMAIL_RE.test(v.trim())) {
    return m.email
  }
  const pickedOther = Array.isArray(v) ? v.includes(OTHER_LABEL) : v === OTHER_LABEL
  if (q.allowOther && pickedOther && !(typeof other === 'string' && other.trim())) {
    return m.other
  }
  return null
}
