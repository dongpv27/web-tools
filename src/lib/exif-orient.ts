// Reads the EXIF Orientation tag from a JPEG and returns a value 1–8 per the
// EXIF spec (1 = normal, 3 = 180°, 6 = 90° CW, 8 = 90° CCW, 2/4/5/7 = mirrored
// variants). Returns 1 if the image isn't JPEG or no orientation is set.
// Pure-JS, no dependencies.

export async function readJpegOrientation(file: Blob): Promise<number> {
  if (!file.type.includes('jpeg') && !file.type.includes('jpg')) return 1;
  // Only need the first 128 KB to find the APP1/EXIF segment; entire file
  // would be wasteful for 50 MB photos.
  const head = await file.slice(0, 128 * 1024).arrayBuffer();
  const view = new DataView(head);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return 1; // not JPEG SOI

  let offset = 2;
  while (offset < view.byteLength - 4) {
    if (view.getUint8(offset) !== 0xff) return 1;
    const marker = view.getUint8(offset + 1);
    const size = view.getUint16(offset + 2);
    // APP1 = 0xE1, where EXIF data lives.
    if (marker === 0xe1) {
      // "Exif\0\0" identifier at offset+4..+10
      if (
        view.getUint32(offset + 4) === 0x45786966 &&
        view.getUint16(offset + 8) === 0x0000
      ) {
        const tiffStart = offset + 10;
        const little = view.getUint16(tiffStart) === 0x4949; // 'II' little-endian
        const getU16 = (o: number) => view.getUint16(o, little);
        const getU32 = (o: number) => view.getUint32(o, little);
        if (getU16(tiffStart + 2) !== 0x002a) return 1; // magic mismatch
        const ifd0 = tiffStart + getU32(tiffStart + 4);
        const numEntries = getU16(ifd0);
        for (let i = 0; i < numEntries; i++) {
          const entry = ifd0 + 2 + i * 12;
          const tag = getU16(entry);
          if (tag === 0x0112) {
            // Orientation tag — value is in the first 2 bytes of the entry's
            // value field (since type=SHORT, count=1).
            return getU16(entry + 8);
          }
        }
        return 1;
      }
    }
    offset += 2 + size;
  }
  return 1;
}

/**
 * Apply EXIF orientation to a canvas before any drawing. Returns the
 * dimensions of the rotated/flipped canvas (which may have width ↔ height
 * swapped for 5/6/7/8) and a transform that, when applied to ctx, makes
 * subsequent drawImage commands paint correctly.
 */
export function applyOrientationTransform(
  ctx: CanvasRenderingContext2D,
  orientation: number,
  width: number,
  height: number,
): { canvasWidth: number; canvasHeight: number } {
  const swap = orientation >= 5 && orientation <= 8;
  const canvasWidth = swap ? height : width;
  const canvasHeight = swap ? width : height;
  ctx.canvas.width = canvasWidth;
  ctx.canvas.height = canvasHeight;

  switch (orientation) {
    case 2: // mirror horizontal
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3: // 180°
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4: // mirror vertical
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5: // mirror horizontal then 90° CCW
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6: // 90° CW
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7: // mirror horizontal then 90° CW
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8: // 90° CCW
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    case 1:
    default:
      break;
  }
  return { canvasWidth, canvasHeight };
}
