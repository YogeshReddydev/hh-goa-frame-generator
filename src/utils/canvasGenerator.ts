import { FrameFormat, ImageAdjustment, BuilderData } from '../types';

export interface RenderCanvasOptions {
  format: FrameFormat;
  builderData: BuilderData;
  croppedImageElement?: HTMLImageElement | null;
  imageElement?: HTMLImageElement | null;
  adjustment?: ImageAdjustment;
}

/**
 * Get theme color palettes dynamically based on themeStyle
 */
export function getThemeColors(themeStyle?: string) {
  switch (themeStyle) {
    case 'SUNSET_PINK':
      return {
        bgOuter: '#C70039',
        dotPattern: '#A0002C',
        borderAccent: '#FFD600',
        cardBg: '#FFF0F5',
        cardText: '#111111',
        primaryAccent: '#FF007A',
        secondaryAccent: '#FFD600',
        brandPillBg: '#FFD600',
        brandPillText: '#111111',
        tagColor: '#C70039',
      };
    case 'DEEP_SEA':
      return {
        bgOuter: '#0B2545',
        dotPattern: '#134074',
        borderAccent: '#00E5FF',
        cardBg: '#F0F8FF',
        cardText: '#0B2545',
        primaryAccent: '#00E5FF',
        secondaryAccent: '#FFD600',
        brandPillBg: '#00E5FF',
        brandPillText: '#0B2545',
        tagColor: '#134074',
      };
    case 'CYBER_GOA':
      return {
        bgOuter: '#121214',
        dotPattern: '#27272A',
        borderAccent: '#00FF66',
        cardBg: '#1E1E24',
        cardText: '#FFFFFF',
        primaryAccent: '#FF007A',
        secondaryAccent: '#00FF66',
        brandPillBg: '#00FF66',
        brandPillText: '#121214',
        tagColor: '#00FF66',
      };
    case 'CLASSIC_GOA':
    default:
      return {
        bgOuter: '#006B3C',
        dotPattern: '#00502D',
        borderAccent: '#FFD600',
        cardBg: '#FFF9E8',
        cardText: '#111111',
        primaryAccent: '#FF007A',
        secondaryAccent: '#FFD600',
        brandPillBg: '#FFD600',
        brandPillText: '#111111',
        tagColor: '#006B3C',
      };
  }
}

// Helper to wait for font loading before drawing canvas text
async function ensureFontsLoaded() {
  if ('fonts' in document) {
    try {
      await Promise.all([
        document.fonts.load('800 48px "Bebas Neue"'),
        document.fonts.load('700 24px "Space Mono"'),
        document.fonts.load('700 32px "Yatra One"'),
        document.fonts.load('600 20px "Plus Jakarta Sans"')
      ]);
    } catch {
      // Font loading fallback
    }
  }
}

/**
 * Generate a high-resolution PNG Data URL or Blob using HTML5 Canvas
 */
export async function generateFrameCanvas(options: RenderCanvasOptions): Promise<string> {
  await ensureFontsLoaded();

  const isPfp = options.format === 'PFP';
  const width = 1080;
  const height = isPfp ? 1080 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context unavailable');
  }

  // Set crisp rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (isPfp) {
    drawPfpFrame(ctx, width, height, options);
  } else {
    drawBuilderIdCard(ctx, width, height, options);
  }

  return canvas.toDataURL('image/png');
}

/**
 * DRAW PFP FRAME (1080 x 1080)
 */
function drawPfpFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderCanvasOptions
) {
  const { croppedImageElement, imageElement, adjustment, builderData } = options;
  const colors = getThemeColors(builderData?.themeStyle);

  // 1. Background Fill from active Theme
  ctx.fillStyle = colors.bgOuter;
  ctx.fillRect(0, 0, w, h);

  // Background polka dots pattern
  ctx.fillStyle = colors.dotPattern;
  for (let x = 20; x < w; x += 40) {
    for (let y = 20; y < h; y += 40) {
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Photo Mask Area Setup (Inner Photo Container)
  const borderMargin = 60; // 60px padding for the frame border
  const photoX = borderMargin;
  const photoY = borderMargin;
  const photoW = w - borderMargin * 2; // 960px
  const photoH = h - borderMargin * 2; // 960px

  ctx.save();
  // Clip photo to rounded rectangle area
  const cornerRadius = 32;
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, cornerRadius);
  ctx.clip();

  // Draw photo background fill
  ctx.fillStyle = colors.cardBg;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Render Cropped Image if available
  if (croppedImageElement) {
    ctx.drawImage(croppedImageElement, photoX, photoY, photoW, photoH);
  } else if (imageElement && adjustment) {
    ctx.save();
    // Move to center of photo container
    const centerX = photoX + photoW / 2 + adjustment.offsetX;
    const centerY = photoY + photoH / 2 + adjustment.offsetY;

    ctx.translate(centerX, centerY);
    ctx.scale(adjustment.zoom, adjustment.zoom);
    if (adjustment.rotation) {
      ctx.rotate((adjustment.rotation * Math.PI) / 180);
    }

    // Cover crop calculation
    const imgAspect = imageElement.width / imageElement.height;
    const containerAspect = photoW / photoH;
    let renderW = photoW;
    let renderH = photoH;

    if (imgAspect > containerAspect) {
      renderH = photoH;
      renderW = photoH * imgAspect;
    } else {
      renderW = photoW;
      renderH = photoW / imgAspect;
    }

    ctx.drawImage(imageElement, -renderW / 2, -renderH / 2, renderW, renderH);
    ctx.restore();
  } else {
    // Placeholder text if image missing
    ctx.fillStyle = colors.cardText;
    ctx.font = '700 36px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('YOUR PHOTO HERE', photoX + photoW / 2, photoY + photoH / 2);
  }

  ctx.restore(); // Exit clip

  // 3. FRAME BORDER OVERLAY & TROPICAL BRANDING DECORATIONS
  
  // Strong Outer Dark Border around photo
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, cornerRadius);
  ctx.stroke();

  // Outer Canvas Theme Border Margin Accent
  ctx.strokeStyle = colors.borderAccent;
  ctx.lineWidth = 12;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  // TOP BRANDING BANNER (HACKER HOUSE GOA)
  const topBannerW = 600;
  const topBannerH = 76;
  const topBannerX = (w - topBannerW) / 2;
  const topBannerY = 28;

  // Banner Box (Theme Pill + Offset Dark Shadow)
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, topBannerX + 6, topBannerY + 6, topBannerW, topBannerH, 12);
  ctx.fill();

  ctx.fillStyle = colors.brandPillBg;
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, topBannerX, topBannerY, topBannerW, topBannerH, 12);
  ctx.fill();
  ctx.stroke();

  // Top Banner Text
  ctx.fillStyle = colors.brandPillText;
  ctx.font = '800 46px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HACKER HOUSE GOA', w / 2, topBannerY + topBannerH / 2 + 3);

  // TOP CORNER BADGES
  // Top Left: 2026 Accent Badge
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, 42, 38, 110, 48, 8);
  ctx.fill();

  ctx.fillStyle = colors.primaryAccent;
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 38, 34, 110, 48, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 30px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('2026', 93, 58);

  // Top Right: Hindi "गोवा" Badge
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, w - 148, 38, 110, 48, 8);
  ctx.fill();

  ctx.fillStyle = '#FFF9E8';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, w - 152, 34, 110, 48, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#111111';
  ctx.font = '700 26px "Yatra One", serif';
  ctx.textAlign = 'center';
  ctx.fillText('गोवा', w - 97, 58);

  // BOTTOM BRANDING BADGE (GOA, INDIA • 28-31 OCT 2026 • #FrameInGoa)
  const btmBannerW = 780;
  const btmBannerH = 90;
  const btmBannerX = (w - btmBannerW) / 2;
  const btmBannerY = h - 120;

  // Shadow box
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, btmBannerX + 6, btmBannerY + 6, btmBannerW, btmBannerH, 16);
  ctx.fill();

  // Cream Box
  ctx.fillStyle = '#FFF9E8';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, btmBannerX, btmBannerY, btmBannerW, btmBannerH, 16);
  ctx.fill();
  ctx.stroke();

  // Bottom text row 1
  ctx.fillStyle = '#FF007A';
  ctx.font = '800 38px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GOA, INDIA  •  28–31 OCT 2026', w / 2, btmBannerY + 34);

  // Bottom text row 2
  ctx.fillStyle = '#111111';
  ctx.font = '700 20px "Space Mono", monospace';
  ctx.fillText('#FrameInGoa', w / 2, btmBannerY + 68);

  // CORNER TROPICAL VECTOR DETAILS
  drawPalmFrondVector(ctx, 20, h - 180, 0.9, false);
  drawPalmFrondVector(ctx, w - 160, h - 180, 0.9, true);
  drawSunVector(ctx, w - 120, 120, 0.7);
  drawWaveVector(ctx, 70, h - 130, '#FFD600');
  drawWaveVector(ctx, w - 190, h - 130, '#FF007A');
}

