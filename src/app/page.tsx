import { getServerSession } from "next-auth/next"
import { eq, inArray } from "drizzle-orm"

import { posts, communitiesMembers } from "~/server/db/schema"
import { db } from "~/server/db"
import { authOptions } from "~/server/auth"

import PostCard from "~/components/post_card"

export default async function Home() {
  const session = await getServerSession(authOptions)

  let postsToShow
  if (session === null) {
    postsToShow = await db.select().from(posts)
  } else {
    const user = session.user
    postsToShow = await db
      .select()
      .from(posts)
      .where(
        inArray(
          posts.communityId,
          db
            .select({ communityId: communitiesMembers.communityId })
            .from(communitiesMembers)
            .where(eq(communitiesMembers.userId, user.id)),
        ),
      )
      .limit(20)
  }

  return (
    <div
      id="posts-container"
      className="flex min-h-full flex-col gap-4 rounded-md bg-background px-6 py-6"
    >
      {postsToShow.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
