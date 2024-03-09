import type { Metadata } from "next"

import LeftMenu from "~/components/left_menu"
import RightMenu from "~/components/right_menu"
import localFont from "next/font/local"

import "~/styles/globals.css"

const madimi = localFont({
  src: "../assets/MadimiOne-Regular.ttf",
  variable: "--font-madimi",
})

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
      <body className={`flex justify-center bg-secondary ${madimi.variable}`}>
        <div
          id="layout-grid"
          className="grid min-h-dvh max-w-7xl flex-grow grid-cols-5 gap-3 py-3"
        >
          <LeftMenu />
          <main className="col-span-3">{children}</main>
          <RightMenu />
        </div>
      </body>
    </html>
  )
}
