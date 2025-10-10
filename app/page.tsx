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

type Step = "model" | "pose" | "clothing" | "region" | "final-processing" | "complete" | "realistic-processing"
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
  { key: "clothing", title: "Select Clothing", icon: Shirt },
  { key: "region", title: "Select Region", icon: Sparkles },
  { key: "final-processing", title: "Final Processing", icon: Loader2 },
  { key: "complete", title: "Complete", icon: CheckCircle },
  { key: "realistic-processing", title: "Enhance Realism", icon: Sparkles },
]

const MODELS = [
  { id: "model-aliya", name: "Aliya", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/aliya.webp" },
  { id: "model-anushka", name: "Anushka", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/anushka.webp" },
  { id: "model-chamika", name: "Chamika", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/chamika.webp" },
  { id: "model-diyani", name: "Diyani", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/diyani.webp" },
  { id: "model-lahiru", name: "Lahiru", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/lahiru.webp" },
  { id: "model-manoj", name: "Manoj", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/manoj.webp" },
  { id: "model-nimali", name: "Nimali", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/nimali.webp" },
  { id: "model-priya", name: "Priya", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/priya.webp" },
  { id: "model-ruwan", name: "Ruwan", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/ruwan.webp" },
  { id: "model-sajith", name: "Sajith", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/sajith.webp" },
  { id: "model-saroja", name: "Saroja", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/saroja.webp" },
  { id: "model-tharu", name: "Tharu", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/tharu.webp" },
  { id: "model-vindya", name: "Vindya", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/vindya.webp" },
  { id: "model-zack", name: "Zack", type: "Male", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/zack.webp" },
]

// NOTE: POSES kept for metadata (name/type) but actual images come from MODEL_POSES mapping below
const POSES = [
  { id: "upscaled_Aliya_run1.webp", name: "Aliya run1" },
  { id: "upscaled_Aliya_run2.webp", name: "Aliya run2" },
  { id: "upscaled_Aliya_run3.webp", name: "Aliya run3" },
  { id: "upscaled_Anushka_run1.webp", name: "Anushka run1" },
  { id: "upscaled_Anushka_run2.webp", name: "Anushka run2" },
  { id: "upscaled_Chamika_run1.webp", name: "Chamika run1" },
  { id: "upscaled_Chamika_run3.webp", name: "Chamika run3" },
  { id: "upscaled_Diyani_run1.webp", name: "Diyani run1" },
  { id: "upscaled_Diyani_run2.webp", name: "Diyani run2" },
  { id: "upscaled_Diyani_run3.webp", name: "Diyani run3" },
  { id: "upscaled_Lahiru_run2.webp", name: "Lahiru run2" },
  { id: "upscaled_Lahiru_run3.webp", name: "Lahiru run3" },
  { id: "upscaled_Manoj_run1.webp", name: "Manoj run1" },
  { id: "upscaled_Manoj_run3.webp", name: "Manoj run3" },
  { id: "upscaled_Nimali_run1.webp", name: "Nimali run1" },
  { id: "upscaled_Nimali_run2.webp", name: "Nimali run2" },
  { id: "upscaled_Nimali_run3.webp", name: "Nimali run3" },
  { id: "upscaled_Priya_run1.webp", name: "Priya run1" },
  { id: "upscaled_Priya_run2.webp", name: "Priya run2" },
  { id: "upscaled_Ruwan_run1.webp", name: "Ruwan run1" },
  { id: "upscaled_Ruwan_run3.webp", name: "Ruwan run3" },
  { id: "upscaled_Sajith_run1.webp", name: "Sajith run1" },
  { id: "upscaled_Saroja_run1.webp", name: "Saroja run1" },
  { id: "upscaled_Saroja_run3.webp", name: "Saroja run3" },
  { id: "upscaled_Tharu_run1.webp", name: "Tharu run1" },
  { id: "upscaled_Tharu_run2.webp", name: "Tharu run2" },
  { id: "upscaled_Tharu_run3.webp", name: "Tharu run3" },
  { id: "upscaled_Vindya_run1.webp", name: "Vindya run1" },
  { id: "upscaled_Vindya_run2.webp", name: "Vindya run2" },
  { id: "upscaled_Vindya_run3.webp", name: "Vindya run3" },
  { id: "upscaled_Zack_run1.webp", name: "Zack run1" },
  { id: "upscaled_Zack_run2.webp", name: "Zack run2" },
  { id: "upscaled_Zack_run3.webp", name: "Zack run3" }
]

const CLOTHING = [
  { id: "clothing-1", name: "Classic White T-Shirt", type: "Top" },
  { id: "clothing-2", name: "Denim Jeans", type: "Bottom" },
  { id: "clothing-3", name: "Black Hoodie", type: "Top" },
  { id: "clothing-4", name: "Cargo Pants", type: "Bottom" },
]

// Map model names (case-insensitive) to arrays of pregenerated pose filenames found in public/poses_v3_optimized
// Filenames discovered in the repo's public folder. Fallback to S3 path if not served locally.
const MODEL_POSES: Record<string, string[]> = {
  aliya: [
    "/poses_v3_optimized/upscaled_Aliya_run1.webp",
    "/poses_v3_optimized/upscaled_Aliya_run2.webp",
    "/poses_v3_optimized/upscaled_Aliya_run3.webp",
    "/poses_v3_optimized/upscaled_Aliya_run4.webp"
  ],
  anushka: ["/poses_v3_optimized/upscaled_Anushka_run1.webp", "/poses_v3_optimized/upscaled_Anushka_run2.webp", "/poses_v3_optimized/upscaled_Anushka_run3.webp"],
  chamika: ["/poses_v3_optimized/upscaled_Chamika_run1.webp", "/poses_v3_optimized/upscaled_Chamika_run3.webp", "/poses_v3_optimized/upscaled_Chamika_run2.webp"],
  diyani: ["/poses_v3_optimized/upscaled_diyani_run1.webp","/poses_v3_optimized/upscaled_diyani_run2.webp","/poses_v3_optimized/upscaled_diyani_run3.webp", "/poses_v3_optimized/upscaled_diyani_run4.webp"],
  lahiru: ["/poses_v3_optimized/upscaled_Lahiru_run1.webp","/poses_v3_optimized/upscaled_Lahiru_run2.webp", "/poses_v3_optimized/upscaled_Lahiru_run3.webp"],
  manoj: ["/poses_v3_optimized/upscaled_Manoj_run1.webp","/poses_v3_optimized/upscaled_Manoj_run2.webp", "/poses_v3_optimized/upscaled_Manoj_run3.webp"],
  nimali: ["/poses_v3_optimized/upscaled_Nimali_run1.webp","/poses_v3_optimized/upscaled_Nimali_run2.webp","/poses_v3_optimized/upscaled_Nimali_run3.webp", "/poses_v3_optimized/upscaled_Nimali_run4.webp"],
  priya: ["/poses_v3_optimized/upscaled_Priya_run1.webp","/poses_v3_optimized/upscaled_Priya_run2.webp", "/poses_v3_optimized/upscaled_Priya_run3.webp"],
  ruwan: ["/poses_v3_optimized/upscaled_Ruwan_run1.webp","/poses_v3_optimized/upscaled_Ruwan_run2.webp", "/poses_v3_optimized/upscaled_Ruwan_run3.webp"],
  sajith: ["/poses_v3_optimized/upscaled_Sajith_run1.webp", "/poses_v3_optimized/upscaled_Sajith_run2.webp"],
  saroja: ["/poses_v3_optimized/upscaled_Saroja_run1.webp","/poses_v3_optimized/upscaled_Saroja_run2.webp", "/poses_v3_optimized/upscaled_Saroja_run3.webp"],
  tharu: ["/poses_v3_optimized/upscaled_Tharu_run1.webp","/poses_v3_optimized/upscaled_Tharu_run2.webp","/poses_v3_optimized/upscaled_Tharu_run3.webp", "/poses_v3_optimized/upscaled_Tharu_run4.webp"],
  vindya: ["/poses_v3_optimized/upscaled_Vindya_run1.webp","/poses_v3_optimized/upscaled_Vindya_run2.webp","/poses_v3_optimized/upscaled_Vindya_run3.webp", "/poses_v3_optimized/upscaled_Vindya_run4.webp"],
  zack: ["/poses_v3_optimized/upscaled_Zack_run1.webp","/poses_v3_optimized/upscaled_Zack_run2.webp","/poses_v3_optimized/upscaled_Zack_run3.webp", "/poses_v3_optimized/upscaled_Zack_run4.webp"],
  "default": ["/poses_v3_optimized/upscaled_Zack_run1.webp"]
}

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
      case "region":
        return selectedRegion !== ""
      case "final-processing":
        return taskStatus === "SUCCESS"
      case "realistic-processing":
        return taskStatus === "SUCCESS"
      case "complete":
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

  // pose-to-result generation removed: we now use pregenerated poses and only run clothing-related APIs

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex()
    
    // If moving from pose to clothing, skip generation and go directly to clothing selection
    if (STEPS[currentIndex].key === "pose" && selectedModel && selectedPose !== "") {
      setCurrentStep("clothing")
      return
    }
    
    // (old processing step removed) continue navigation checks below

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

    // Allow moving to next step when in final-processing and task is successful
    if (currentStep === "final-processing" && taskStatus === "SUCCESS") {
      setCurrentStep("complete")
      return
    }
    
    // Allow moving to next step when in realistic-processing and task is successful
    if (currentStep === "realistic-processing" && taskStatus === "SUCCESS") {
      setCurrentStep("complete")
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

  const startRealisticProcessing = async () => {
    setTaskStatus("RUNNING")
    setShowLoading(true)
    
    const body = {
      webappId: "1963826374476910593",
      apiKey: "23b1478707ce4a00911b904d62dbb503",
      nodeInfoList: [
        {
          nodeId: "120",
          fieldName: "image",
          fieldValue: outputImage,
          description: "Input Image"
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
        console.error('Error starting realistic processing:', data)
        setTaskStatus("FAILED")
        setShowLoading(false)
      }
    } catch (error) {
      console.error('Error in realistic processing:', error)
      setTaskStatus("FAILED")
      setShowLoading(false)
    }
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
              
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    startRealisticProcessing()
                    setCurrentStep("realistic-processing")
                  }}
                  className="mt-4"
                >
                  Make More Realistic
                </Button>
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
            </div>
          </div>
        )
        
      case "realistic-processing":
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            {showLoading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-lg font-semibold mb-2">Enhancing image realism...</p>
                <p className="text-sm text-muted-foreground">This may take a few minutes</p>
              </div>
            ) : taskStatus === "FAILED" ? (
              <div className="flex flex-col items-center">
                <XCircle className="w-8 h-8 text-destructive mb-4" />
                <p className="text-lg font-semibold mb-2">Enhancement Failed</p>
                <p className="text-sm text-muted-foreground mb-4">Something went wrong. Please try again.</p>
                <div className="flex gap-4">
                  <Button onClick={() => startRealisticProcessing()}>Retry</Button>
                  <Button onClick={() => setCurrentStep("complete")} variant="outline">Go Back</Button>
                </div>
              </div>
            ) : taskStatus === "SUCCESS" ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 text-green-500 mb-4">
                  <CheckCircle className="w-8 h-8" />
                  <p className="text-lg font-semibold">Enhancement Complete!</p>
                </div>
                
                {outputImage && (
                  <div className="my-6 max-w-md">
                    <img 
                      src={outputImage} 
                      alt="Enhanced realistic result"
                      className="w-full h-auto rounded-lg shadow-lg" 
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
            ) : null}
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
