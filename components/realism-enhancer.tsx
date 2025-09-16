"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

import { startRealisticProcessing } from "@/lib/herve-api"

export default function RealismEnhancer({ initialImage }: { initialImage: string }) {
  const [taskStatus, setTaskStatus] = useState<"PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "">("")
  const [outputImage, setOutputImage] = useState(initialImage)
  const [showLoading, setShowLoading] = useState(false)

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Realism Enhancer</h1>

      {showLoading && <Loader2 className="w-8 h-8 animate-spin mb-4" />}
      {taskStatus === "SUCCESS" && outputImage && (
        <img src={outputImage} alt="Enhanced Realistic" className="rounded-lg shadow-lg w-full max-w-md mb-4" />
      )}
      {taskStatus === "FAILED" && <XCircle className="w-8 h-8 text-red-500 mb-4" />}

      <Button onClick={() => startRealisticProcessing(outputImage, setTaskStatus, setOutputImage, setShowLoading)}>
        Enhance Realism
      </Button>
    </div>
  )
}
