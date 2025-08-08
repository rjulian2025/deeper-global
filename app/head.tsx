import { headers } from 'next/headers'

export default function Head() {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
    </>
  )
}


