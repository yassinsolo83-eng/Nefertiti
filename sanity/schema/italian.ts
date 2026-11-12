// Italian twins of the text fields.
// Every text that visitors read gets an "Italian" field right after the English one
// (title → title_it). On the /it pages the Italian text is shown when it is filled in;
// when it is empty the site shows the English text (or its built-in Italian default).
// Names with a dot are fields inside lists, e.g. 'highlights.title'.

type AnyField = Record<string, any>

const TRANSLATABLE: Record<string, string[] | '*'> = {
  destination: ['title', 'tagline', 'feeling', 'desc', 'experiences', 'idealFor', 'overview', 'bestTime', 'fromCairo', 'highlights.title', 'highlights.desc'],
  experience: ['title', 'text'],
  partner: ['category', 'tagline', 'bio', 'services', 'location'],
  collaboration: ['country', 'description'],
  faq: ['question', 'answer'],
  serviceTier: ['name', 'description', 'features'],
  siteContent: ['heading', 'subheading', 'body', 'buttonText', 'stats.label'],
  step: ['title', 'description'],
  retreat: ['title', 'summary', 'description', 'included', 'highlights', 'itinerary.day', 'itinerary.title', 'itinerary.description'],
  testimonial: ['quote', 'role'],
  siteSettings: ['whatsappMessage', 'menuItems.label', 'appointmentServices', 'combinations'],
  pageTexts: '*',
  seo: ['metaTitle', 'metaDescription'],
  preCallForm: [
    'eyebrow', 'title', 'intro', 'submitLabel', 'successTitle', 'successText', 'successSignature',
    'steps.title', 'steps.description', 'steps.questions.label', 'steps.questions.help', 'steps.questions.placeholder', 'steps.questions.options',
  ],
}

const isTextLike = (f: AnyField) =>
  f.type === 'string' ||
  f.type === 'text' ||
  (f.type === 'array' && Array.isArray(f.of) && f.of.length > 0 && f.of.every((o: AnyField) => o.type === 'string'))

function twin(f: AnyField): AnyField {
  const t: AnyField = { name: `${f.name}_it`, title: `${f.title || f.name} — Italiano`, type: f.type }
  if (f.rows) t.rows = f.rows
  if (f.of) t.of = f.of
  if (f.group) t.group = f.group
  if (f.hidden) t.hidden = f.hidden
  t.description =
    f.name === 'metaTitle' || f.name === 'metaDescription'
      ? 'Italian version. Leave empty to use the automatic Italian text (the English text is never shown on Italian pages).'
      : 'Italian version. Leave empty to show the English text on the Italian pages.'
  return t
}

function process(fields: AnyField[], names: string[] | '*', prefix: string): AnyField[] {
  const out: AnyField[] = []
  for (const f of fields) {
    const path = prefix + f.name
    let next = f
    // Lists of objects: go inside
    if (f.type === 'array' && Array.isArray(f.of)) {
      const of = f.of.map((o: AnyField) => (Array.isArray(o.fields) ? { ...o, fields: process(o.fields, names, `${path}.`) } : o))
      next = { ...f, of }
    }
    out.push(next)
    const wanted = names === '*' ? isTextLike(f) : names.includes(path) && isTextLike(f)
    if (wanted) out.push(twin(f))
  }
  return out
}

export function withItalian<T extends AnyField>(type: T): T {
  const names = TRANSLATABLE[type.name as string]
  if (!names || !Array.isArray(type.fields)) return type
  return { ...type, fields: process(type.fields, names, '') }
}
