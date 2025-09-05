"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Sparkles, Camera, Shirt, CheckCircle, XCircle } from "lucide-react"

type Step = "model" | "pose" | "result" | "clothing" | "region" | "final-processing" | "complete"
type TaskStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | ""
type Generation = {
  id: string
  model: string
  poses: string[]
  clothing: string[]
  imageUrl: string
  createdAt: Date
}

const STEPS: { key: Step; title: string; icon: any }[] = [
  { key: "model", title: "Select Model", icon: Camera },
  { key: "pose", title: "Select Pose(s)", icon: Sparkles },
  { key: "result", title: "Processing", icon: Loader2 },
  { key: "clothing", title: "Select Clothing", icon: Shirt },
  { key: "region", title: "Select Region", icon: Sparkles },
  { key: "final-processing", title: "Final Processing", icon: Loader2 },
  { key: "complete", title: "Complete", icon: CheckCircle },
]

const MODELS = [
  { id: "model-1", name: "Kasun", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/kasun.jpg" },
  { id: "model-2", name: "Ishara", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/ishara.jpg" },
  { id: "model-3", name: "Sanduni", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/sanduni.jpg" },
  { id: "model-4", name: "Chamara", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/chamara.jpg" },
  { id: "model-5", name: "Dinesh", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/dinesh.jpg" },
  { id: "model-6", name: "Priyanka", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/priyanka.jpg" },
  { id: "model-7", name: "Thilini", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/thilini.jpg" },
  { id: "model-8", name: "Nimali", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/nimali.jpg" },
  { id: "model-9", name: "Ravindu", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/ravindu.jpg" },
  { id: "model-10", name: "Kavitha", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/kavitha.jpg" },
  { id: "model-11", name: "Malini", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/malini.jpg" },
  { id: "model-12", name: "Asanka", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/asanka.jpg" },
  { id: "model-13", name: "Dilani", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/dilani.jpg" },
  { id: "model-14", name: "Nuwan", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/nuwan.jpg" },
  { id: "model-15", name: "Roshan", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/roshan.jpg" },
  { id: "model-16", name: "Sachini", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/sachini.jpg" },
  { id: "model-17", name: "Amaya", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/amaya.jpg" },
  { id: "model-18", name: "Tharindu", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/tharindu.jpg" },
  { id: "model-19", name: "Nayomi", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/nayomi.jpg" },
  { id: "model-20", name: "Rashika", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models/rashika.jpg" },
]

const POSES = [
  { id: "pose-1", name: "Standing Confident" },
  { id: "pose-2", name: "Walking Dynamic" },
  { id: "pose-3", name: "Sitting Casual" },
  { id: "pose-4", name: "Profile View" },
  { id: "pose-5", name: "Action Shot" },
  { id: "pose-6", name: "Close-up Portrait" },
]

const CLOTHING = [
  { id: "clothing-1", name: "Classic White T-Shirt", type: "Top" },
  { id: "clothing-2", name: "Denim Jeans", type: "Bottom" },
  { id: "clothing-3", name: "Black Hoodie", type: "Top" },
  { id: "clothing-4", name: "Cargo Pants", type: "Bottom" },
]

export default function HerveStudioDashboard() {
  const [currentStep, setCurrentStep] = useState<Step>("model")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedPose, setSelectedPose] = useState<string>("")
  const [selectedClothing, setSelectedClothing] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generations, setGenerations] = useState<Generation[]>([])
  const [taskId, setTaskId] = useState<string>("")
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("")
  const [showLoading, setShowLoading] = useState(false)
  const [outputImage, setOutputImage] = useState<string>("")
  const [selectedRegion, setSelectedRegion] = useState<"tshirt" | "pants" | "">("")

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
      if (data.code === 0 && data.data?.[0]?.fileUrl) {
        setOutputImage(data.data[0].fileUrl)
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
    const poseImages = [
      "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose1.webp",
      "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose2.webp",
      "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose3.webp",
      "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose4.webp",
      "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose5.webp",
      "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose6.webp"
    ];
    const idx = POSES.findIndex(p => p.id === selectedPose);
    return poseImages[idx] || poseImages[0];
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
      case "region":
        return selectedRegion !== ""
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
            if (currentStep === "final-processing") {
              setCurrentStep("complete")
            }
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

  // API: Run AI App Task
  const runTask = async () => {
    setShowLoading(true)
    setTaskStatus("RUNNING")

    const body = {
      webappId: "1963525170214440961",
      apiKey: "23b1478707ce4a00911b904d62dbb503",
      nodeInfoList: [
        {
          nodeId: "39",
          fieldName: "image",
          fieldValue: getPoseImageUrl(),
          description: "Pose Image"
        },
        {
          nodeId: "4",
          fieldName: "image",
          fieldValue: getModelImageUrl(),
          description: "Model Image"
        }
      ]
    }

    try {
      const res = await fetch("https://www.runninghub.ai/task/openapi/ai-app/run", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.code === 0 && data.data?.taskId) {
        const taskId = data.data.taskId
        setTaskId(taskId)
        pollTaskStatus(taskId)
      }
    } catch (error) {
      console.error('Error running task:', error)
      setShowLoading(false)
    }
  }

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex()
    
    // If moving from pose to result, trigger API and show loading
    if (STEPS[currentIndex].key === "pose" && selectedModel && selectedPose !== "") {
      runTask()
      setCurrentStep("result")
      return
    }
    
    // Only allow moving to clothing if processing is successful
    if (currentStep === "result" && taskStatus !== "SUCCESS") {
      return
    }

    // If moving from clothing selection to region selection
    if (currentStep === "clothing" && selectedClothing) {
      return setCurrentStep("region")
    }

    // If moving to final processing after region selection
    if (currentStep === "region" && selectedRegion) {
      startFinalProcessing()
      setCurrentStep("final-processing")
      return
    }

    // Only allow moving to complete if final processing is successful
    if (currentStep === "final-processing" && taskStatus !== "SUCCESS") {
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
      poses: [POSES.find((p) => p.id === selectedPose)?.name || ""],
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

  const toggleClothing = (clothingId: string) => {
    setSelectedClothing((prev: string) => (prev === clothingId ? "" : clothingId))
  }

  const getClothingImageUrl = () => {
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
      webappId: "1963659857947758593",
      apiKey: "23b1478707ce4a00911b904d62dbb503",
      nodeInfoList: [
        {
          nodeId: "178",
          fieldName: "image",
          fieldValue: outputImage, // Using the generated image from previous step
          description: "Model Image"
        },
        {
          nodeId: "542",
          fieldName: "image",
          fieldValue: getClothingImageUrl(),
          description: "Garment Image"
        },
        {
          nodeId: "714",
          fieldName: "text",
          fieldValue: selectedRegion,
          description: "Region of Interest"
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
      case "result":
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            {taskStatus === "SUCCESS" ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-2 text-green-500 mb-4">
                    <CheckCircle className="w-8 h-8" />
                    <p className="text-lg font-semibold">Processing Complete!</p>
                  </div>
                  
                  {outputImage && (
                    <div className="my-6 max-w-md">
                      <img 
                        src={outputImage} 
                        alt="Generated result" 
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                  
                  <Button onClick={() => setCurrentStep("clothing")} className="mt-4">
                    Continue to Clothing Selection
                  </Button>
                </div>
              </>
            ) : taskStatus === "FAILED" ? (
              <>
                <div className="flex items-center space-x-2 text-red-500 mb-4">
                  <XCircle className="w-8 h-8" />
                  <p className="text-lg font-semibold">Processing Failed</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Something went wrong. Please try again.
                </p>
                <Button onClick={() => setCurrentStep("pose")} variant="outline">
                  Go Back
                </Button>
              </>
            ) : (
              <>
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-lg font-semibold mb-2">Processing your selection...</p>
                <p className="text-sm text-muted-foreground">Current Status: {taskStatus}</p>
              </>
            )}
          </div>
        )

      case "model":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {MODELS.map((model) => (
              <Card
                key={model.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedModel === model.id ? "ring-2 ring-primary bg-accent/10" : ""
                }`}
                onClick={() => setSelectedModel(model.id)}
              >
                <CardContent className="p-4">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-3 overflow-hidden">
                    <img
                      src={model.image || "/placeholder.svg"}
                      alt={model.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h3 className="font-semibold text-sm">{model.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {model.type}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case "pose":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {POSES.map((pose) => (
              <Card
                key={pose.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPose === pose.id ? "ring-2 ring-primary bg-accent/10" : ""
                }`}
                onClick={() => togglePose(pose.id)}
              >
                <CardContent className="p-4">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={(() => {
                        const poseImages = [
                          "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose1.webp",
                          "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose2.webp",
                          "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose3.webp",
                          "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose4.webp",
                          "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose5.webp",
                          "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/poses/pose6.webp"
                        ];
                        const idx = POSES.findIndex(p => p.id === pose.id);
                        return poseImages[idx] || "/poses/1L9A2953.webp";
                      })()}
                      alt={pose.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-sm">{pose.name}</h3>
                  {selectedPose === pose.id && <Badge className="text-xs mt-1">Selected</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case "clothing":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CLOTHING.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedClothing === item.id ? "ring-2 ring-primary bg-accent/10" : ""
                  }`}
                  onClick={() => toggleClothing(item.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
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
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                    <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                    {selectedClothing === item.id && <Badge className="text-xs mt-1">Selected</Badge>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "region":
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-lg font-semibold mb-2">Select Region to Replace</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose which part of the model you want to replace with the selected clothing
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant={selectedRegion === "tshirt" ? "default" : "outline"}
                  onClick={() => setSelectedRegion("tshirt")}
                  className="flex-1"
                >
                  T-Shirt Area
                </Button>
                <Button
                  variant={selectedRegion === "pants" ? "default" : "outline"}
                  onClick={() => setSelectedRegion("pants")}
                  className="flex-1"
                >
                  Pants Area
                </Button>
              </div>
            </div>
          </div>
        )

      case "final-processing":
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            {showLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-lg font-semibold mb-2">Applying clothing style...</p>
                <p className="text-sm text-muted-foreground">This may take a few minutes</p>
              </div>
            ) : taskStatus === "FAILED" ? (
              <div className="flex flex-col items-center">
                <XCircle className="w-8 h-8 text-destructive mb-4" />
                <p className="text-lg font-semibold mb-2">Processing Failed</p>
                <p className="text-sm text-muted-foreground mb-4">Something went wrong. Please try again.</p>
                <Button onClick={() => startFinalProcessing()}>Retry</Button>
              </div>
            ) : taskStatus === "SUCCESS" ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
                <p className="text-lg font-semibold mb-2">Processing Complete!</p>
                {outputImage && (
                  <div className="my-6 max-w-md">
                    <img 
                      src={outputImage} 
                      alt="Final result with clothing"
                      className="w-full h-auto rounded-lg shadow-lg" 
                    />
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )
        
      case "complete":
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-2 text-green-500 mb-4">
                <CheckCircle className="w-8 h-8" />
                <p className="text-lg font-semibold">All Done!</p>
              </div>
              
              {outputImage && (
                <div className="my-6 max-w-md">
                  <img 
                    src={outputImage} 
                    alt="Final result"
                    className="w-full rounded-lg shadow-lg" 
                  />
                </div>
              )}
              
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
              >
                Start New Generation
              </Button>
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
