"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { db } from "~/server/db"
import { communities } from "~/server/db/schema"

export async function create_community(formData: FormData) {
  const communitySchema = z.object({
    name: z.string(),
    description: z.string(),
  })
  const data = communitySchema.parse(Object.fromEntries(formData))

  const result = await db
    .insert(communities)
    .values(data)
    .returning({ id: communities.id })
  const community = result[0]

  if (!community) throw new Error("Failed to create community")

  redirect(`/community/${community.id}`)
}
