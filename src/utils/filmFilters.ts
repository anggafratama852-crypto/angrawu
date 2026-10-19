import { FilmPreset, FilmPresetId } from '../types';

export const FILM_PRESETS: Record<FilmPresetId, FilmPreset> = {
  'kodak-portra': {
    id: 'kodak-portra',
    name: 'Kodak Portra 400',
    tagline: 'Favorit Pernikahan & Skin Tone Lembut',
    description: 'Warna hangat natural, highlight lembut, kontras halus dengan tone kulit pengantin yang memukau.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    filterClass: 'sepia-[0.18] contrast-[1.08] brightness-[1.05] saturate-[1.12]',
    colorGrade: {
      brightness: 1.05,
      contrast: 1.08,
      saturation: 1.12,
      sepia: 0.18,
      hueRotate: -3,
      tintR: 12,
      tintG: 4,
      tintB: -8,
      warmth: 18,
      grainIntensity: 0.15,
    },
  },
  'fuji-quicksnap': {
    id: 'fuji-quicksnap',
    name: 'Fujifilm QuickSnap 400',
    tagline: 'Kamera Sekali Pakai Klasik 90-an',
    description: 'Warna hijau dedaunan cerah, bayangan agak sejuk, kontras punchy khas kamera saku analog.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    filterClass: 'contrast-[1.15] brightness-[1.02] saturate-[1.25] hue-rotate-[4deg]',
    colorGrade: {
      brightness: 1.02,
      contrast: 1.15,
      saturation: 1.25,
      sepia: 0.05,
      hueRotate: 4,
      tintR: -4,
      tintG: 14,
      tintB: 6,
      warmth: 6,
      grainIntensity: 0.22,
    },
  },
  'cinestill-800t': {
    id: 'cinestill-800t',
    name: 'CineStill 800T',
    tagline: 'Sinematik Romantis Malam Hari',
    description: 'Tone tungsten sinematik dengan bayangan kebiruan dan pendaran lampu pesta yang berpijar hangat.',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    filterClass: 'contrast-[1.18] brightness-[0.98] saturate-[1.15] hue-rotate-[-8deg]',
    colorGrade: {
      brightness: 0.98,
      contrast: 1.18,
      saturation: 1.15,
      sepia: 0.08,
      hueRotate: -8,
      tintR: 10,
      tintG: -2,
      tintB: 18,
      warmth: -6,
      grainIntensity: 0.28,
    },
  },
  'ilford-bw': {
    id: 'ilford-bw',
    name: 'Ilford HP5 / Tri-X',
    tagline: 'Monokrom Hitam Putih Abadi',
    description: 'Hitam putih klasik dengan kontras tinggi, grain perak yang khas, dan sentuhan emosional yang mendalam.',
    badgeColor: 'bg-zinc-200 text-zinc-900 border-zinc-400',
    filterClass: 'grayscale contrast-[1.3] brightness-[1.02]',
    colorGrade: {
      brightness: 1.02,
      contrast: 1.3,
      saturation: 0,
      sepia: 0.04,
      hueRotate: 0,
      tintR: 0,
      tintG: 0,
      tintB: 0,
      warmth: 0,
      grainIntensity: 0.25,
    },
  },
  'warm-90s': {
    id: 'warm-90s',
    name: 'Warm 90s Nostalgia',
    tagline: 'Kenangan Emas Album Foto Jadul',
    description: 'Sentuhan nuansa keemasan golden hour dengan grain lembut dan bayangan lembut khas cetakan foto 90-an.',
    badgeColor: 'bg-orange-100 text-orange-950 border-orange-300',
    filterClass: 'sepia-[0.32] contrast-[1.05] brightness-[1.04] saturate-[1.08]',
    colorGrade: {
      brightness: 1.04,
      contrast: 1.05,
      saturation: 1.08,
      sepia: 0.32,
      hueRotate: -5,
      tintR: 20,
      tintG: 8,
      tintB: -10,
      warmth: 24,
      grainIntensity: 0.2,
    },
  },
  'classic-polaroid': {
    id: 'classic-polaroid',
    name: 'Instant Polaroid 600',
    tagline: 'Dreamy & Muted Vintage Tones',
    description: 'Warna sedikit pudar (lifted blacks) dengan highlight lembut dan nuansa romantis yang instan.',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    filterClass: 'sepia-[0.12] contrast-[0.98] brightness-[1.08] saturate-[0.92]',
    colorGrade: {
      brightness: 1.08,
      contrast: 0.98,
      saturation: 0.92,
      sepia: 0.12,
      hueRotate: -2,
      tintR: 8,
      tintG: 2,
      tintB: 6,
      warmth: 10,
      grainIntensity: 0.18,
    },
  },
};

/**
 * Format current or specified date into iconic retro camera orange stamp: e.g. '26 10 19
 */
export function formatRetroDateStamp(date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `'${yy} ${mm} ${dd}`;
}

/**
 * Applies authentic film color grade, film grain, vignette, and vintage date stamp
 * directly on a canvas element and returns a base64 JPEG data URL.
 */
