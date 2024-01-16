import { FaChevronDown, FaChevronUp } from "react-icons/fa"

export default function UpvoteDownvote() {
  return (
    <div className="flex flex-col gap-1 text-gray-600">
      <FaChevronUp className="cursor-pointer hover:text-accent" />
      <span className="text-sm">32</span>
      <FaChevronDown className="cursor-pointer hover:text-accent" />
    </div>
  )
}
