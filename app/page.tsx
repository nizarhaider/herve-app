"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Camera, Shirt } from "lucide-react"

type Step = "model" | "pose" | "clothing"
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
]

const MODELS = [
  { id: "model-1", name: "Kasun", type: "Male", image: "https://herve-studio-prod.s3.amazonaws.com/models/kasun.jpg" },
  { id: "model-2", name: "Ishara", type: "Male", image: "https://herve-studio-prod.s3.amazonaws.com/models/ishara.jpg" },
  { id: "model-3", name: "Sanduni", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/sanduni.jpg" },
  { id: "model-4", name: "Chamara", type: "Male", image: "https://herve-studio-prod.s3.amazonaws.com/models/chamara.jpg" },
  { id: "model-5", name: "Dinesh", type: "Male", image: "https://herve-studio-prod.s3.amazonaws.com/models/dinesh.jpg" },
  { id: "model-6", name: "Priyanka", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/priyanka.jpg" },
  { id: "model-7", name: "Thilini", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/thilini.jpg" },
  { id: "model-8", name: "Nimali", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/nimali.jpg" },
  { id: "model-9", name: "Ravindu", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/ravindu.jpg" },
  { id: "model-10", name: "Kavitha", type: "Male", image: "https://herve-studio-prod.s3.amazonaws.com/models/kavitha.jpg" },
  { id: "model-11", name: "Malini", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/malini.jpg" },
  { id: "model-12", name: "Asanka", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/asanka.jpg" },
  { id: "model-13", name: "Dilani", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/dilani.jpg" },
  { id: "model-14", name: "Nuwan", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/nuwan.jpg" },
  { id: "model-15", name: "Roshan", type: "Male", image: "https://herve-studio-prod.s3.amazonaws.com/models/roshan.jpg" },
  { id: "model-16", name: "Sachini", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/sachini.jpg" },
  { id: "model-17", name: "Amaya", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/amaya.jpg" },
  { id: "model-18", name: "Tharindu", type: "Male", image: "https://herve-studio-prod.s3.amazonaws.com/models/tharindu.jpg" },
  { id: "model-19", name: "Nayomi", type: "Male", image: "https://herve-studio-prod.s3.amazonaws.com/models/nayomi.jpg" },
  { id: "model-20", name: "Rashika", type: "Female", image: "https://herve-studio-prod.s3.amazonaws.com/models/rashika.jpg" },
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
  const [selectedPoses, setSelectedPoses] = useState<string[]>([])
  const [selectedClothing, setSelectedClothing] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generations, setGenerations] = useState<Generation[]>([])

  const getCurrentStepIndex = () => STEPS.findIndex((step) => step.key === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case "model":
        return selectedModel !== ""
      case "pose":
        return selectedPoses.length > 0
      case "clothing":
        return selectedClothing !== ""
      default:
        return false
    }
  }

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex()
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
      poses: selectedPoses.map((id) => POSES.find((p) => p.id === id)?.name || ""),
  clothing: selectedClothing ? [CLOTHING.find((c) => c.id === selectedClothing)?.name || ""] : [],
  imageUrl: `/placeholder.svg?height=400&width=300&query=AI fashion model wearing ${CLOTHING.find((c) => c.id === selectedClothing)?.name || ""}`,
      createdAt: new Date(),
    }

    setGenerations((prev) => [newGeneration, ...prev])
    setIsGenerating(false)

    setSelectedModel("")
    setSelectedPoses([])
  setSelectedClothing("")
    setCurrentStep("model")
  }

  const togglePose = (poseId: string) => {
    setSelectedPoses((prev) => (prev.includes(poseId) ? prev.filter((id) => id !== poseId) : [...prev, poseId]))
  }

  const toggleClothing = (clothingId: string) => {
  setSelectedClothing((prev) => (prev === clothingId ? "" : clothingId))
  }

  const renderStepContent = () => {
    switch (currentStep) {
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
                  selectedPoses.includes(pose.id) ? "ring-2 ring-primary bg-accent/10" : ""
                }`}
                onClick={() => togglePose(pose.id)}
              >
                <CardContent className="p-4">
                  <div className="aspect-[3/4] bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <img
                      src={(() => {
                        const poseImages = [
                          "https://herve-studio-prod.s3.amazonaws.com/poses/pose1.jpg",
                          "https://herve-studio-prod.s3.amazonaws.com/poses/pose2.jpg",
                          "https://herve-studio-prod.s3.amazonaws.com/poses/pose3.jpg",
                          "https://herve-studio-prod.s3.amazonaws.com/poses/pose4.jpg",
                          "https://herve-studio-prod.s3.amazonaws.com/poses/pose5.jpg",
                          "https://herve-studio-prod.s3.amazonaws.com/poses/pose6.jpg"
                        ];
                        const idx = POSES.findIndex(p => p.id === pose.id);
                        return poseImages[idx] || "/poses/1L9A2953.webp";
                      })()}
                      alt={pose.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-sm">{pose.name}</h3>
                  {selectedPoses.includes(pose.id) && <Badge className="text-xs mt-1">Selected</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case "clothing":
        return (
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
                          "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing1.jpg",
                          "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing2.jpg",
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
                  <Badge variant="secondary" className="text-xs">
                    {item.type}
                  </Badge>
                  {selectedClothing === item.id && <Badge className="text-xs mt-1">Selected</Badge>}
                </CardContent>
              </Card>
            ))}
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
