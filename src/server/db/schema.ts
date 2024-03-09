import { relations, sql } from "drizzle-orm"
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core"
import { type AdapterAccount } from "next-auth/adapters"
import { v4 as uuid } from "uuid"

export const users = sqliteTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => uuid()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
    sql`(STRFTIME('%s', 'now') * 1000)`,
  ),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  communities: many(communitiesMembers),
  posts: many(posts),
  comments: many(comments),
  postsUpvotes: many(postsUpvotes),
  postsDownvotes: many(postsDownvotes),
}))

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)

export const communities = sqliteTable("community", {
  id: text("id")
    .primaryKey()
    .$default(() => uuid()),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(STRFTIME('%s', 'now') * 1000)`)
    .notNull(),
})

export const communitiesRelations = relations(communities, ({ many }) => ({
  members: many(communitiesMembers),
  posts: many(posts),
}))

export const posts = sqliteTable(
  "post",
  {
    id: text("id")
      .primaryKey()
      .$default(() => uuid()),
    title: text("title").notNull(),
    body: text("body"),
    authorId: text("author_id").notNull(),
    communityId: text("community_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(STRFTIME('%s', 'now') * 1000)`)
      .notNull(),
  },
  (table) => {
    return {
      communityIdIdx: index("post__author_id_idx").on(table.communityId),
      authorIdIdx: index("post__community_id_idx").on(table.authorId),
    }
  },
)

export const postsRelations = relations(posts, ({ one, many }) => ({
  community: one(communities, {
    fields: [posts.communityId],
    references: [communities.id],
  }),
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  comments: many(comments),
  upvotes: many(postsUpvotes),
  downvotes: many(postsDownvotes),
}))

export const comments = sqliteTable(
  "comment",
  {
    id: text("id")
      .primaryKey()
      .$default(() => uuid()),
    postId: text("post_id").notNull(),
    authorId: text("author_id").notNull(),
    replyToId: text("reply_to_id"),
    body: text("body"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(STRFTIME('%s', 'now') * 1000)`)
      .notNull(),
  },
  (table) => {
    return {
      postIdIdx: index("comment__post_id_idx").on(table.postId),
      authorIdIdx: index("comment__author_id_idx").on(table.authorId),
    }
  },
)

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
  replyTo: one(comments, {
    fields: [comments.replyToId],
    references: [comments.id],
    relationName: "replyTo",
  }),
  replies: many(comments, { relationName: "replyTo" }),
  upvotes: many(commentsUpvotes),
  downvotes: many(commentsDownvotes),
}))

export const communitiesMembers = sqliteTable(
  "community_member",
  {
    communityId: text("community_id").notNull(),
    userId: text("user_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(STRFTIME('%s', 'now') * 1000)`)
      .notNull(),
  },
  (table) => {
    return {
      communityIdIdx: index("member__community_id_idx").on(table.communityId),
      userIdIdx: index("member__user_id_idx").on(table.userId),
    }
  },
)

export const communitiesMembersRelations = relations(
  communitiesMembers,
  ({ one }) => ({
    community: one(communities, {
      fields: [communitiesMembers.communityId],
      references: [communities.id],
    }),
    user: one(users, {
      fields: [communitiesMembers.userId],
      references: [users.id],
    }),
  }),
)

export const postsUpvotes = sqliteTable(
  "post_upvote",
  {
    postId: text("post_id").notNull(),
    userId: text("user_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(STRFTIME('%s', 'now') * 1000)`)
      .notNull(),
  },
  (table) => {
    return {
      postIdIdx: index("post_upvote__post_id_idx").on(table.postId),
      userIdIdx: index("post_upvote__user_id_idx").on(table.userId),
    }
  },
)

export const postsUpvotesRelations = relations(postsUpvotes, ({ one }) => ({
  post: one(posts, {
    fields: [postsUpvotes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postsUpvotes.userId],
    references: [users.id],
  }),
}))

export const postsDownvotes = sqliteTable(
  "post_downvote",
  {
    postId: text("post_id").notNull(),
    userId: text("user_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(STRFTIME('%s', 'now') * 1000)`)
      .notNull(),
  },
  (table) => {
    return {
      postIdIdx: index("post_downvote__post_id_idx").on(table.postId),
      userIdIdx: index("post_downvote__user_id_idx").on(table.userId),
    }
  },
)

export const postsDownvotesRelations = relations(postsDownvotes, ({ one }) => ({
  post: one(posts, {
    fields: [postsDownvotes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postsDownvotes.userId],
    references: [users.id],
  }),
}))

export const commentsUpvotes = sqliteTable(
  "comment_upvote",
  {
    commentId: text("comment_id").notNull(),
    userId: text("user_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(STRFTIME('%s', 'now') * 1000)`)
      .notNull(),
  },
  (table) => {
    return {
      commentIdIdx: index("comment_upvote__comment_id_idx").on(table.commentId),
      userIdIdx: index("comment_upvote__user_id_idx").on(table.userId),
    }
  },
)

export const commentsUpvotesRelations = relations(
  commentsUpvotes,
  ({ one }) => ({
    comment: one(comments, {
      fields: [commentsUpvotes.commentId],
      references: [comments.id],
    }),
    user: one(users, {
      fields: [commentsUpvotes.userId],
      references: [users.id],
    }),
  }),
)

export const commentsDownvotes = sqliteTable(
  "comment_downvote",
  {
    commentId: text("comment_id").notNull(),
    userId: text("user_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(STRFTIME('%s', 'now') * 1000)`)
      .notNull(),
  },
  (table) => {
    return {
      commentIdIdx: index("comment_downvote__comment_id_idx").on(
        table.commentId,
      ),
      userIdIdx: index("comment_downvote__user_id_idx").on(table.userId),
    }
  },
)

export const commentsDownvotesRelations = relations(
  commentsDownvotes,
  ({ one }) => ({
    comment: one(comments, {
      fields: [commentsDownvotes.commentId],
      references: [comments.id],
    }),
    user: one(users, {
      fields: [commentsDownvotes.userId],
      references: [users.id],
    }),
  }),
)
