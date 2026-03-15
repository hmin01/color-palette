/**
 * 헥스 색상을 RGB 객체로 변환합니다.
 */
export function hexToRgbObject(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

/**
 * RGB 값을 HEX 문자열로 변환합니다.
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * 베이스 컬러(500)를 기준으로 0–900 색상 스케일을 생성합니다.
 * - 0–400: 흰색과 혼합 (밝은 계열)
 * - 500: 베이스 컬러
 * - 600–900: 검정과 혼합 (어두운 계열)
 */
export function generateColorScale(
  hex: string
): { stop: number; hex: string }[] {
  const { r, g, b } = hexToRgbObject(hex);

  // 흰색 혼합 비율 (0, 100, 200, 300, 400)
  const lightRatios = [0.95, 0.85, 0.70, 0.50, 0.28];
  // 검정 혼합 비율 (600, 700, 800, 900)
  const darkRatios = [0.18, 0.38, 0.58, 0.76];

  const stops = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  return stops.map((stop, i) => {
    if (stop === 500) return { stop, hex };

    if (stop < 500) {
      const ratio = lightRatios[i];
      return {
        stop,
        hex: rgbToHex(
          Math.round(r + (255 - r) * ratio),
          Math.round(g + (255 - g) * ratio),
          Math.round(b + (255 - b) * ratio)
        ),
      };
    }

    const ratio = darkRatios[i - 6];
    return {
      stop,
      hex: rgbToHex(
        Math.round(r * (1 - ratio)),
        Math.round(g * (1 - ratio)),
        Math.round(b * (1 - ratio))
      ),
    };
  });
}

/**
 * 배경색 밝기에 따라 텍스트 색상(흰색 또는 어두운 색)을 반환합니다.
 */
export function getTextColorForBg(hex: string): string {
  const { r, g, b } = hexToRgbObject(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
}

/**
 * 헥스 색상을 RGB 문자열로 변환합니다. (CSS rgba()에 사용)
 */
export function hexToRgb(hex: string): string {
  const { r, g, b } = hexToRgbObject(hex);
  return `${r}, ${g}, ${b}`;
}

/**
 * 헥스 색상을 HSL 객체로 변환합니다.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const raw = hexToRgbObject(hex);
  const r = raw.r / 255;
  const g = raw.g / 255;
  const b = raw.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    case b: h = ((r - g) / d + 4) / 6; break;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * WCAG 2.1 기준 단일 채널 상대 휘도 변환 (sRGB linearization)
 */
function toLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/**
 * WCAG 2.1 기준 상대 휘도(relative luminance)를 계산합니다.
 * 반환값: 0(검정) ~ 1(흰색)
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgbObject(hex);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * WCAG 2.1 기준 두 색상의 대비율을 계산합니다.
 * 반환값: 1(동일) ~ 21(흑백 최대)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG 등급을 반환합니다.
 * - AAA: 대비율 7:1 이상 (일반 텍스트 최상위 등급)
 * - AA: 대비율 4.5:1 이상 (일반 텍스트 최소 등급)
 * - fail: 기준 미달
 */
export function getWcagGrade(ratio: number): "AAA" | "AA" | "fail" {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "fail";
}

/**
 * 두 헥스 색상 사이의 RGB 유클리드 거리를 계산합니다.
 * 유사 색상 검색에 사용됩니다.
 */
export function getRgbDistance(hex1: string, hex2: string): number {
  const c1 = hexToRgbObject(hex1);
  const c2 = hexToRgbObject(hex2);
  return Math.sqrt(
    (c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2
  );
}

/**
 * HSL 값을 헥스 색상으로 변환합니다.
 * h: 0-360, s: 0-100, l: 0-100
 */
export function hslToHex(h: number, s: number, l: number): string {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  if (sNorm === 0) {
    const val = Math.round(lNorm * 255);
    return rgbToHex(val, val, val);
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q =
    lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  return rgbToHex(
    Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hNorm) * 255),
    Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255)
  );
}

/**
 * 베이스 색상을 검정과 혼합하여 어두운 Shades 배열을 생성합니다.
 * 인덱스 0 = 원본 색상, steps-1 = 가장 어두운 색상 (90% 혼합)
 */
export function generateShades(hex: string, steps = 10): string[] {
  const { r, g, b } = hexToRgbObject(hex);
  return Array.from({ length: steps }, (_, i) => {
    const factor = (i / (steps - 1)) * 0.9;
    return rgbToHex(
      Math.round(r * (1 - factor)),
      Math.round(g * (1 - factor)),
      Math.round(b * (1 - factor))
    );
  });
}

/**
 * 베이스 색상을 흰색과 혼합하여 밝은 Tints 배열을 생성합니다.
 * 인덱스 0 = 원본 색상, steps-1 = 가장 밝은 색상 (흰색에 가까운)
 */
export function generateTints(hex: string, steps = 10): string[] {
  const { r, g, b } = hexToRgbObject(hex);
  return Array.from({ length: steps }, (_, i) => {
    const factor = (i / (steps - 1)) * 0.9;
    return rgbToHex(
      Math.round(r + (255 - r) * factor),
      Math.round(g + (255 - g) * factor),
      Math.round(b + (255 - b) * factor)
    );
  });
}

/**
 * HSL의 채도(S)를 0~100%로 변화시킨 Saturation 배열을 생성합니다.
 * 인덱스 0 = 채도 0% (무채색), steps-1 = 채도 100% (최대 채도)
 */
export function generateSaturations(hex: string, steps = 10): string[] {
  const { h, l } = hexToHsl(hex);
  return Array.from({ length: steps }, (_, i) => {
    const s = (i / (steps - 1)) * 100;
    return hslToHex(h, s, l);
  });
}

/**
 * 헥스 색상을 HSB(HSV) 객체로 변환합니다.
 */
export function hexToHsb(hex: string): { h: number; s: number; b: number } {
  const raw = hexToRgbObject(hex);
  const r = raw.r / 255;
  const g = raw.g / 255;
  const b = raw.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  const brightness = max;
  const saturation = max === 0 ? 0 : d / max;

  let h = 0;
  if (max !== min) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(saturation * 100),
    b: Math.round(brightness * 100),
  };
}
