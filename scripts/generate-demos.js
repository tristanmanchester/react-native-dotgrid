#!/usr/bin/env node

/**
 * Generate WebP animations from preset frame data
 * Usage: node scripts/generate-demos.js [wave|snake|showcase|all]
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { spawn } = require('child_process');

// Register ts-node to import TypeScript files
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    jsx: 'react'
  }
});

// Import presets from source (avoiding JSX in Matrix component)
const {
  generateWaveFrames,
  snake,
  pulse,
  ripple,
  generateLoaderFrames
} = require('../src/presets.ts');

// Default styling matching Matrix component
const DEFAULT_SIZE = 10;
const DEFAULT_GAP = 2;
const DEFAULT_PALETTE = {
  on: '#12f45a',    // Bright green (matching Matrix defaults)
  off: '#0d1a12',   // Dark green (matching Matrix defaults)
  background: 'transparent'
};

/**
 * Render a single frame to canvas
 * @param {number[][]} frame - 2D array of brightness values (0-1)
 * @param {number} dotSize - diameter of each dot in pixels
 * @param {number} gap - spacing between dots in pixels
 * @param {object} palette - colors for on/off/background
 * @returns {Canvas} rendered canvas
 */
function renderFrame(frame, dotSize = DEFAULT_SIZE, gap = DEFAULT_GAP, palette = DEFAULT_PALETTE) {
  const rows = frame.length;
  const cols = frame[0].length;

  const width = cols * dotSize + (cols - 1) * gap;
  const height = rows * dotSize + (rows - 1) * gap;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background (use black if transparent)
  ctx.fillStyle = palette.background === 'transparent' ? '#000' : palette.background;
  ctx.fillRect(0, 0, width, height);

  // Draw dots
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const brightness = frame[r][c];
      const x = c * (dotSize + gap) + dotSize / 2;
      const y = r * (dotSize + gap) + dotSize / 2;

      // Interpolate between off and on colors based on brightness
      const color = interpolateColor(palette.off, palette.on, brightness);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return canvas;
}

/**
 * Interpolate between two hex colors
 */
function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `rgb(${r},${g},${b})`;
}

/**
 * Convert hex color to RGB object
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Create soft gradient pattern (for showcase)
 */
function softPattern(rows, cols, centers, falloff = 2) {
  const out = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let v = 0;
      for (const [cr, cc] of centers) {
        const dr = r - cr;
        const dc = c - cc;
        const d2 = dr * dr + dc * dc;
        v = Math.max(v, Math.exp(-(d2) / (2 * falloff * falloff)));
      }
      out[r][c] = Math.min(1, v);
    }
  }
  return out;
}

/**
 * Generate frames for showcase grid (3x3 with various patterns)
 */
function generateShowcaseFrames(maxFrames = 120) {
  const gridSize = 3;
  const matrixSize = 7;
  const dotSize = 10;
  const gap = 2;
  const gridGap = 6;

  // Generate all cell animations
  const cellAnimations = [];

  // Cell 0: soft gradient (static)
  cellAnimations[0] = [softPattern(7, 7, [[2, 2], [4, 4]], 1.8)];

  // Cell 1: wave
  cellAnimations[1] = generateWaveFrames(7, 7);

  // Cell 2: corner gradient (static)
  cellAnimations[2] = [softPattern(7, 7, [[0, 6]], 2.2)];

  // Cell 3: edge gradient (static)
  cellAnimations[3] = [softPattern(7, 7, [[3, 0]], 1.6)];

  // Cell 4: pulse
  cellAnimations[4] = pulse(7, 7, 18);

  // Cell 5: ripple
  cellAnimations[5] = ripple(7, 7, { length: 42, wavelength: 3.5, speed: 6 });

  // Cell 6: snake
  cellAnimations[6] = snake(7, 7, 4);

  // Cell 7: loader
  cellAnimations[7] = generateLoaderFrames(7, 7);

  // Cell 8: multi-center gradient (static)
  cellAnimations[8] = [softPattern(7, 7, [[5, 5], [1, 3], [3, 1]], 2)];

  // Calculate canvas dimensions
  const cellWidth = matrixSize * dotSize + (matrixSize - 1) * gap;
  const cellHeight = cellWidth;
  const totalWidth = gridSize * cellWidth + (gridSize - 1) * gridGap;
  const totalHeight = totalWidth;

  // Generate composite frames
  const compositeFrames = [];

  for (let frameIdx = 0; frameIdx < maxFrames; frameIdx++) {
    const canvas = createCanvas(totalWidth, totalHeight);
    const ctx = canvas.getContext('2d');

    // Fill background (use black if transparent)
    ctx.fillStyle = DEFAULT_PALETTE.background === 'transparent' ? '#000' : DEFAULT_PALETTE.background;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Render each cell
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellIdx = row * gridSize + col;
        const cellFrames = cellAnimations[cellIdx];
        const frame = cellFrames[frameIdx % cellFrames.length];

        const cellCanvas = renderFrame(frame, dotSize, gap, DEFAULT_PALETTE);

        const x = col * (cellWidth + gridGap);
        const y = row * (cellHeight + gridGap);

        ctx.drawImage(cellCanvas, x, y);
      }
    }

    compositeFrames.push(canvas);
  }

  return compositeFrames;
}

