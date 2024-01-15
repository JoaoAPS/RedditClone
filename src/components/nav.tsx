import Link from "next/link"
import { getServerSession } from "next-auth/next"

import { authOptions } from "~/server/auth"
import { Button } from "~/components/ui/button"

export default async function Nav() {
  const session = await getServerSession(authOptions)

  return (
    <nav>
      {session === null ? (
        <Link href="/api/auth/signin">
          <Button>Sign in</Button>
        </Link>
      ) : (
        <>
          <h1 className="text-accent text-[3rem] font-extrabold leading-loose text-gray-800">
            Hi {session?.user.name}!
          </h1>
          <Link href="/api/auth/signout">
            <Button>Sign out</Button>
          </Link>
        </>
      )}
    </nav>
  )
}
