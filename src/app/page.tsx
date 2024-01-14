import { db } from "~/server/db"
import { users } from "~/server/db/schema"

export default async function Home() {
  const allUsers = await db.select().from(users)

  return (
    <main>
      <h1>Hello World</h1>

      <ul>
        {allUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </main>
  )
}
