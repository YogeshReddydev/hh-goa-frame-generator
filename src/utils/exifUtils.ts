/**
 * EXIF orientation utility to parse and correct image orientation
 * for vertical/smartphone photos before passing to the crop editor.
 */

export function getExifOrientation(arrayBuffer: ArrayBuffer): number {
  try {
    const view = new DataView(arrayBuffer);
    if (view.getUint16(0, false) !== 0xffd8) {
      return 1; // Not a JPEG
    }

    const length = view.byteLength;
    let offset = 2;

    while (offset < length - 2) {
      const marker = view.getUint16(offset, false);
      offset += 2;

      if (marker === 0xffe1) {
        // APP1 marker
        offset += 2; // Skip length field
        if (
          offset + 6 <= length &&
          view.getUint32(offset, false) === 0x45786966 && // "Exif"
          view.getUint16(offset + 4, false) === 0x0000 // "\0\0"
        ) {
          const tiffOffset = offset + 6;
          if (tiffOffset + 8 > length) return 1;

          const little = view.getUint16(tiffOffset, false) === 0x4949; // "II"
          const firstIfdOffset = view.getUint32(tiffOffset + 4, little);
          let ifdOffset = tiffOffset + firstIfdOffset;

          if (ifdOffset + 2 > length) return 1;

          const tagsCount = view.getUint16(ifdOffset, little);
          ifdOffset += 2;

          for (let i = 0; i < tagsCount; i++) {
            const entryOffset = ifdOffset + i * 12;
            if (entryOffset + 12 > length) break;

            const tag = view.getUint16(entryOffset, little);
            if (tag === 0x0112) {
              // Orientation tag
              return view.getUint16(entryOffset + 8, little);
            }
          }
        }
      } else if ((marker & 0xff00) !== 0xff00) {
        break;
      } else {
        const markerLength = view.getUint16(offset, false);
        offset += markerLength;
      }
    }
  } catch (e) {
    console.warn('Could not parse EXIF orientation:', e);
  }
  return 1;
}

/**
 * Ensures the given File and Data URL are upright.
 * Returns an upright File and Data URL.
 */
export async function normalizeImageOrientation(
  file: File,
  dataUrl: string
): Promise<{ file: File; dataUrl: string }> {
  try {
    // 1. ArrayBuffer read for EXIF inspection
    const buffer = await file.arrayBuffer();
    const orientation = getExifOrientation(buffer);

    // If orientation is 1 (normal) or unknown, return original
    if (orientation <= 1 || orientation > 8) {
      return { file, dataUrl };
    }

    // 2. Load image into HTMLImageElement
    const img = new Image();
    img.crossOrigin = 'anonymous';

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (err) => reject(err);
      img.src = dataUrl;
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    // Check if browser already auto-oriented the HTMLImageElement
    // For 90deg/270deg orientations (5, 6, 7, 8), height is expected to be >= width if auto-oriented
    const isRotatedOrientation = [5, 6, 7, 8].includes(orientation);
    if (isRotatedOrientation && h >= w) {
      // Browser has already normalized orientation
      return { file, dataUrl };
    }

    // 3. Create canvas and transform according to orientation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { file, dataUrl };
    }

    if (isRotatedOrientation) {
      canvas.width = h;
      canvas.height = w;
    } else {
      canvas.width = w;
      canvas.height = h;
    }

    // Transform coordinate system
    switch (orientation) {
      case 2:
        ctx.transform(-1, 0, 0, 1, w, 0);
        break;
      case 3:
        ctx.transform(-1, 0, 0, -1, w, h);
        break;
      case 4:
        ctx.transform(1, 0, 0, -1, 0, h);
        break;
      case 5:
        ctx.transform(0, 1, 1, 0, 0, 0);
        break;
      case 6: // Rotate 90deg CW
        ctx.transform(0, 1, -1, 0, h, 0);
        break;
      case 7:
        ctx.transform(0, -1, -1, 0, h, w);
        break;
      case 8: // Rotate 270deg CW
        ctx.transform(0, -1, 1, 0, 0, w);
        break;
      default:
        break;
    }

    ctx.drawImage(img, 0, 0);

    const correctedDataUrl = canvas.toDataURL('image/jpeg', 0.95);

    // Convert data URL back to Blob & File
    const res = await fetch(correctedDataUrl);
    const blob = await res.blob();
    const correctedFile = new File([blob], file.name, { type: 'image/jpeg' });

    return {
      file: correctedFile,
      dataUrl: correctedDataUrl,
    };
  } catch (err) {
    console.warn('Orientation normalization fallback:', err);
    return { file, dataUrl };
  }
}