export async function processImageWithFilmFilter(
  imageSource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  presetId: FilmPresetId,
  options?: {
    customDate?: string;
    includeDateStamp?: boolean;
    flashBoost?: boolean;
  }
): Promise<string> {
  const preset = FILM_PRESETS[presetId] || FILM_PRESETS['kodak-portra'];
  const grade = preset.colorGrade;
  const includeDate = options?.includeDateStamp ?? true;
  const dateText = options?.customDate || formatRetroDateStamp();
  const flashBoost = options?.flashBoost ?? false;

  // Create offscreen canvas for rendering
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  // Determine source dimensions
  let srcWidth = 0;
  let srcHeight = 0;
  if (imageSource instanceof HTMLVideoElement) {
    srcWidth = imageSource.videoWidth || 1280;
    srcHeight = imageSource.videoHeight || 720;
  } else if (imageSource instanceof HTMLImageElement) {
    srcWidth = imageSource.naturalWidth || imageSource.width || 1280;
    srcHeight = imageSource.naturalHeight || imageSource.height || 720;
  } else {
    srcWidth = imageSource.width;
    srcHeight = imageSource.height;
  }

  // Target standard high-res 4:3 vintage camera aspect or original
  const maxDim = 1600;
  let targetWidth = srcWidth;
  let targetHeight = srcHeight;

  if (targetWidth > maxDim || targetHeight > maxDim) {
    const ratio = Math.min(maxDim / targetWidth, maxDim / targetHeight);
    targetWidth = Math.round(targetWidth * ratio);
    targetHeight = Math.round(targetHeight * ratio);
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // 1. Draw base image
  ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);

  // 2. Manipulate pixel data for authentic film color grading
  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imgData.data;
  const totalPixels = data.length;

  const contrastFactor = (259 * (grade.contrast * 255 + 255)) / (255 * (259 - grade.contrast * 255));
  const brightness = grade.brightness * (flashBoost ? 1.15 : 1.0);
  const sepia = grade.sepia;
  const sat = grade.saturation;
  const tR = (grade.tintR || 0) + (flashBoost ? 10 : 0);
  const tG = (grade.tintG || 0) + (flashBoost ? 6 : 0);
  const tB = grade.tintB || 0;
  const isMonochrome = grade.saturation === 0;

  for (let i = 0; i < totalPixels; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Apply brightness
    r = r * brightness;
    g = g * brightness;
    b = b * brightness;

    // Apply contrast
    r = contrastFactor * (r - 128) + 128;
    g = contrastFactor * (g - 128) + 128;
    b = contrastFactor * (b - 128) + 128;

    // Apply saturation / monochrome
    if (isMonochrome) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray;
      g = gray;
      b = gray;
    } else if (sat !== 1) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + sat * (r - gray);
      g = gray + sat * (g - gray);
      b = gray + sat * (b - gray);
    }

    // Apply sepia/warmth
    if (sepia > 0) {
      const sr = (r * (1 - (0.607 * sepia))) + (g * (0.769 * sepia)) + (b * (0.189 * sepia));
      const sg = (r * (0.349 * sepia)) + (g * (1 - (0.314 * sepia))) + (b * (0.168 * sepia));
      const sb = (r * (0.272 * sepia)) + (g * (0.534 * sepia)) + (b * (1 - (0.869 * sepia)));
      r = sr;
      g = sg;
      b = sb;
    }

    // Apply channel tints
    r += tR;
    g += tG;
    b += tB;

    // Clamp
    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  // Put colored pixels back
  ctx.putImageData(imgData, 0, 0);

  // 3. Add Film Grain & Noise Overlay
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = targetWidth;
  grainCanvas.height = targetHeight;
  const grainCtx = grainCanvas.getContext('2d');
  if (grainCtx) {
    const grainImgData = grainCtx.createImageData(targetWidth, targetHeight);
    const grainData = grainImgData.data;
    const intensity = grade.grainIntensity * 28;

    for (let i = 0; i < grainData.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity;
      grainData[i] = 128 + noise;
      grainData[i + 1] = 128 + noise;
      grainData[i + 2] = 128 + noise;
      grainData[i + 3] = 40; // slight transparency
    }
    grainCtx.putImageData(grainImgData, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(grainCanvas, 0, 0);
    ctx.restore();
  }

  // 4. Subtle Disposable Camera Vignette
  ctx.save();
  const radius = Math.max(targetWidth, targetHeight) * 0.75;
  const grad = ctx.createRadialGradient(
    targetWidth / 2,
    targetHeight / 2,
    radius * 0.45,
    targetWidth / 2,
    targetHeight / 2,
    radius
  );
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(10, 8, 5, 0.38)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.restore();

  // 5. Classic 90s Orange Digital Date Stamp (Glowing 7-segment / dot matrix look)
  if (includeDate) {
    ctx.save();
    const fontSize = Math.max(22, Math.round(targetWidth * 0.032));
    ctx.font = `700 ${fontSize}px "Space Mono", "VT323", monospace`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';

    const paddingX = Math.round(targetWidth * 0.04);
    const paddingY = Math.round(targetHeight * 0.04);
    const x = targetWidth - paddingX;
    const y = targetHeight - paddingY;

    // Glowing orange shadow (authentic light-emitting diode look)
    ctx.shadowColor = '#FF5500';
    ctx.shadowBlur = Math.round(fontSize * 0.4);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Deep orange backing
    ctx.fillStyle = '#FF4500';
    ctx.fillText(dateText, x, y);

    // Bright yellow-orange core
    ctx.shadowBlur = 2;
    ctx.fillStyle = '#FFAE19';
    ctx.fillText(dateText, x, y);

    ctx.restore();
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}
