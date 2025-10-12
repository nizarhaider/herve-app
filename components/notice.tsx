import { AlertCircle } from "lucide-react"

export function Notice() {
  return (
    <div className="w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p className="font-medium">
          App Under Development
          <span className="font-normal ml-2">
            This is a preview version and some features may not be fully functional.
          </span>
        </p>
      </div>
    </div>
  )
}