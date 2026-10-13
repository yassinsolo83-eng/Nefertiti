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

// Label used for the free-text choice added by "allowOther"
export const OTHER_LABEL = 'Other'

// GROQ projection used by the page and the API
export const PRE_CALL_FORM_QUERY = `*[_id == "preCallForm"][0]{
  eyebrow, title, intro, submitLabel, successTitle, successText, successSignature, notificationEmail,
  steps[]{ _key, title, description, questions[]{ _key, label, type, help, placeholder, options, allowOther, required } }
}`

const TYPES: PreCallQuestionType[] = ['name', 'email', 'shortText', 'longText', 'url', 'single', 'multiple']

// Turns the Studio document into a clean form. Empty texts keep the built-in wording;
// no published steps means the built-in questions are used.
export function normalizePreCallForm(raw: any): PreCallForm {
  const d = defaultPreCallForm
  if (!raw) return d
  const text = (v: unknown, fallback: string) => (typeof v === 'string' && v.trim() ? v.trim() : fallback)

  const steps: PreCallStep[] = (Array.isArray(raw.steps) ? raw.steps : [])
    .map((s: any, si: number) => ({
      _key: String(s?._key || `step-${si}`),
      title: text(s?.title, `Step ${si + 1}`),
      description: typeof s?.description === 'string' ? s.description : '',
      questions: (Array.isArray(s?.questions) ? s.questions : [])
        .filter((qq: any) => qq && typeof qq.label === 'string' && qq.label.trim())
        .map((qq: any, qi: number) => {
          const type: PreCallQuestionType = TYPES.includes(qq.type) ? qq.type : 'shortText'
          const choice = type === 'single' || type === 'multiple'
          return {
            _key: String(qq._key || `${si}-${qi}`),
            label: qq.label.trim(),
            type,
            help: typeof qq.help === 'string' ? qq.help : '',
            placeholder: typeof qq.placeholder === 'string' ? qq.placeholder : '',
            options: choice ? (Array.isArray(qq.options) ? qq.options.filter((o: unknown) => typeof o === 'string' && o.trim()) : []) : [],
            allowOther: choice && !!qq.allowOther,
            required: !!qq.required,
          } as PreCallQuestion
        }),
    }))
    .filter((s: PreCallStep) => s.questions.length > 0)

  return {
    eyebrow: text(raw.eyebrow, d.eyebrow),
    title: text(raw.title, d.title),
    intro: text(raw.intro, d.intro),
    submitLabel: text(raw.submitLabel, d.submitLabel),
    successTitle: text(raw.successTitle, d.successTitle),
    successText: text(raw.successText, d.successText),
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

export function validateQuestion(q: PreCallQuestion, answers: PreCallAnswers): string | null {
  const v = answers[q._key]
  const other = answers[otherKey(q._key)]
  if (q.required && !isAnswered(q, answers)) {
    return q.type === 'single' || q.type === 'multiple' ? 'Please choose an option.' : 'This question is required.'
  }
  if (q.type === 'email' && typeof v === 'string' && v.trim() && !EMAIL_RE.test(v.trim())) {
    return 'Please enter a valid email address.'
  }
  const pickedOther = Array.isArray(v) ? v.includes(OTHER_LABEL) : v === OTHER_LABEL
  if (q.allowOther && pickedOther && !(typeof other === 'string' && other.trim())) {
    return 'Please tell us what "Other" means for you.'
  }
  return null
}
