import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const imageDirectory = path.resolve('public/images');
const assets = [
  { source: 'knight-poppies-thumbnail.png', output: 'knight-poppies-thumbnail.webp', width: 1600, quality: 80 },
  { source: 'knight-face-reference.png', output: 'knight-face-reference.webp', width: 1200, quality: 78 },
  { source: 'knight-character-sheet.png', output: 'knight-character-sheet.webp', width: 1200, quality: 80 },
  { source: 'knight-props.png', output: 'knight-props.webp', width: 1600, quality: 80 },
  { source: 'misty-poppy-location.png', output: 'misty-poppy-location.webp', width: 1600, quality: 80 }
];

let totalOriginalBytes = 0;
let totalOptimizedBytes = 0;

for (const asset of assets) {
  const inputPath = path.join(imageDirectory, asset.source);
  const outputPath = path.join(imageDirectory, asset.output);

  try {
    await fs.access(inputPath);
  } catch {
    throw new Error(`Required source image is missing: ${inputPath}`);
  }

  const inputStat = await fs.stat(inputPath);
  let outputStat;
  try {
    outputStat = await fs.stat(outputPath);
  } catch {
    outputStat = null;
  }

  if (!outputStat || inputStat.mtimeMs > outputStat.mtimeMs) {
    await sharp(inputPath)
      .rotate()
      .resize({ width: asset.width, withoutEnlargement: true })
      .webp({ quality: asset.quality, effort: 5, smartSubsample: true })
      .toFile(outputPath);
    outputStat = await fs.stat(outputPath);
  }

  totalOriginalBytes += inputStat.size;
  totalOptimizedBytes += outputStat.size;
  console.log(`Optimized ${asset.source}: ${(inputStat.size / 1024).toFixed(0)} KB → ${(outputStat.size / 1024).toFixed(0)} KB`);
}

const reduction = totalOriginalBytes ? (1 - totalOptimizedBytes / totalOriginalBytes) * 100 : 0;
console.log(`Knight image payload: ${(totalOriginalBytes / 1024 / 1024).toFixed(2)} MB → ${(totalOptimizedBytes / 1024 / 1024).toFixed(2)} MB (${reduction.toFixed(1)}% smaller)`);
