import Image from "next/image"
import SideMenu from "../side_menu"

export default function LeftMenu() {
  return (
    <SideMenu>
      <div className="flex items-center justify-center gap-4">
        <Image
          src="/logo.jpg"
          width="100"
          height="100"
          alt="Site logo"
          className="w-12 rounded-md"
        />
        <span className="font-logo text-lg font-normal">Reddit Clone</span>
      </div>
    </SideMenu>
  )
}