/**
 * DRAW BUILDER ID CARD (1080 x 1350)
 */
function drawBuilderIdCard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderCanvasOptions
) {
  const { croppedImageElement, imageElement, adjustment, builderData } = options;
  const colors = getThemeColors(builderData?.themeStyle);

  // 1. Outer Background Fill
  ctx.fillStyle = colors.bgOuter;
  ctx.fillRect(0, 0, w, h);

  // Dot matrix background pattern
  ctx.fillStyle = colors.dotPattern;
  for (let x = 25; x < w; x += 50) {
    for (let y = 25; y < h; y += 50) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Outer Border Frame
  ctx.strokeStyle = colors.borderAccent;
  ctx.lineWidth = 14;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 6;
  ctx.strokeRect(23, 23, w - 46, h - 46);

  // 2. MAIN POSTER CARD CONTAINER
  const cardMargin = 45;
  const cardX = cardMargin;
  const cardY = cardMargin + 5;
  const cardW = w - cardMargin * 2; // 990px
  const cardH = h - cardMargin * 2 - 10; // 1250px

  // Shadow
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, cardX + 12, cardY + 12, cardW, cardH, 24);
  ctx.fill();

  // Card Fill from Theme
  ctx.fillStyle = colors.cardBg;
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 5;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 24);
  ctx.fill();
  ctx.stroke();

  // CARD HEADER BANNER
  const headerY = cardY + 20;

  // Top Label: "HACKER HOUSE GOA"
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, cardX + 30 + 5, headerY + 5, cardW - 60, 80, 14);
  ctx.fill();

  ctx.fillStyle = colors.brandPillBg;
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, cardX + 30, headerY, cardW - 60, 80, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = colors.brandPillText;
  ctx.font = '800 52px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HACKER HOUSE GOA', w / 2 - 80, headerY + 42);

  // Hindi "गोवा" on header right
  ctx.fillStyle = colors.primaryAccent;
  ctx.font = '700 34px "Yatra One", serif';
  ctx.fillText('गोवा', w / 2 + 220, headerY + 42);

  // Sub-header date line
  ctx.fillStyle = colors.cardText;
  ctx.font = '700 17px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GOA, INDIA  •  28–31 OCT 2026  •  OFFICIAL BUILDER PASSPORT', w / 2, headerY + 110);

  // 3. PHOTO AREA (Framed Hero Polaroid)
  const photoW = 420;
  const photoH = 470;
  const photoX = cardX + 40;
  const photoY = cardY + 155;

  // Polaroid Frame Shadow
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, photoX + 8, photoY + 8, photoW, photoH, 16);
  ctx.fill();

  // Polaroid Frame
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 16);
  ctx.fill();
  ctx.stroke();

  // Inner Photo Clip (380 x 380)
  const innerMargin = 20;
  const innerX = photoX + innerMargin;
  const innerY = photoY + innerMargin;
  const innerW = photoW - innerMargin * 2;
  const innerH = photoH - innerMargin * 2 - 35; // leave space at bottom of polaroid

  ctx.save();
  drawRoundedRect(ctx, innerX, innerY, innerW, innerH, 8);
  ctx.clip();

  ctx.fillStyle = colors.cardBg;
  ctx.fillRect(innerX, innerY, innerW, innerH);

  if (croppedImageElement) {
    ctx.drawImage(croppedImageElement, innerX, innerY, innerW, innerH);
  } else if (imageElement && adjustment) {
    ctx.save();
    const centerX = innerX + innerW / 2 + adjustment.offsetX;
    const centerY = innerY + innerH / 2 + adjustment.offsetY;

    ctx.translate(centerX, centerY);
    ctx.scale(adjustment.zoom, adjustment.zoom);
    if (adjustment.rotation) {
      ctx.rotate((adjustment.rotation * Math.PI) / 180);
    }

    const imgAspect = imageElement.width / imageElement.height;
    const containerAspect = innerW / innerH;
    let renderW = innerW;
    let renderH = innerH;

    if (imgAspect > containerAspect) {
      renderH = innerH;
      renderW = innerH * imgAspect;
    } else {
      renderW = innerW;
      renderH = innerW / imgAspect;
    }

    ctx.drawImage(imageElement, -renderW / 2, -renderH / 2, renderW, renderH);
    ctx.restore();
  } else {
    ctx.fillStyle = colors.cardText;
    ctx.font = '700 24px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO HERE', innerX + innerW / 2, innerY + innerH / 2);
  }

  ctx.restore(); // Exit clip

  // Polaroid Inner Photo Border
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, innerX, innerY, innerW, innerH, 8);
  ctx.stroke();

  // Bottom Polaroid Caption
  ctx.fillStyle = '#111111';
  ctx.font = '700 16px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('VERIFIED BUILDER • HH GOA \'26', photoX + photoW / 2, photoY + photoH - 18);

  // 4. RIGHT SIDE BUILDER INFO BLOCK (Hero Typography Hierarchy)
  const infoX = photoX + photoW + 35; // cardX + 495
  const infoY = photoY + 5;
  const infoW = cardW - (photoW + 90); // ~430px

  // NAME (Top Priority)
  ctx.fillStyle = colors.primaryAccent;
  ctx.font = '700 14px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('BUILDER NAME:', infoX, infoY + 18);

  const nameText = (builderData.name || 'ANONYMOUS BUILDER').toUpperCase();
  ctx.fillStyle = colors.cardText;
  ctx.font = nameText.length > 15 
    ? '800 42px "Bebas Neue", sans-serif' 
    : '800 52px "Bebas Neue", sans-serif';
  ctx.fillText(nameText, infoX, infoY + 60);

  // BUILDER TITLE (Key Identity Badge)
  ctx.fillStyle = colors.primaryAccent;
  ctx.font = '700 14px "Space Mono", monospace';
  ctx.fillText('BUILDER TITLE:', infoX, infoY + 98);

  const titleText = (builderData.builderTitle || 'THE SYSTEM BUILDER').toUpperCase();
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, infoX + 4, infoY + 108 + 4, infoW - 10, 60, 10);
  ctx.fill();

  ctx.fillStyle = colors.primaryAccent;
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, infoX, infoY + 108, infoW - 10, 60, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = titleText.length > 20 
    ? '800 22px "Bebas Neue", sans-serif'
    : '800 28px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(titleText, infoX + (infoW - 10) / 2, infoY + 145);

  // ROLE / STACK BADGE
  ctx.textAlign = 'left';
  ctx.fillStyle = colors.cardText;
  ctx.font = '700 14px "Space Mono", monospace';
  ctx.fillText('ROLE / TECH STACK:', infoX, infoY + 198);

  const roleText = (builderData.role || 'FULL-STACK BUILDER').toUpperCase();
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, infoX + 4, infoY + 208 + 4, infoW - 10, 52, 10);
  ctx.fill();

  ctx.fillStyle = colors.secondaryAccent;
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, infoX, infoY + 208, infoW - 10, 52, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = colors.cardText === '#FFFFFF' ? '#121214' : '#111111';
  ctx.font = '800 24px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(roleText, infoX + (infoW - 10) / 2, infoY + 242);

  // LOCATION / CITY
  ctx.textAlign = 'left';
  ctx.fillStyle = colors.tagColor;
  ctx.font = '700 14px "Space Mono", monospace';
  ctx.fillText('LOCATION / ORIGIN:', infoX, infoY + 292);

  const cityText = (builderData.city || 'BENGALURU, INDIA').toUpperCase();
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, infoX + 3, infoY + 302 + 3, infoW - 10, 48, 8);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, infoX, infoY + 302, infoW - 10, 48, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = colors.primaryAccent;
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`📍 ${cityText}`, infoX + (infoW - 10) / 2, infoY + 332);

  // 5. MIDDLE SECTION: "WHAT ARE YOU BUILDING IN GOA?" BANNER
  const lowerY = photoY + photoH + 25; // cardY + 650
  const lowerW = cardW - 80;
  const lowerX = cardX + 40;

  ctx.textAlign = 'left';
  ctx.fillStyle = colors.cardText;
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.fillText('⚡ WHAT ARE YOU BUILDING IN GOA?', lowerX, lowerY + 22);

  // Building Quote Container Box
  const quoteBoxH = 180;
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, lowerX + 6, lowerY + 35 + 6, lowerW, quoteBoxH, 16);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, lowerX, lowerY + 35, lowerW, quoteBoxH, 16);
  ctx.fill();
  ctx.stroke();

  // Quote Content Text
  const buildDesc = builderData.buildingText || 'Building next-gen AI & web applications on the sunny beaches of Goa!';
  ctx.fillStyle = '#111111';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  
  // Wrap text inside quote box
  wrapText(ctx, `"${buildDesc}"`, lowerX + 30, lowerY + 78, lowerW - 60, 34);

  // 6. GROUNDED TROPICAL FOOTER PANEL (Fills bottom, eliminates empty white space)
  const footerPanelY = lowerY + quoteBoxH + 55; // cardY + 910
  const footerPanelH = 260;
  const footerPanelW = cardW - 80;
  const footerPanelX = cardX + 40;

  // Footer Panel Shadow
  ctx.fillStyle = '#111111';
  drawRoundedRect(ctx, footerPanelX + 6, footerPanelY + 6, footerPanelW, footerPanelH, 18);
  ctx.fill();

  // Footer Panel Main Fill (Dark Tropical Accent or Primary Theme Background)
  ctx.fillStyle = colors.bgOuter;
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  drawRoundedRect(ctx, footerPanelX, footerPanelY, footerPanelW, footerPanelH, 18);
  ctx.fill();
  ctx.stroke();

  // Left Stamp: Official HH Goa Seal
  ctx.save();
  ctx.translate(footerPanelX + 110, footerPanelY + 130);
  ctx.rotate((-8 * Math.PI) / 180);

  ctx.fillStyle = colors.primaryAccent;
  ctx.beginPath();
  ctx.arc(0, 0, 65, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 20px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', 0, -14);
  ctx.font = '800 28px "Bebas Neue", sans-serif';
  ctx.fillText('GOA 2026', 0, 14);
  ctx.font = '700 13px "Space Mono", monospace';
  ctx.fillText('OFFICIAL PASSPORT', 0, 34);
  ctx.restore();

  // Middle Text: Event Dates & Location inside panel
  ctx.textAlign = 'center';
  ctx.fillStyle = colors.secondaryAccent;
  ctx.font = '800 48px "Bebas Neue", sans-serif';
  ctx.fillText('OCTOBER 28–31, 2026', w / 2 + 30, footerPanelY + 85);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 22px "Space Mono", monospace';
  ctx.fillText('GOA, INDIA  •  #FrameInGoa', w / 2 + 30, footerPanelY + 130);

  ctx.fillStyle = colors.secondaryAccent;
  ctx.font = '700 15px "Space Mono", monospace';
  ctx.fillText('BUILDER PASSPORT NO. HHG-2026-8842', w / 2 + 30, footerPanelY + 175);

  // Right Side Decorative Tropical Illustration inside panel
  drawPalmFrondVector(ctx, w - 180, footerPanelY + 40, 0.9, true);
  drawSunVector(ctx, w - 130, footerPanelY + 160, 0.65);
  drawWaveVector(ctx, footerPanelX + 220, footerPanelY + 215, colors.secondaryAccent);
  drawWaveVector(ctx, w - 320, footerPanelY + 215, colors.primaryAccent);
}