/**
 * Save frames as PNG files in temp directory
 */
async function saveFramesAsPngs(frames, tempDir) {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const paddedLength = String(frames.length).length;

  for (let i = 0; i < frames.length; i++) {
    const filename = `frame_${String(i).padStart(paddedLength, '0')}.png`;
    const filepath = path.join(tempDir, filename);

    const buffer = frames[i].toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);
  }

  console.log(`  Saved ${frames.length} frames to ${tempDir}`);
}

/**
 * Use ffmpeg to create animated WebP from PNG frames
 */
function createAnimatedWebP(tempDir, outputPath, fps) {
  return new Promise((resolve, reject) => {
    const paddedLength = String(fs.readdirSync(tempDir).length).length;
    const inputPattern = path.join(tempDir, `frame_%0${paddedLength}d.png`);

    const args = [
      '-framerate', String(fps),
      '-i', inputPattern,
      '-c:v', 'libwebp',
      '-lossless', '0',
      '-quality', '50',     // Lower quality for smaller files
      '-compression_level', '6',  // Max compression
      '-preset', 'icon',    // Optimize for small graphics
      '-loop', '0',
      '-y', // Overwrite output
      outputPath
    ];

    console.log(`  Running: ffmpeg ${args.join(' ')}`);

    const ffmpeg = spawn('ffmpeg', args);

    ffmpeg.stderr.on('data', (data) => {
      // Suppress ffmpeg output (it's verbose)
      // console.log(data.toString());
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        const stats = fs.statSync(outputPath);
        console.log(`  Created ${outputPath} (${(stats.size / 1024).toFixed(1)}KB)`);
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on('error', reject);
  });
}

/**
 * Clean up temp directory
 */
function cleanupTempDir(tempDir) {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * Generate a single demo animation
 */
async function generateDemo(name, frames, fps, outputDir) {
  console.log(`\nGenerating ${name}...`);

  const tempDir = path.join(__dirname, '..', '.tmp', name);
  const outputPath = path.join(outputDir, `${name}.webp`);

  try {
    // Render frames to canvas
    console.log(`  Rendering ${frames.length} frames...`);
    const canvases = frames.map(frame => renderFrame(frame));

    // Save as PNGs
    await saveFramesAsPngs(canvases, tempDir);

    // Create WebP
    await createAnimatedWebP(tempDir, outputPath, fps);

    // Cleanup
    cleanupTempDir(tempDir);

    console.log(`  ✓ ${name}.webp complete`);
  } catch (error) {
    console.error(`  ✗ Failed to generate ${name}:`, error.message);
    cleanupTempDir(tempDir);
    throw error;
  }
}

/**
 * Generate showcase demo (3x3 grid)
 */
async function generateShowcaseDemo(outputDir) {
  console.log(`\nGenerating showcase...`);

  const tempDir = path.join(__dirname, '..', '.tmp', 'showcase');
  const outputPath = path.join(outputDir, 'showcase.webp');
  const fps = 20;

  try {
    // Generate composite frames
    console.log(`  Generating 3x3 grid frames...`);
    const frames = generateShowcaseFrames(120); // 6 seconds at 20fps

    // Save as PNGs
    await saveFramesAsPngs(frames, tempDir);

    // Create WebP
    await createAnimatedWebP(tempDir, outputPath, fps);

    // Cleanup
    cleanupTempDir(tempDir);

    console.log(`  ✓ showcase.webp complete`);
  } catch (error) {
    console.error(`  ✗ Failed to generate showcase:`, error.message);
    cleanupTempDir(tempDir);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const target = args[0] || 'all';

  const outputDir = path.join(__dirname, '..', 'demos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('react-native-dotgrid WebP Demo Generator');
  console.log('========================================');

  // Check for ffmpeg
  try {
    const ffmpeg = spawn('ffmpeg', ['-version']);
    await new Promise((resolve, reject) => {
      ffmpeg.on('close', resolve);
      ffmpeg.on('error', reject);
    });
  } catch (error) {
    console.error('\n✗ Error: ffmpeg is not installed or not in PATH');
    console.error('  Install ffmpeg: https://ffmpeg.org/download.html');
    process.exit(1);
  }

  try {
    if (target === 'wave' || target === 'all') {
      const frames = generateWaveFrames(7, 7);
      await generateDemo('wave', frames, 20, outputDir);
    }

    if (target === 'snake' || target === 'all') {
      const frames = snake(7, 12);
      await generateDemo('snake', frames, 20, outputDir);
    }

    if (target === 'showcase' || target === 'all') {
      await generateShowcaseDemo(outputDir);
    }

    console.log('\n✓ All demos generated successfully!');
    console.log(`  Output directory: ${outputDir}`);
  } catch (error) {
    console.error('\n✗ Generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { renderFrame, generateShowcaseFrames };
