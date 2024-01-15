import type { Metadata } from "next"

import LeftMenu from "~/components/left_menu"
import RightMenu from "~/components/right_menu"

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
        <div className="grid grid-cols-4">
          <LeftMenu />
          <main className="col-span-2">{children}</main>
          <RightMenu />
        </div>
      </body>
    </html>
  )
}
