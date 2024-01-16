import { getServerSession } from "next-auth/next"
import { eq, inArray, sql } from "drizzle-orm"

import {
  posts,
  communitiesMembers,
  users,
  communities,
} from "~/server/db/schema"
import { db } from "~/server/db"
import { authOptions } from "~/server/auth"

import PostCard from "~/components/post_card"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // let postsToShow
  // if (session === null) {
  //   postsToShow = await db
  //     .select({
  //       id: posts.id,
  //       title: posts.title,
  //       createdAt: posts.createdAt,
  //       authorId: posts.authorId,
  //       authorName: users.name,
  //     })
  //     .from(posts)
  // } else {
  //   const user = session.user
  //   postsToShow = await db
  //     .select({
  //       id: posts.id,
  //       title: posts.title,
  //       createdAt: posts.createdAt,
  //       authorName: users.name,
  //     })
  //     .from(posts)
  //     .where(
  //       inArray(
  //         posts.communityId,
  //         db
  //           .select({ communityId: communitiesMembers.communityId })
  //           .from(communitiesMembers)
  //           .where(eq(communitiesMembers.userId, user.id)),
  //       ),
  //     )
  //     .leftJoin(users, eq(posts.authorId, users.id))
  //     .limit(20)
  // }

  const user = session?.user
  const where =
    session === null
      ? sql`1`
      : inArray(
          posts.communityId,
          db
            .select({ communityId: communitiesMembers.communityId })
            .from(communitiesMembers)
            .where(eq(communitiesMembers.userId, user!.id)),
        )
  const postsToShow = await db
    .select({
      id: posts.id,
      title: posts.title,
      createdAt: posts.createdAt,
      authorId: posts.authorId,
      authorName: users.name,
      communityId: posts.communityId,
      communityName: communities.name,
    })
    .from(posts)
    .where(where)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(communities, eq(posts.communityId, communities.id))
    .limit(20)

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
