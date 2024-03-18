import Link from "next/link"
import Image from "next/image"
import { Button } from "~/components/ui/button"

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-4xl">Ops...</h1>
      <div className="pt-8"></div>

      <Image
        src="/confused_robot.webp"
        alt="Not found robot"
        width="200"
        height="200"
        className="mx-auto"
      />
      <div className="pt-8"></div>

      <p>It seems we couldn&apos;t find what you&apos;re looking for</p>
      <div className="pt-8"></div>

      <Link href="/">
        <Button variant="default">Go back to the home page</Button>
      </Link>
    </div>
  )
}
