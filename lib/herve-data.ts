// lib/herve-data.ts
export type Model = {
  id: string
  name: string
  type: "Male" | "Female"
  image: string
}

export type Pose = {
  id: string
  name: string
  type: "Male" | "Female"
}

export type Clothing = {
  id: string
  name: string
  type: "Top" | "Bottom"
  image?: string
}

export const MODELS: Model[] = [
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

export const POSES: Pose[] = [
  // Female poses
  { id: "pose-1", name: "Female One Feet Up", type: "Female" },
  { id: "pose-2", name: "Female Standing Legs Crossed", type: "Female" },
  { id: "pose-3", name: "Female Turned Around 1", type: "Female" },
  { id: "pose-4", name: "Female Turned Around 2", type: "Female" },
  { id: "pose-5", name: "Female Sideways 1", type: "Female" },
  { id: "pose-6", name: "Female Sideways 2", type: "Female" },
  { id: "pose-7", name: "Female Standing 1", type: "Female" },
  { id: "pose-8", name: "Female Standing 2", type: "Female" },
  { id: "pose-9", name: "Female Standing 3", type: "Female" },
  { id: "pose-10", name: "Female Standing 4", type: "Female" },
  { id: "pose-11", name: "Female Standing 5", type: "Female" },
  { id: "pose-12", name: "Female Standing 6", type: "Female" },
  // Male poses
  { id: "pose-13", name: "Male Sideways 1", type: "Male" },
  { id: "pose-14", name: "Male Sideways 2", type: "Male" },
  { id: "pose-15", name: "Male Sideways 3", type: "Male" },
  { id: "pose-16", name: "Male Standing 1", type: "Male" },
  { id: "pose-17", name: "Male Standing 2", type: "Male" },
  { id: "pose-18", name: "Male Standing 3", type: "Male" },
  { id: "pose-19", name: "Male Standing 4", type: "Male" },
  { id: "pose-20", name: "Male Turned Around", type: "Male" }
]

export const CLOTHING: Clothing[] = [
  { id: "clothing-1", name: "Classic White T-Shirt", type: "Top", image: "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing1.jpeg" },
  { id: "clothing-2", name: "Denim Jeans", type: "Bottom", image: "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing2.jpeg" },
  { id: "clothing-3", name: "Black Hoodie", type: "Top", image: "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing3.jpeg" },
  { id: "clothing-4", name: "Cargo Pants", type: "Bottom", image: "https://herve-studio-prod.s3.amazonaws.com/clothes/clothing4.jpeg" },
]
