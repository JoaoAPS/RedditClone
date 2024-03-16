import { create_community } from "~/app/actions"
import { Button } from "~/components/ui/button"

export default function NewCommunityPage() {
  return (
    <>
      <h1 className="text-xl font-bold">Create New Community</h1>
      <div className="pt-4"></div>

      <form action={create_community}>
        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="rounded-md border px-2 py-1"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="rounded-md border px-2 py-1"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              className="rounded-md px-2 py-1"
            />
          </fieldset>

          <div className="pt-2"></div>

          <Button type="submit">Create</Button>
        </div>
      </form>
    </>
  )
}
