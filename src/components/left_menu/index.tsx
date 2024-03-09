import Image from "next/image"
import Link from "next/link"
import SideMenu from "../side_menu"
import { Separator } from "~/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar"

import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth"
import { db } from "~/server/db"
import { communities, communitiesMembers } from "~/server/db/schema"
import { inArray, eq } from "drizzle-orm"

export default async function LeftMenu() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const userCommunities = user
    ? await db
        .select({
          id: communities.id,
          name: communities.name,
          image: communities.image,
        })
        .from(communities)
        .where(
          inArray(
            communities.id,
            db
              .select({ communityId: communitiesMembers.communityId })
              .from(communitiesMembers)
              .where(eq(communitiesMembers.userId, user.id)),
          ),
        )
    : []

  return (
    <SideMenu>
      <div className="flex items-center justify-center gap-4">
        <Image
          src="/logo.jpg"
          width="100"
          height="100"
          alt="Site logo"
          className="w-12 rounded-md"
        />
        <span className="font-logo text-lg font-normal">Reddit Clone</span>
      </div>

      <Separator className="my-4" />

      <h4 className="pb-4 text-center text-sm uppercase tracking-wide text-muted-foreground">
        Your communities
      </h4>
      <ul className="flex flex-col gap-2 px-2 ">
        {userCommunities.map((community) => (
          <li key={community.id} className="block">
            <Link
              href={`/communities/${community.id}/`}
              className="flex w-full items-center gap-2"
            >
              <Avatar className="inline-block h-5 w-5">
                <AvatarImage
                  src={community.image || "/default_community.webp"}
                  alt={community.name}
                />
                <AvatarFallback>
                  {community.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {community.name}
            </Link>
          </li>
        ))}
      </ul>
    </SideMenu>
  )
}
