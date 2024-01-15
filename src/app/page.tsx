import { db } from "~/server/db"
import { users } from "~/server/db/schema"

export default async function Home() {
  const allUsers = await db.select().from(users)

  return (
    <>
      <h1 className="text-green">Hello World</h1>

      <ul>
        {allUsers.map((user) => (
          <li key={user.id} className="my-3">
            {user.name}
          </li>
        ))}
      </ul>
    </>
  )
}
