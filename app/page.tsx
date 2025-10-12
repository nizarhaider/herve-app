"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Shirt } from "lucide-react"
import { MODELS, POSES, MODEL_POSES, CLOTHING, STEPS } from "@/constants/data"
import { Notice } from "@/components/notice"

type Step = "model" | "pose" | "clothing" | "result"
type TaskStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | ""
type Generation = {
  id: string
  model: string
  poses: string[]
  clothing: string[]
  imageUrl: string
  createdAt: Date
}

// Mapping from optimized pose filename (.webp) to upscaled filename (.png/.jpg)


export default function HerveStudioDashboard() {
  const [currentStep, setCurrentStep] = useState<Step>("model")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedPose, setSelectedPose] = useState<string>("")
  const [selectedClothing, setSelectedClothing] = useState<string>("")
  const [customClothingImage, setCustomClothingImage] = useState<string>("")
  const [customClothingFileName, setCustomClothingFileName] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generations, setGenerations] = useState<Generation[]>([])
  const [taskId, setTaskId] = useState<string>("")
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("")
  const [showLoading, setShowLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(false)
  const [outputImage, setOutputImage] = useState<string>("")

  // API: Fetch task output
  const fetchTaskOutput = async (taskId: string) => {
    try {
      const res = await fetch("https://www.runninghub.ai/task/openapi/outputs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Host": "www.runninghub.ai"
        },
        body: JSON.stringify({
          apiKey: "23b1478707ce4a00911b904d62dbb503",
          taskId
        })
      })
      
      const data = await res.json()
      if (data.code === 0 && data.data?.[1]?.fileUrl) {
        setOutputImage(data.data[1].fileUrl)
      } else if (data.code === 805) {
        console.error('Task failed:', data.data?.failedReason)
        setTaskStatus("FAILED")
      }
    } catch (error) {
      console.error('Error fetching task output:', error)
      setTaskStatus("FAILED")
    } finally {
      setShowLoading(false)
    }
  }

  // Helper: get S3 URLs for selected model and pose
  const getModelImageUrl = () => MODELS.find((m) => m.id === selectedModel)?.image || ""
  const getPoseImageUrl = () => {
      if (!selectedPose) return ""
      // selectedPose may be a public path like "/poses_v3_optimized/upscaled_Aliya_run1.webp"
      const filename = selectedPose.split("/").pop() || selectedPose
      // Use the S3 poses_v3 path as the canonical source
      return `https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses_v3/${filename}`
    }

  const getCurrentStepIndex = () => STEPS.findIndex((step) => step.key === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case "model":
        return selectedModel !== ""
      case "pose":
        return selectedPose !== ""
      case "clothing":
        return selectedClothing !== ""
      case "result":
        return true
      default:
        return false
    }
  }

  // API: Poll task status
  const pollTaskStatus = async (taskId: string) => {
    let status = "RUNNING"
    
    while (status === "RUNNING" || status === "QUEUED") {
      try {
        const res = await fetch("https://www.runninghub.ai/task/openapi/status", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Host": "www.runninghub.ai"
          },
          body: JSON.stringify({
            apiKey: "23b1478707ce4a00911b904d62dbb503",
            taskId
          })
        })
        const data = await res.json()
        
        if (data.code === 0) {
          status = data.data
          setTaskStatus(status as TaskStatus)
          
          if (status === "FAILED") {
            setShowLoading(false)
            break
          }
          
          if (status === "SUCCESS") {
            await fetchTaskOutput(taskId)

            break
          }
        }
        
        // Wait 3 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 3000))
      } catch (error) {
        console.error('Error checking task status:', error)
        setShowLoading(false)
        break
      }
    }
  }

  // pose-to-result generation removed: we now use pregenerated poses and only run clothing-related APIs

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex()
    
    // If moving from pose to clothing, skip generation and go directly to clothing selection
    if (STEPS[currentIndex].key === "pose" && selectedModel && selectedPose !== "") {
      setCurrentStep("clothing")
      return
    }
    


    if (currentStep === "clothing" && selectedClothing) {
      startFinalProcessing()
      setCurrentStep("result")
      return
    }
    
    
    
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].key)
    }
  }

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].key)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newGeneration: Generation = {
      id: `gen-${Date.now()}`,
      model: MODELS.find((m) => m.id === selectedModel)?.name || "",
      poses: [
        // Derive a friendly pose name from the selectedPose (filename)
        selectedPose ? (selectedPose.split('/').pop() || selectedPose) : ""
      ],
  clothing: selectedClothing ? [CLOTHING.find((c) => c.id === selectedClothing)?.name || ""] : [],
  imageUrl: `/placeholder.svg?height=400&width=300&query=AI fashion model wearing ${CLOTHING.find((c) => c.id === selectedClothing)?.name || ""}`,
      createdAt: new Date(),
    }

    setGenerations((prev) => [newGeneration, ...prev])
    setIsGenerating(false)

    setSelectedModel("")
    setSelectedPose("")
    setSelectedClothing("")
    setCurrentStep("model")
  }

  const togglePose = (poseId: string) => {
    setSelectedPose((prev) => (prev === poseId ? "" : poseId))
  }

  const uploadToRunningHub = async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append("apiKey", "23b1478707ce4a00911b904d62dbb503")
      formData.append("file", file)
      formData.append("fileType", "image")

      const response = await fetch("https://www.runninghub.ai/task/openapi/upload", {
        method: "POST",
        headers: {
          "Host": "www.runninghub.ai"
        },
        body: formData
      })

      const data = await response.json()
      if (data.code === 0 && data.data?.fileName) {
        return data.data.fileName
      } else {
        throw new Error(data.msg || "Upload failed")
      }
    } catch (error) {
      console.error("Error uploading to RunningHub:", error)
      throw error
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        setUploadProgress(true)
        // Show preview immediately
        const reader = new FileReader()
        reader.onloadend = () => {
          setCustomClothingImage(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to RunningHub
        const fileName = await uploadToRunningHub(file)
        setCustomClothingFileName(fileName)
        setSelectedClothing("custom")
      } catch (error) {
        console.error("Failed to upload clothing image:", error)
        alert("Failed to upload image. Please try again.")
        setCustomClothingImage("")
        setCustomClothingFileName("")
        setSelectedClothing("")
      } finally {
        setUploadProgress(false)
      }
    }
  }

  const toggleClothing = (clothingId: string) => {
    setSelectedClothing((prev: string) => {
      const newValue = prev === clothingId ? "" : clothingId
      if (newValue !== "custom") {
        setCustomClothingImage("")
        setCustomClothingFileName("")
      }
      return newValue
    })
  }

  const getClothingImageUrl = () => {
    if (selectedClothing === "custom" && customClothingFileName) {
      // Return the RunningHub fileName for custom uploads
      return customClothingFileName
    }
    const clothingImages = [
      "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing1.jpeg",
      "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing2.webp",
      "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing3.jpg",
      "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing4.jpg"
    ];
    const idx = CLOTHING.findIndex(c => c.id === selectedClothing);
    return clothingImages[idx] || clothingImages[0];
  }

  

  const startFinalProcessing = async () => {
    setTaskStatus("RUNNING")
    setShowLoading(true)
    
    const body = {
      webappId: "1961616229582704642",
      apiKey: "23b1478707ce4a00911b904d62dbb503",
      nodeInfoList: [
        {
          nodeId: "61",
          fieldName: "image",
          fieldValue: (() => {
            if (!selectedPose) return ""
            const poseObj = POSES.find(p => p.id === selectedPose.split('/').pop())
            const upscaled = poseObj?.upscaled || selectedPose.split('/').pop()
            return `https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses_v3_upscaled/${upscaled}`
          })(),
          description: "Character image"
        },
        {
          nodeId: "60",
          fieldName: "image",
          fieldValue: getClothingImageUrl(),
          description: "Clothing image"
        }
      ]
    }

    try {
      const res = await fetch("https://www.runninghub.ai/task/openapi/ai-app/run", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Host": "www.runninghub.ai"
        },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.code === 0 && data.data?.taskId) {
        const taskId = data.data.taskId
        setTaskId(taskId)
        pollTaskStatus(taskId)
      } else {
        console.error('Error starting final processing:', data)
        setTaskStatus("FAILED")
        setShowLoading(false)
      }
    } catch (error) {
      console.error('Error in final processing:', error)
      setTaskStatus("FAILED")
      setShowLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      

      case "model":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MODELS.map((model) => (
              <Card
                key={model.id}
                className={`cursor-pointer transition-all hover:shadow-lg p-0 ${
                  selectedModel === model.id ? "ring-2 ring-primary bg-accent/10" : ""
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <img
                      src={model.image || "/placeholder.svg"}
                      alt={model.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute left-2 bottom-2 bg-black/50 text-white text-sm font-semibold px-2 py-1 rounded">
                      {model.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case "pose":
        // If no model selected, prompt the user
        if (!selectedModel) {
          return (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <p className="text-center text-muted-foreground">Please select a model first to view pregenerated poses.</p>
            </div>
          )
        }

        // Determine model key (lowercase name) and fetch pose filenames
        const modelName = MODELS.find(m => m.id === selectedModel)?.name || ""
        const posesForModel = MODEL_POSES[modelName.toLowerCase()] || MODEL_POSES["default"]

        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {posesForModel.map((posePath, idx) => {
              const poseId = `${selectedModel}-pose-${idx}`
              const isSelected = selectedPose === posePath
              const localUrl = posePath
              const s3Url = `https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses_v3/${posePath.split('/').pop()}`

              return (
                <Card
                  key={poseId}
                  className={`cursor-pointer transition-all hover:shadow-lg p-0 ${isSelected ? "ring-2 ring-primary bg-accent/10" : ""}`}
                  onClick={() => setSelectedPose(posePath)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                      <img
                        src={s3Url}
                        onError={(e: any) => { e.currentTarget.src = localUrl }}
                        alt={`Pose ${idx + 1}`}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute left-2 bottom-2 bg-black/50 text-white text-sm font-semibold px-2 py-1 rounded">
                        {POSES.find(p => p.id === posePath.split('/').pop())?.name || `Pose ${idx + 1}`}
                      </div>
                      {isSelected && (
                        <div className="absolute right-2 top-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Selected</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )

      case "clothing":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Upload Card */}
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedClothing === "custom" ? "ring-2 ring-primary bg-accent/10" : ""
                } ${uploadProgress ? "opacity-70" : ""}`}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadProgress}
                      className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {customClothingImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={customClothingImage}
                          alt="Custom clothing"
                          className="w-full h-full object-cover object-center"
                        />
                        {uploadProgress && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Loader2 className="w-8 h-8 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-muted p-4">
                        <Shirt className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-center text-muted-foreground">
                          {uploadProgress ? "Uploading..." : "Upload custom clothing image"}
                        </p>
                      </div>
                    )}
                    <div className="absolute left-2 bottom-2 bg-black/50 text-white text-sm font-semibold px-2 py-1 rounded">
                      Custom Upload
                    </div>
                    {selectedClothing === "custom" && !uploadProgress && (
                      <div className="absolute right-2 top-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Selected</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Predefined Clothing Cards */}
              {CLOTHING.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedClothing === item.id ? "ring-2 ring-primary bg-accent/10" : ""
                  }`}
                  onClick={() => toggleClothing(item.id)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={(() => {
                          const clothingImages = [
                            "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing1.jpeg",
                            "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing2.webp",
                            "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing3.jpg",
                            "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing4.jpg"
                          ];
                          const idx = CLOTHING.findIndex(c => c.id === item.id);
                          return clothingImages[idx] || "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing1.jpg";
                        })()}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute left-2 bottom-2 bg-black/50 text-white text-sm font-semibold px-2 py-1 rounded">
                        {item.name}
                      </div>
                      {selectedClothing === item.id && (
                        <div className="absolute right-2 top-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Selected</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )


      case "result":
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center">
              {showLoading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="text-lg font-semibold mb-2">Processing...</p>
                  <p className="text-sm text-muted-foreground">Waiting for result</p>
                </div>
              ) : outputImage ? (
                <div className="my-6 max-w-md">
                  <img 
                    src={outputImage} 
                    alt="Result"
                    className="w-full rounded-lg shadow-lg" 
                  />
                </div>
              ) : (
                <p className="text-muted-foreground">No result yet.</p>
              )}
              {outputImage && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setCurrentStep("model")
                      setSelectedModel("")
                      setSelectedPose("")
                      setSelectedClothing("")
                      setOutputImage("")
                      setTaskStatus("")
                    }}
                    className="mt-4"
                    variant="outline"
                  >
                    Start New Generation
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
        
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-work-sans)" }}>
                Herve Studio
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Notice />
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = step.key === currentStep
              const isCompleted = getCurrentStepIndex() > index

              return (
                <div key={step.key} className="flex items-center">
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{step.title}</span>
                  </div>
                  {index < STEPS.length - 1 && <div className="w-8 h-px bg-border mx-2" />}
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="w-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>
                    Step {getCurrentStepIndex() + 1}: {STEPS[getCurrentStepIndex()].title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderStepContent()}

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handlePrevious} disabled={getCurrentStepIndex() === 0}>
                    Previous
                  </Button>

                  {getCurrentStepIndex() === STEPS.length - 1 ? (
                    <Button onClick={handleGenerate} disabled={!canProceed() || isGenerating} className="min-w-[120px]">
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} disabled={!canProceed()}>
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {generations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-work-sans)" }}>
              Previous Generations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {generations.map((generation) => (
                <Card key={generation.id} className="overflow-hidden">
                  <div className="aspect-[3/4] bg-muted">
                    <img
                      src={generation.imageUrl || "/placeholder.svg"}
                      alt="Generated fashion model"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Model:</span>
                        <p className="text-sm font-medium">{generation.model}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Poses:</span>
                        <p className="text-sm">{generation.poses.join(", ")}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Clothing:</span>
                        <p className="text-sm">{generation.clothing.join(", ")}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{generation.createdAt.toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
