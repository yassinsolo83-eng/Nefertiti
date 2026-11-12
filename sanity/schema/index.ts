import { destination } from './destination'
import { experience } from './experience'
import { partner } from './partner'
import { collaboration } from './collaboration'
import { faq } from './faq'
import { serviceTier } from './serviceTier'
import { siteContent } from './siteContent'
import { step } from './step'
import { siteSettings } from './siteSettings'
import { seo } from './seo'
import { enquiry } from './enquiry'
import { retreat } from './retreat'
import { pageImages } from './pageImages'
import { pageTexts } from './pageTexts'
import { preCallForm } from './preCallForm'
import { testimonial } from './testimonial'
import { preCallSubmission } from './preCallSubmission'
import { visitorCounter } from './visitorCounter'
import { withItalian } from './italian'

export const schemaTypes = [
  visitorCounter,
  enquiry,
  preCallSubmission,
  preCallForm,
  retreat,
  destination,
  experience,
  partner,
  collaboration,
  testimonial,
  faq,
  serviceTier,
  siteContent,
  step,
  siteSettings,
  pageImages,
  pageTexts,
  seo,
].map(withItalian)
