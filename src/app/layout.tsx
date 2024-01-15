import type { Metadata } from "next"

import Nav from "~/components/nav"

import "~/styles/globals.css"

export const metadata: Metadata = {
  title: "Reddit Clone",
  description: "A toy project for me to practice Next.js",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />

        {children}
      </body>
    </html>
  )
}
