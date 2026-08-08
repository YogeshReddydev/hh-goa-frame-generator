import { FrameFormat, ImageAdjustment } from '../types';

export interface CroppedImageResult {
  croppedImageElement: HTMLImageElement;
  croppedDataUrl: string;
}

/**
 * Renders the cropped photo based on the user's zoom, rotation, and offset adjustments.
 * Returns a high-resolution cropped HTMLImageElement and data URL.
 */
export async function renderCroppedImage(
  originalImage: HTMLImageElement,
  format: FrameFormat,
  adjustment: ImageAdjustment
): Promise<CroppedImageResult> {
  const isPfp = format === 'PFP';
  const boxWidth = 280;
  const boxHeight = isPfp ? 280 : 310;

  // Target high-resolution canvas dimensions
  const targetW = isPfp ? 1200 : 1080;
  const targetH = isPfp ? 1200 : 1196;
  const scale = targetW / boxWidth;

  const imgW = originalImage.naturalWidth || originalImage.width || 600;
  const imgH = originalImage.naturalHeight || originalImage.height || 600;

  const imgAspect = imgW / imgH;
  const boxAspect = boxWidth / boxHeight;

  let baseW: number;
  let baseH: number;

  if (imgAspect > boxAspect) {
    baseW = boxWidth;
    baseH = boxWidth / imgAspect;
  } else {
    baseH = boxHeight;
    baseW = boxHeight * imgAspect;
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to create 2d context for cropping canvas');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Cream background fill
  ctx.fillStyle = '#FFF9E8';
  ctx.fillRect(0, 0, targetW, targetH);

  // Position center based on user's drag offset
  const centerX = targetW / 2 + adjustment.offsetX * scale;
  const centerY = targetH / 2 + adjustment.offsetY * scale;

  ctx.save();
  ctx.translate(centerX, centerY);

  if (adjustment.rotation) {
    ctx.rotate((adjustment.rotation * Math.PI) / 180);
  }

  const drawW = baseW * scale * adjustment.zoom;
  const drawH = baseH * scale * adjustment.zoom;

  ctx.drawImage(originalImage, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();

  const croppedDataUrl = canvas.toDataURL('image/png', 1.0);

  const croppedImageElement = new Image();
  croppedImageElement.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    croppedImageElement.onload = () => resolve();
    croppedImageElement.onerror = (err) => reject(err);
    croppedImageElement.src = croppedDataUrl;
  });

  return {
    croppedImageElement,
    croppedDataUrl,
  };
}
