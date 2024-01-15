import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth/next"

import { authOptions } from "~/server/auth"
import { Button } from "~/components/ui/button"

export default async function RightMenu() {
  const session = await getServerSession(authOptions)

  if (session === null) {
    return (
      <div className="p-3">
        <Button asChild className="w-full">
          <Link href="/api/auth/signin">Sign in</Link>
        </Button>
      </div>
    )
  }

  const name = session?.user?.name ?? ""
  const imageSrc = session?.user?.image ?? ""

  return (
    <div className="flex h-fit items-center gap-3 p-3">
      <Image
        src={imageSrc}
        alt={name}
        className="h-14 w-14 rounded-full"
        width={80}
        height={80}
      />
      <div className="flex h-fit w-full flex-col items-center gap-1">
        <span className="">{name}</span>
        <Button asChild size="wide" variant="outline" className="w-full">
          <Link href="/api/auth/signout">Sign out</Link>
        </Button>
      </div>
    </div>
  )
}
