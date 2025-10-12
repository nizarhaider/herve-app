import { Sparkles, Camera, Shirt, CheckCircle } from "lucide-react"

type Step = "model" | "pose" | "clothing" | "result"

export const STEPS: { key: Step; title: string; icon: any }[] = [
  { key: "model", title: "Select Model", icon: Camera },
  { key: "pose", title: "Select Pose(s)", icon: Sparkles },
  { key: "clothing", title: "Select Clothing", icon: Shirt },
  { key: "result", title: "Result", icon: CheckCircle },
]

export const MODELS = [
  { id: "model-aliya", name: "Aliya", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/aliya.webp" },
  { id: "model-ella", name: "ella", type: "Female", image: "https://herve-studio-prod.s3.ap-southeast-1.amazonaws.com/models_v3/ella.webp" },
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

export const POSES = [
  { id: "upscaled_Aliya_run1.webp", upscaled: "upscaled_Aliya_run1.png", name: "Pose 1" },
  { id: "upscaled_Aliya_run2.webp", upscaled: "upscaled_Aliya_run2.png", name: "Pose 2" },
  { id: "upscaled_Aliya_run3.webp", upscaled: "upscaled_Aliya_run3.png", name: "Pose 3" },
  { id: "upscaled_Aliya_run4.webp", upscaled: "upscaled_Aliya_run4.jpg", name: "Pose 4" },
  { id: "upscaled_ella_run1.webp", upscaled: "upscaled_ella_run1.png", name: "Pose 1" },
  { id: "upscaled_ella_run2.webp", upscaled: "upscaled_ella_run2.png", name: "Pose 2" },
  { id: "upscaled_ella_run3.webp", upscaled: "upscaled_ella_run3.jpg", name: "Pose 3" },
  { id: "upscaled_Chamika_run1.webp", upscaled: "upscaled_Chamika_run1.png", name: "Pose 1" },
  { id: "upscaled_Chamika_run2.webp", upscaled: "upscaled_Chamika_run2.png", name: "Pose 2" },
  { id: "upscaled_Chamika_run3.webp", upscaled: "upscaled_Chamika_run3.jpg", name: "Pose 3" },
  { id: "upscaled_Diyani_run1.webp", upscaled: "upscaled_Diyani_run1.png", name: "Pose 1" },
  { id: "upscaled_Diyani_run2.webp", upscaled: "upscaled_Diyani_run2.png", name: "Pose 2" },
  { id: "upscaled_Diyani_run3.webp", upscaled: "upscaled_Diyani_run3.png", name: "Pose 3" },
  { id: "upscaled_Diyani_run4.webp", upscaled: "upscaled_Diyani_run4.jpg", name: "Pose 4" },
  { id: "upscaled_Lahiru_run1.webp", upscaled: "upscaled_Lahiru_run1.png", name: "Pose 1" },
  { id: "upscaled_Lahiru_run2.webp", upscaled: "upscaled_Lahiru_run2.png", name: "Pose 2" },
  { id: "upscaled_Lahiru_run3.webp", upscaled: "upscaled_Lahiru_run3.jpg", name: "Pose 3" },
  { id: "upscaled_Manoj_run1.webp", upscaled: "upscaled_Manoj_run1.png", name: "Pose 1" },
  { id: "upscaled_Manoj_run2.webp", upscaled: "upscaled_Manoj_run2.png", name: "Pose 2" },
  { id: "upscaled_Manoj_run3.webp", upscaled: "upscaled_Manoj_run3.jpg", name: "Pose 3" },
  { id: "upscaled_Nimali_run1.webp", upscaled: "upscaled_Nimali_run1.png", name: "Pose 1" },
  { id: "upscaled_Nimali_run2.webp", upscaled: "upscaled_Nimali_run2.png", name: "Pose 2" },
  { id: "upscaled_Nimali_run3.webp", upscaled: "upscaled_Nimali_run3.png", name: "Pose 3" },
  { id: "upscaled_Nimali_run4.webp", upscaled: "upscaled_Nimali_run4.png", name: "Pose 4" },
  { id: "upscaled_Priya_run1.webp", upscaled: "upscaled_Priya_run1.png", name: "Pose 1" },
  { id: "upscaled_Priya_run2.webp", upscaled: "upscaled_Priya_run2.png", name: "Pose 2" },
  { id: "upscaled_Priya_run3.webp", upscaled: "upscaled_Priya_run3.jpg", name: "Pose 3" },
  { id: "upscaled_Ruwan_run1.webp", upscaled: "upscaled_Ruwan_run1.png", name: "Pose 1" },
  { id: "upscaled_Ruwan_run2.webp", upscaled: "upscaled_Ruwan_run2.png", name: "Pose 2" },
  { id: "upscaled_Ruwan_run3.webp", upscaled: "upscaled_Ruwan_run3.jpg", name: "Pose 3" },
  { id: "upscaled_Sajith_run1.webp", upscaled: "upscaled_Sajith_run1.png", name: "Pose 1" },
  { id: "upscaled_Sajith_run2.webp", upscaled: "upscaled_Sajith_run2.jpg", name: "Pose 2" },
  { id: "upscaled_Saroja_run1.webp", upscaled: "upscaled_Saroja_run1.png", name: "Pose 1" },
  { id: "upscaled_Saroja_run2.webp", upscaled: "upscaled_Saroja_run2.png", name: "Pose 2" },
  { id: "upscaled_Saroja_run3.webp", upscaled: "upscaled_Saroja_run3.jpg", name: "Pose 3" },
  { id: "upscaled_Tharu_run1.webp", upscaled: "upscaled_Tharu_run1.png", name: "Pose 1" },
  { id: "upscaled_Tharu_run2.webp", upscaled: "upscaled_Tharu_run2.png", name: "Pose 2" },
  { id: "upscaled_Tharu_run3.webp", upscaled: "upscaled_Tharu_run3.png", name: "Pose 3" },
  { id: "upscaled_Tharu_run4.webp", upscaled: "upscaled_Tharu_run4.jpg", name: "Pose 4" },
  { id: "upscaled_Vindya_run1.webp", upscaled: "upscaled_Vindya_run1.png", name: "Pose 1" },
  { id: "upscaled_Vindya_run2.webp", upscaled: "upscaled_Vindya_run2.png", name: "Pose 2" },
  { id: "upscaled_Vindya_run3.webp", upscaled: "upscaled_Vindya_run3.png", name: "Pose 3" },
  { id: "upscaled_Vindya_run4.webp", upscaled: "upscaled_Vindya_run4.jpg", name: "Pose 4" },
  { id: "upscaled_Zack_run1.webp", upscaled: "upscaled_Zack_run1.png", name: "Pose 1" },
  { id: "upscaled_Zack_run2.webp", upscaled: "upscaled_Zack_run2.png", name: "Pose 2" },
  { id: "upscaled_Zack_run3.webp", upscaled: "upscaled_Zack_run3.png", name: "Pose 3" },
  { id: "upscaled_Zack_run4.webp", upscaled: "upscaled_Zack_run4.jpg", name: "Pose 4" }
]

export const CLOTHING = [
  { id: "clothing-1", name: "Classic White T-Shirt", type: "Top" },
  { id: "clothing-2", name: "Denim Jeans", type: "Bottom" },
  { id: "clothing-3", name: "Black Hoodie", type: "Top" },
  { id: "clothing-4", name: "Cargo Pants", type: "Bottom" },
]

export const MODEL_POSES: Record<string, string[]> = {
  aliya: [
    "/poses_v3_optimized/upscaled_Aliya_run1.webp",
    "/poses_v3_optimized/upscaled_Aliya_run2.webp",
    "/poses_v3_optimized/upscaled_Aliya_run3.webp",
    "/poses_v3_optimized/upscaled_Aliya_run4.webp"
  ],
  ella: ["/poses_v3_optimized/upscaled_ella_run1.webp", "/poses_v3_optimized/upscaled_ella_run2.webp", "/poses_v3_optimized/upscaled_ella_run3.webp"],
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