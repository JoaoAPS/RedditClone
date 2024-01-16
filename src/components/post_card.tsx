import type { posts } from "~/server/db/schema"

import UpvoteDownvote from "./upvote_downvote"

type Post = typeof posts.$inferSelect

export default function PostCard({ post }: { post: Post }) {
  return (
    <article key={post.id} className="grid w-full grid-cols-12 border p-2">
      <div>
        <UpvoteDownvote />
      </div>
      <div className="col-span-11">{post.title}</div>
    </article>
  )
}
