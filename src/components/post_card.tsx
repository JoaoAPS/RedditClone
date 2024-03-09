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
      className="flex w-full gap-4 rounded-sm border px-4 py-2"
    >
      <div className="">
        <UpvoteDownvote />
      </div>

      <div className="flex-grow">
        <div className="flex">
          <span className="text-xs text-gray-700">
            {post.communityName ?? "Unnamed Community"}
          </span>
          <span className="pl-3 text-xs text-muted-foreground">
            Posted by <i>{post.authorName ?? "unnamed"}</i> at{" "}
            {post.createdAt.toLocaleString()}
          </span>
        </div>

        <div className="py-1">
          <span className="text-lg">{post.title}</span>
        </div>
      </div>
    </article>
  )
}
