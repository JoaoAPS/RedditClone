import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons"

import { authOptions } from "~/server/auth"

import SideMenu from "~/components/side_menu"
import { Button } from "~/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Separator } from "~/components/ui/separator"

function getNameAbbreviation(name: string) {
  if (name === "") return ""

  // Given a name, return the first letter of the first and last word in the name.
  const words = name.split(" ").filter((word) => word !== "")

  if (words.length === 0) return ""
  if (words.length === 1) {
    return words[0]!.slice(0, 2)
  } else {
    return words[0]!.slice(0, 1) + words[words.length - 1]!.slice(0, 1)
  }
}

export default async function RightMenu() {
  const session = await getServerSession(authOptions)
  const name = session?.user?.name ?? ""
  const imageSrc = session?.user?.image ?? ""

  return (
    <SideMenu>
      {session ? (
        <LoggedInContent name={name} imageSrc={imageSrc} />
      ) : (
        <LoggedOutContent />
      )}
    </SideMenu>
  )
}

function LoggedOutContent() {
  return (
    <Button asChild className="w-full bg-accent hover:bg-accent/80">
      <Link href="/api/auth/signin">
        <FontAwesomeIcon icon={faSignIn} className="pr-2" />
        Sign in
      </Link>
    </Button>
  )
}

function LoggedInContent({
  name,
  imageSrc,
}: {
  name: string
  imageSrc: string
}) {
  return (
    <>
      <div className="flex h-fit items-center gap-3">
        <Avatar>
          <AvatarImage src={imageSrc} />
          <AvatarFallback>{getNameAbbreviation(name)}</AvatarFallback>
        </Avatar>

        <div className="flex h-fit w-full flex-col items-center gap-1">
          <span className="text-sm">{name}</span>
          <Button
            asChild
            size="wide"
            variant="outline"
            className="h-7 w-full border-slate-300 bg-transparent font-normal text-slate-800 hover:border-slate-900"
          >
            <Link href="/api/auth/signout">
              <FontAwesomeIcon icon={faSignOut} className="pr-2" />
              Sign out
            </Link>
          </Button>
        </div>
      </div>

      <Separator className="mb-14 mt-4" />

      <div className="flex flex-col gap-4">
        <Button asChild className="w-full bg-accent hover:bg-accent/80">
          <Link href="/post/new">Create Post</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/community/new">Create Community</Link>
        </Button>
      </div>
    </>
  )
}
