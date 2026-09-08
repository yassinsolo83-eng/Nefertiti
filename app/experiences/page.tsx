import { getExperiences } from '@/sanity/lib/queries'
import ExperiencesPage from '@/components/ExperiencesPage'

export default async function Page() {
  const experiences = await getExperiences()
  return <ExperiencesPage experiences={experiences} />
}
