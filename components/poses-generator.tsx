"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Camera, CheckCircle, XCircle } from "lucide-react"

import { MODELS, POSES, fetchTaskOutput, runTask, pollTaskStatus } from "@/lib/herve-data"
import { startFinalProcessing } from "@/lib/herve-api"

export default function PosesGenerator() {
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedPose, setSelectedPose] = useState<string>("")
  const [taskStatus, setTaskStatus] = useState<"PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "">("")
  const [outputImage, setOutputImage] = useState<string>("")
  const [showLoading, setShowLoading] = useState(false)

  const handlePoseSelect = (poseId: string) => {
    setSelectedPose((prev) => (prev === poseId ? "" : poseId))
  }

  const handleGeneratePose = async () => {
    if (!selectedModel || !selectedPose) return
    setShowLoading(true)
    setTaskStatus("RUNNING")
    const taskId = await runTask(selectedModel, selectedPose)
    pollTaskStatus(taskId, setTaskStatus, setOutputImage, setShowLoading)
  }

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
            <CardContent className="p-4">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-3 overflow-hidden">
                <img src={model.image} alt={model.name} className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="font-semibold text-sm">{model.name}</h3>
              <Badge variant="secondary" className="text-xs">{model.type}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {POSES.map((pose) => (
          <Card
            key={pose.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedPose === pose.id ? "ring-2 ring-primary bg-accent/10" : ""}`}
            onClick={() => handlePoseSelect(pose.id)}
          >
            <CardContent className="p-4">
              <div className="min-h-[200px] bg-muted rounded-lg mb-3 flex items-center justify-center">
                <img src={pose.image} alt={pose.name} className="w-auto h-auto max-h-[180px] object-contain rounded-lg" />
              </div>
              <h3 className="font-semibold text-sm">{pose.name}</h3>
              <Badge variant="secondary" className="text-xs">{pose.type}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center">
        {showLoading && <Loader2 className="w-8 h-8 animate-spin mb-4" />}
        {taskStatus === "SUCCESS" && outputImage && (
          <div className="my-4">
            <img src={outputImage} alt="Generated Pose" className="rounded-lg shadow-lg w-full max-w-md" />
          </div>
        )}
        <Button onClick={handleGeneratePose} disabled={!selectedModel || !selectedPose || taskStatus === "RUNNING"}>
          Generate Pose
        </Button>
      </div>
    </div>
  )
}
