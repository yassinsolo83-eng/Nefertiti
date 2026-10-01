import { defineField, defineType } from 'sanity'

// One single document holding the fixed images of each page.
// Any field left empty keeps the site's original image.
const img = (name: string, title: string, group: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    group,
    options: { hotspot: true },
    description: description || 'Leave empty to keep the original image.',
  })

export const pageImages = defineType({
  name: 'pageImages',
  title: 'Page Images',
  type: 'document',
  groups: [
    { name: 'about', title: 'About', default: true },
    { name: 'services', title: 'Services' },
    { name: 'experiences', title: 'Experiences' },
    { name: 'howItWorks', title: 'How It Works' },
    { name: 'retreats', title: 'Retreats' },
    { name: 'contact', title: 'Contact' },
  ],
  fields: [
    img('aboutHero', 'About — Top banner', 'about', 'Wide image at the top of the About page.'),
    img('founderPhoto', 'About — Founder photo', 'about'),
    img('servicesHero', 'Services — Top banner', 'services', 'Wide image at the top of the Services page. Tier images are edited in Service Tiers.'),
    img('experiencesHero', 'Experiences — Top banner', 'experiences', 'Wide image at the top of the Experiences page. Each experience image is edited in Experiences.'),
    img('howItWorksHero', 'How It Works — Top banner', 'howItWorks', 'Wide image at the top of the How It Works page. Step images are edited in How It Works — Steps.'),
    img('retreatsHero', 'Retreats — Top image', 'retreats'),
    img('contactHero', 'Contact — Top image', 'contact'),
    img('contactSide', 'Contact — Image next to WhatsApp', 'contact'),
    img('contactFaq', 'Contact — Image next to FAQs', 'contact'),
  ],
  preview: {
    prepare: () => ({ title: 'Page Images' }),
  },
})