/**
 * HELPER: Draw rounded rectangle
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * HELPER: Wrap text inside canvas box
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      lineCount++;
      if (lineCount >= 3) {
        // truncate if too long
        ctx.fillText(line.trim() + '...', x, currentY);
        return;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

/**
 * HELPER VECTORS
 */
function drawPalmFrondVector(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-scale, scale);
  else ctx.scale(scale, scale);

  ctx.fillStyle = '#006B3C';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;

  // Frond shapes
  ctx.beginPath();
  ctx.moveTo(0, 80);
  ctx.quadraticCurveTo(40, 40, 90, 0);
  ctx.quadraticCurveTo(50, 20, 0, 80);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(10, 80);
  ctx.quadraticCurveTo(60, 60, 110, 30);
  ctx.quadraticCurveTo(60, 40, 10, 80);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawSunVector(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#FFD600';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(0, 0, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Sun rays
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const r1 = 42;
    const r2 = 54;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
    ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawWaveVector(ctx: CanvasRenderingContext2D, x: number, y: number, color = '#FFD600') {
  ctx.save();
  ctx.translate(x, y);

  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(15, -12, 30, 0);
  ctx.quadraticCurveTo(45, 12, 60, 0);
  ctx.quadraticCurveTo(75, -12, 90, 0);
  ctx.stroke();

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(15, -12, 30, 0);
  ctx.quadraticCurveTo(45, 12, 60, 0);
  ctx.quadraticCurveTo(75, -12, 90, 0);
  ctx.stroke();

  ctx.restore();
}
