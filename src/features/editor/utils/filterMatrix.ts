/**
 * Filter Matrix Engine
 * Menghasilkan color matrix 4x5 (20 elemen) untuk setiap jenis filter.
 * Nilai intensity berkisar dari 1-100.
 *
 * Format matrix: [R, G, B, A, offset] x4 baris
 * Identity: [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0]
 */

const IDENTITY: number[] = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
];

/** Interpolate antara identity matrix dan target matrix berdasarkan intensity */
function interpolateMatrix(target: number[], intensity: number): number[] {
  const t = intensity / 100;
  return IDENTITY.map((v, i) => v + (target[i] - v) * t);
}

/** Cerahkan: menaikkan semua channel RGB + offset */
export function brightenMatrix(intensity: number): number[] {
  const brightness = (intensity / 100) * 0.6; // max +0.6 offset
  const target: number[] = [
    1,
    0,
    0,
    0,
    brightness * 255,
    0,
    1,
    0,
    0,
    brightness * 255,
    0,
    0,
    1,
    0,
    brightness * 255,
    0,
    0,
    0,
    1,
    0,
  ];
  return target;
}

/** Abu-abu: grayscale murni */
export function grayscaleMatrix(intensity: number): number[] {
  const target: number[] = [
    0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114,
    0, 0, 0, 0, 0, 1, 0,
  ];
  return interpolateMatrix(target, intensity);
}

/** Warna Ajaib: boosting saturasi / vivid color */
export function vividMatrix(intensity: number): number[] {
  const t = intensity / 100;
  const s = 1 + t * 1.5; // saturation factor up to 2.5
  const sr = (1 - s) * 0.299;
  const sg = (1 - s) * 0.587;
  const sb = (1 - s) * 0.114;
  return [
    sr + s,
    sg,
    sb,
    0,
    0,
    sr,
    sg + s,
    sb,
    0,
    0,
    sr,
    sg,
    sb + s,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];
}

/** Ajaib Pro: high contrast + warm tone */
export function magicProMatrix(intensity: number): number[] {
  const t = intensity / 100;
  const contrast = 1 + t * 0.8;
  const warmR = t * 20;
  const coolB = -t * 15;
  const offset = ((1 - contrast) / 2) * 255;
  return [
    contrast,
    0,
    0,
    0,
    offset + warmR,
    0,
    contrast,
    0,
    0,
    offset,
    0,
    0,
    contrast,
    0,
    offset + coolB,
    0,
    0,
    0,
    1,
    0,
  ];
}

/** H&P (Hitam & Putih kontras tinggi) */
export function highContrastBWMatrix(intensity: number): number[] {
  const t = intensity / 100;
  const contrast = 1 + t * 1.2;
  const offset = ((1 - contrast) / 2) * 255;
  const gs: number[] = [
    0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114,
    0, 0, 0, 0, 0, 1, 0,
  ];
  // Apply contrast on top of grayscale
  return gs.map((v, i) => {
    if (i % 5 === 4) return offset; // offset column
    return v * contrast;
  });
}

/** Hemat: sedikit desaturasi + dingin untuk print */
export function econMatrix(intensity: number): number[] {
  const t = intensity / 100;
  const target: number[] = [
    0.6,
    0.3,
    0.1,
    0,
    -t * 10,
    0.2,
    0.7,
    0.1,
    0,
    -t * 10,
    0.2,
    0.2,
    0.6,
    0,
    t * 5,
    0,
    0,
    0,
    1,
    0,
  ];
  return interpolateMatrix(target, intensity);
}

/** Tanpa Bayangan: dokumen scanner effect (tingkatkan whites, kurangi shadow) */
export function noShadowMatrix(intensity: number): number[] {
  const t = intensity / 100;
  // Agressive white balance + shadow removal
  const contrast = 1 + t * 0.6;
  const brighten = t * 40;
  const offset = ((1 - contrast) / 2) * 255 + brighten;
  return [
    contrast,
    0,
    0,
    0,
    offset,
    0,
    contrast,
    0,
    0,
    offset,
    0,
    0,
    contrast,
    0,
    offset,
    0,
    0,
    0,
    1,
    0,
  ];
}

/** Balik / Invert */
export function invertMatrix(intensity: number): number[] {
  const target: number[] = [
    -1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0,
  ];
  return interpolateMatrix(target, intensity);
}

/** Sepia: hangat vintage */
export function sepiaMatrix(intensity: number): number[] {
  const target: number[] = [
    0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131,
    0, 0, 0, 0, 0, 1, 0,
  ];
  return interpolateMatrix(target, intensity);
}

/** Tidak Ada (filter placeholder untuk "Tidak Ada" / No Filter) */
export function noopMatrix(): number[] {
  return [...IDENTITY];
}

/** Master function: pilih matrix berdasarkan filter ID */
export function getFilterMatrix(filterId: string, intensity: number): number[] {
  switch (filterId) {
    case "Cerahkan":
      return brightenMatrix(intensity);
    case "Abu-abu":
      return grayscaleMatrix(intensity);
    case "Warna Ajaib":
      return vividMatrix(intensity);
    case "Ajaib Pro":
      return magicProMatrix(intensity);
    case "H&P":
      return highContrastBWMatrix(intensity);
    case "Hemat":
      return econMatrix(intensity);
    case "Tanpa Bayangan":
      return noShadowMatrix(intensity);
    case "Balik":
      return invertMatrix(intensity);
    case "Original":
    case "Tidak Ada":
    default:
      return noopMatrix();
  }
}
