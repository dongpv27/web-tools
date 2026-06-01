// Lanczos3 resampling for high-quality image upscaling. Slower than the
// browser's built-in bilinear, but produces noticeably sharper results
// without ML model weights. Pure JS — runs on any image, any size.

function lanczosKernel(x: number, a = 3): number {
  if (x === 0) return 1;
  if (x <= -a || x >= a) return 0;
  const px = Math.PI * x;
  return (a * Math.sin(px) * Math.sin(px / a)) / (px * px);
}

/**
 * Resample an ImageData to a target width/height using Lanczos-3.
 * Separable 1D filter: resize horizontally first, then vertically.
 */
export function lanczosResample(
  src: ImageData,
  dstWidth: number,
  dstHeight: number,
  onProgress?: (ratio: number) => void,
): ImageData {
  const a = 3;
  const sw = src.width, sh = src.height;
  const sd = src.data;

  // ---- Horizontal pass: sw × sh → dstWidth × sh ----
  const xScale = sw / dstWidth;
  const xRatio = Math.max(1, xScale); // for downscale, widen the kernel
  const xRadius = a * xRatio;

  const hPass = new Float32Array(dstWidth * sh * 4);
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < dstWidth; x++) {
      const cx = (x + 0.5) * xScale - 0.5;
      const xStart = Math.max(0, Math.floor(cx - xRadius));
      const xEnd = Math.min(sw - 1, Math.ceil(cx + xRadius));
      let r = 0, g = 0, b = 0, alpha = 0, wsum = 0;
      for (let sx = xStart; sx <= xEnd; sx++) {
        const w = lanczosKernel((sx - cx) / xRatio, a);
        if (w === 0) continue;
        const idx = (y * sw + sx) * 4;
        r += sd[idx] * w;
        g += sd[idx + 1] * w;
        b += sd[idx + 2] * w;
        alpha += sd[idx + 3] * w;
        wsum += w;
      }
      const oi = (y * dstWidth + x) * 4;
      hPass[oi]     = wsum ? r / wsum : 0;
      hPass[oi + 1] = wsum ? g / wsum : 0;
      hPass[oi + 2] = wsum ? b / wsum : 0;
      hPass[oi + 3] = wsum ? alpha / wsum : 0;
    }
    if (onProgress && y % 16 === 0) onProgress((y / sh) * 0.5);
  }

  // ---- Vertical pass: dstWidth × sh → dstWidth × dstHeight ----
  const yScale = sh / dstHeight;
  const yRatio = Math.max(1, yScale);
  const yRadius = a * yRatio;

  const out = new ImageData(dstWidth, dstHeight);
  const od = out.data;
  for (let y = 0; y < dstHeight; y++) {
    const cy = (y + 0.5) * yScale - 0.5;
    const yStart = Math.max(0, Math.floor(cy - yRadius));
    const yEnd = Math.min(sh - 1, Math.ceil(cy + yRadius));
    for (let x = 0; x < dstWidth; x++) {
      let r = 0, g = 0, b = 0, alpha = 0, wsum = 0;
      for (let sy = yStart; sy <= yEnd; sy++) {
        const w = lanczosKernel((sy - cy) / yRatio, a);
        if (w === 0) continue;
        const idx = (sy * dstWidth + x) * 4;
        r += hPass[idx] * w;
        g += hPass[idx + 1] * w;
        b += hPass[idx + 2] * w;
        alpha += hPass[idx + 3] * w;
        wsum += w;
      }
      const oi = (y * dstWidth + x) * 4;
      od[oi]     = wsum ? Math.max(0, Math.min(255, Math.round(r / wsum))) : 0;
      od[oi + 1] = wsum ? Math.max(0, Math.min(255, Math.round(g / wsum))) : 0;
      od[oi + 2] = wsum ? Math.max(0, Math.min(255, Math.round(b / wsum))) : 0;
      od[oi + 3] = wsum ? Math.max(0, Math.min(255, Math.round(alpha / wsum))) : 0;
    }
    if (onProgress && y % 16 === 0) onProgress(0.5 + (y / dstHeight) * 0.5);
  }
  onProgress?.(1);
  return out;
}
