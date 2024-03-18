import Link from "next/link"
import UpvoteDownvote from "./upvote_downvote"

interface Post {
  id: string
  title: string
  createdAt: Date
  authorId: string
  authorName: string | null
  communityId: string
  communityName: string | null
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <article
      key={post.id}
      className={`
        flex w-full gap-4 rounded-sm border px-4 py-2 transition-colors duration-200
        ease-in-out focus-within:bg-slate-100 hover:bg-slate-100
      `}
    >
      <div className="">
        <UpvoteDownvote />
      </div>

      <div className="flex-grow">
        <div className="flex">
          <Link
            href={`/community/${post.communityId}`}
            className="text-xs text-gray-700"
          >
            {post.communityName ?? "Unnamed Community"}
          </Link>
          <span className="pl-3 text-xs text-muted-foreground">
            Posted by <i>{post.authorName ?? "unnamed"}</i> at{" "}
            {post.createdAt.toLocaleString()}
          </span>
        </div>

        <div className="py-1">
          <Link href={`/post/${post.id}`} className="text-lg">
            {post.title}
          </Link>
        </div>
      </div>
    </article>
  )
}
