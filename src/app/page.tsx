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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"
import PostCard from "~/components/post_card"

const MAX_POSTS_PER_QUERY = 20

export default async function Home() {
  const session = await getServerSession(authOptions)
  const user = session?.user

  const userCommunitiesPosts = user
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
        .where(
          inArray(
            posts.communityId,
            db
              .select({ communityId: communitiesMembers.communityId })
              .from(communitiesMembers)
              .where(eq(communitiesMembers.userId, user.id)),
          ),
        )
        .leftJoin(users, eq(posts.authorId, users.id))
        .leftJoin(communities, eq(posts.communityId, communities.id))
        .limit(MAX_POSTS_PER_QUERY)
    : []

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
    <>
      <div className="flex w-full items-center rounded-md border border-gray-300 bg-slate-100 px-3 py-2 focus-within:bg-slate-50">
        <label htmlFor="search" hidden>
          Search
        </label>

        <FontAwesomeIcon icon={faSearch} className="pr-2 text-gray-500" />
        <input
          id="search"
          type="search"
          placeholder="Search"
          className="flex-grow bg-slate-100 outline-none focus-within:bg-slate-50"
        />
        <FontAwesomeIcon icon={faTimes} className="pl-2 text-gray-500" />
      </div>

      <div className="pt-4"></div>

      <div id="posts-container" className="flex flex-col gap-4">
        {postsToShow.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  )
}
