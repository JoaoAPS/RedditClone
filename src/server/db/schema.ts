import { relations, sql } from "drizzle-orm"
import {
  bigint,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core"
import { type AdapterAccount } from "next-auth/adapters"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `reddit-clone_${name}`)

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_At").defaultNow(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
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

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    expires_in: int("expires_in"),
    refresh_token_expires_in: int("refresh_token_expires_in"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
    createdAt: timestamp("created_At").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
    providerAccountUnique: unique().on(
      account.provider,
      account.providerAccountId,
    ),
  }),
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_At").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_At").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
)

export const communities = mysqlTable("community", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 32 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
})

export const communitiesRelations = relations(communities, ({ many }) => ({
  members: many(communitiesMembers),
  posts: many(posts),
}))

export const posts = mysqlTable(
  "post",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    title: varchar("title", { length: 512 }),
    body: text("body"),
    authorId: varchar("author_id", { length: 255 }).notNull(),
    communityId: varchar("community_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => {
    return {
      communityIdIdx: index("author_id_idx").on(table.communityId),
      authorIdIdx: index("community_id_idx").on(table.authorId),
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

export const comments = mysqlTable(
  "comment",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    postId: bigint("post_id", { mode: "number" }).notNull(),
    authorId: varchar("author_id", { length: 255 }).notNull(),
    replyToId: bigint("reply_to_id", { mode: "number" }).notNull(),
    body: text("body"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").onUpdateNow(),
  },
  (table) => {
    return {
      postIdIdx: index("post_id_idx").on(table.postId),
      authorIdIdx: index("author_id_idx").on(table.authorId),
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

export const communitiesMembers = mysqlTable(
  "community_member",
  {
    communityId: int("community_id").notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      communityIdIdx: index("community_id_idx").on(table.communityId),
      userIdIdx: index("user_id_idx").on(table.userId),
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

export const postsUpvotes = mysqlTable(
  "post_upvote",
  {
    postId: bigint("post_id", { mode: "number" }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      postIdIdx: index("post_id_idx").on(table.postId),
      userIdIdx: index("user_id_idx").on(table.userId),
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

export const postsDownvotes = mysqlTable(
  "post_downvote",
  {
    postId: bigint("post_id", { mode: "number" }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      postIdIdx: index("post_id_idx").on(table.postId),
      userIdIdx: index("user_id_idx").on(table.userId),
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

export const commentsUpvotes = mysqlTable(
  "comment_upvote",
  {
    commentId: bigint("comment_id", { mode: "number" }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      commentIdIdx: index("comment_id_idx").on(table.commentId),
      userIdIdx: index("user_id_idx").on(table.userId),
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

export const commentsDownvotes = mysqlTable(
  "comment_downvote",
  {
    commentId: bigint("comment_id", { mode: "number" }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      commentIdIdx: index("comment_id_idx").on(table.commentId),
      userIdIdx: index("user_id_idx").on(table.userId),
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
