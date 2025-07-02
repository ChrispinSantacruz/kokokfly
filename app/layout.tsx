import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KOKOK THE ROACH - Fly Game',
  description: 'Help Kokok the roach conquer the skies in this exciting flying adventure!',
  icons: {
    icon: '/images/kokok-ufo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
