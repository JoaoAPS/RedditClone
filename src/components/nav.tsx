import Link from "next/link"
import { getServerSession } from "next-auth/next"

import { authOptions } from "~/server/auth"

export default async function Nav() {
  const session = await getServerSession(authOptions)

  return (
    <nav>
      {session === null ? (
        <Link href="/api/auth/signin">Sign in</Link>
      ) : (
        <>
          <h1 className="text-accent text-[15rem] font-extrabold leading-loose">
            Hi {session?.user.name}!
          </h1>
          <Link href="/api/auth/signout">Sign out</Link>
        </>
      )}
    </nav>
  )
}
