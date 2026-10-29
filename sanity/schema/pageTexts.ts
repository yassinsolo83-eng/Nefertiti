import { defineField, defineType } from 'sanity'

// One single document holding the fixed texts of the site that are not part of any list.
// Any field left empty keeps the site's original text.
const txt = (name: string, title: string, group: string, description?: string, long = false) =>
  defineField({
    name,
    title,
    type: long ? 'text' : 'string',
    ...(long ? { rows: 3 } : {}),
    group,
    description: description || 'Leave empty to keep the original text.',
  })

export const pageTexts = defineType({
  name: 'pageTexts',
  title: 'Page Texts',
  type: 'document',
  groups: [
    { name: 'home', title: 'Home', default: true },
    { name: 'experiences', title: 'Experiences page' },
    { name: 'services', title: 'Services page' },
    { name: 'howItWorks', title: 'How It Works page' },
    { name: 'about', title: 'About page' },
    { name: 'partners', title: 'Partners page' },
    { name: 'retreats', title: 'Retreats page' },
    { name: 'destinations', title: 'Destinations page' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    // ── Home ──
    txt('taglineWhy', 'Line after "Why Egypt"', 'home', 'Short line between sections. Original: Find Your Peace Within'),
    txt('taglineDestinations', 'Line after Destinations', 'home', 'Original: A Journey Back to Yourself'),
    txt('taglineRetreats', 'Line after Retreats', 'home', 'Original: Beyond Escape Lies Renewal'),
    txt('taglineTestimonials', 'Line before Testimonials', 'home', 'Original: Peace & Spiritual'),
    txt('howItWorksTitle', 'How It Works — heading', 'home', 'Original: From first idea to arrival.'),
    txt('retreatsTitle', 'Our Retreats — heading', 'home', 'Original: JOIN A NEFERTITI RETREAT.'),
    txt('exploreTitle', 'Explore Further — heading', 'home', "Original: There's more to discover."),
    txt('teamTitle', 'Our Team — heading', 'home', 'Original: Our Team'),
    txt('testimonialsTitle', 'Testimonials — heading', 'home', 'Original: What retreat leaders say'),

    txt('labelWhy', 'Label — Why Egypt', 'home', 'Small title above the section (the number is added by the site). Original: WHY EGYPT'),
    txt('labelWay', 'Label — The Nefertiti Way', 'home', 'Original: THE NEFERTITI WAY'),
    txt('labelHowItWorks', 'Label — How It Works', 'home', 'Original: HOW IT WORKS'),
    txt('labelRetreats', 'Label — Our Retreats', 'home', 'Original: OUR RETREATS'),
    txt('labelExplore', 'Label — Explore Further', 'home', 'Original: EXPLORE FURTHER'),
    txt('labelTeam', 'Label — Our Team', 'home', 'Original: OUR TEAM'),
    txt('labelTestimonials', 'Label — Testimonials', 'home', 'Original: IN THEIR WORDS'),

    // ── Partners ──
    txt('partnersEyebrow', 'Small label', 'partners', 'Original: ◆ OUR TEAM'),
    txt('partnersTitle', 'Heading', 'partners', 'Press Enter for a new line. Original: Meet the Practitioners Behind / Your Healing Journey', true),
    txt('partnersButton', 'Button text', 'partners', 'Original: Become a Partner'),

    // ── Retreats ──
    txt('retreatsEyebrow', 'Small label', 'retreats', 'Original: ◆ NEFERTITI RETREATS'),
    txt('retreatsPageTitle', 'Heading', 'retreats', 'Original: Retreats'),
    txt('retreatsLead', 'Description', 'retreats', undefined, true),
    txt('retreatsListLabel', 'Label above the list', 'retreats', 'Original: UPCOMING RETREATS'),
    txt('retreatsEmptyText', 'Text when there are no upcoming retreats', 'retreats', undefined, true),
    txt('retreatsEmptyButton', 'Button text when there are no upcoming retreats', 'retreats', 'Original: Get in Touch'),

    // ── Destinations ──
    txt('destPageEyebrow', 'Small label', 'destinations', 'Original: ◆ DESTINATIONS'),
    txt('destPageTitle', 'Heading', 'destinations', 'Original: Where we take your retreat'),
    txt('destPageSub', 'Description', 'destinations', undefined, true),
    txt('destPageButton', 'Button text', 'destinations', 'Original: Create a retreat in Egypt'),

    // ── Experiences ──
    txt('experiencesTitle', 'Title (on the banner)', 'experiences', 'Original: Experiences'),
    txt('experiencesSubtitle', 'Line under the title', 'experiences', 'Original: Curated moments woven around your retreat.'),
    txt('experiencesLead', 'Description', 'experiences', undefined, true),
    txt('experiencesButton', 'Button text', 'experiences', 'Original: Design My Experience'),

    // ── Services ──
    txt('servicesTitle', 'Title (on the banner)', 'services', 'Original: Services'),
    txt('servicesSubtitle', 'Line under the title', 'services', 'Original: Bespoke retreat production, tailored to your vision.'),
    txt('servicesLead', 'Description', 'services', undefined, true),
    txt('servicesButton', 'Button text', 'services', 'Original: Discuss Your Retreat'),

    // ── How It Works ──
    txt('howItWorksPageTitle', 'Title (on the banner)', 'howItWorks', 'Original: How It Works'),
    txt('howItWorksPageSubtitle', 'Line under the title', 'howItWorks', 'Original: A clear, guided path from idea to arrival.'),
    txt('howItWorksPageLead', 'Description', 'howItWorks', undefined, true),
    txt('howItWorksPageButton', 'Button text', 'howItWorks', 'Original: Share your idea, then book a call'),

    // ── About ──
    txt('aboutTitle', 'Title (on the banner)', 'about', 'Original: About'),
    txt('aboutSubtitle', 'Line under the title', 'about', 'Original: The story and the people behind Nefertiti.'),

    // ── Footer ──
    txt('footerTagline', 'Tagline', 'footer', 'Original: Find your peace within.'),
    txt('footerLine1', 'First line', 'footer', 'Original: You lead the transformation. We create the experience.'),
    txt('footerLine2', 'Second line', 'footer', 'Original: Based between Egypt & Italy.'),
    txt('footerLocation', 'Location line', 'footer', 'Original: Cairo · Siwa · Everywhere'),
    txt('footerSignoff', 'Last line', 'footer', 'Original: Made with presence'),
  ],
  preview: {
    prepare: () => ({ title: 'Page Texts' }),
  },
})
