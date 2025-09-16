"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

import { CLOTHING } from "@/lib/herve-data"
import { startFinalProcessing } from "@/lib/herve-api"

export default function ClothingGenerator({ initialImage }: { initialImage: string }) {
  const [selectedClothing, setSelectedClothing] = useState<string>("")
  const [selectedRegion, setSelectedRegion] = useState<"tshirt" | "pants" | "">("")
  const [outputImage, setOutputImage] = useState(initialImage)
  const [taskStatus, setTaskStatus] = useState<"PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "">("")
  const [showLoading, setShowLoading] = useState(false)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Clothing Generator</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {CLOTHING.map((item) => (
          <Card
            key={item.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedClothing === item.id ? "ring-2 ring-primary bg-accent/10" : ""}`}
            onClick={() => setSelectedClothing(item.id)}
          >
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
              </div>
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <Badge variant="secondary" className="text-xs">{item.type}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 justify-center mb-6">
        <Button variant={selectedRegion === "tshirt" ? "default" : "outline"} onClick={() => setSelectedRegion("tshirt")}>T-Shirt Area</Button>
        <Button variant={selectedRegion === "pants" ? "default" : "outline"} onClick={() => setSelectedRegion("pants")}>Pants Area</Button>
      </div>

      <div className="flex flex-col items-center">
        {showLoading && <Loader2 className="w-8 h-8 animate-spin mb-4" />}
        {taskStatus === "SUCCESS" && outputImage && (
          <div className="my-4">
            <img src={outputImage} alt="Generated Clothing" className="rounded-lg shadow-lg w-full max-w-md" />
          </div>
        )}
        <Button
          onClick={() => startFinalProcessing(outputImage, selectedClothing, selectedRegion, setTaskStatus, setOutputImage, setShowLoading)}
          disabled={!selectedClothing || !selectedRegion || taskStatus === "RUNNING"}
        >
          Apply Clothing
        </Button>
      </div>
    </div>
  )
}
