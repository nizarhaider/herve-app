// optimize-images.js
import fs from "fs";
import path from "path";
import sharp from "sharp";

// Folders
const inputDir = "./public/poses_v3_phase_1";   
const outputDir = "./public/poses_v3_optimized"; 

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process all images in the folder
fs.readdirSync(inputDir).forEach(async (file) => {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  const inputPath = path.join(inputDir, file);
  const outputFileName = path.basename(file, ext) + ".webp";
  const outputPath = path.join(outputDir, outputFileName);

  try {
    await sharp(inputPath)
      .resize({ width: 800 }) // max width 800px, auto height
      .webp({ quality: 80 })  // adjust quality as needed
      .toFile(outputPath);

    console.log(`Optimized: ${file} → ${outputFileName}`);
  } catch (err) {
    console.error(`Failed: ${file}`, err);
  }
});
