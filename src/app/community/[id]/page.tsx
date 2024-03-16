import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"

import { db } from "~/server/db"
import { communities } from "~/server/db/schema"

export default async function CommunityPage({
  params,
}: {
  params: { id: string }
}) {
  console.log(params.id)

  const community = (
    await db
      .select()
      .from(communities)
      .where(eq(communities.id, params.id))
      .limit(1)
  )[0]

  console.log(community)

  if (!community) {
    return notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{community.name}</h1>
      <p className="">{community.description}</p>
    </div>
  )
}
