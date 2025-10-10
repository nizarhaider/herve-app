"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Camera, CheckCircle, XCircle } from "lucide-react"

import { MODELS, POSES } from "@/lib/herve-data"

export default function PosesGenerator() {
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedPose, setSelectedPose] = useState<string>("")
  const [taskStatus, setTaskStatus] = useState<"PENDING" | "RUNNING" | "QUEUED" | "SUCCESS" | "FAILED" | "">("")
  const [outputImage, setOutputImage] = useState<string>("")
  const [showLoading, setShowLoading] = useState(false)

  const handlePoseSelect = (poseId: string) => {
    setSelectedPose((prev) => (prev === poseId ? "" : poseId))
  }

  // Selection-only UI: pose generation removed, pregenerated poses used instead

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pose Generator</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {MODELS.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedModel === model.id ? "ring-2 ring-primary bg-accent/10" : ""}`}
            onClick={() => setSelectedModel(model.id)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <img src={model.image} alt={model.name} className="w-full h-full object-cover object-center" />
                <div className="absolute left-2 bottom-2 bg-black/50 text-white text-sm font-semibold px-2 py-1 rounded">{model.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {POSES.map((pose) => {
          const s3Url = `https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses_v3/${pose.id}`
          return (
            <Card
              key={pose.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedPose === pose.id ? "ring-2 ring-primary bg-accent/10" : ""}`}
              onClick={() => handlePoseSelect(pose.id)}
            >
              <CardContent className="p-4">
                <div className="min-h-[200px] bg-muted rounded-lg mb-3 flex items-center justify-center">
                  <img src={s3Url} alt={pose.name} className="w-auto h-auto max-h-[180px] object-contain rounded-lg" />
                </div>
                <h3 className="font-semibold text-sm">{pose.name}</h3>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
