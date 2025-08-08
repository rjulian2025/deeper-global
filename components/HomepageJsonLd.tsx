import JsonLd from './JsonLd'
import { generateHomepageSchema } from '@/lib/schema'

export default function HomepageJsonLd() {
  const jsonLd = generateHomepageSchema()
  return <JsonLd data={jsonLd} />
}
