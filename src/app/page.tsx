import { getServerSession } from "next-auth/next"
import { eq, inArray } from "drizzle-orm"

import {
  posts,
  communitiesMembers,
  users,
  communities,
} from "~/server/db/schema"
import { db } from "~/server/db"
import { authOptions } from "~/server/auth"

import PostCard from "~/components/post_card"

const MAX_POSTS_PER_QUERY = 20

export default async function Home() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const userCommunitiesPosts = await db
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
    .where(
      inArray(
        posts.communityId,
        db
          .select({ communityId: communitiesMembers.communityId })
          .from(communitiesMembers)
          .where(eq(communitiesMembers.userId, user!.id)),
      ),
    )
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(communities, eq(posts.communityId, communities.id))
    .limit(MAX_POSTS_PER_QUERY)

  const otherCommunitiesPosts =
    userCommunitiesPosts.length < MAX_POSTS_PER_QUERY
      ? await db
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
          .leftJoin(users, eq(posts.authorId, users.id))
          .leftJoin(communities, eq(posts.communityId, communities.id))
          .limit(MAX_POSTS_PER_QUERY - userCommunitiesPosts.length)
      : []

  const postsToShow = userCommunitiesPosts.concat(otherCommunitiesPosts)

  return (
    <div id="posts-container" className="flex flex-col gap-4">
      {postsToShow.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
