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
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
}

/**
 * 헥스 색상을 RGB 문자열로 변환합니다. (CSS rgba()에 사용)
 */
export function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

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
 * 헥스 색상을 HSL 객체로 변환합니다.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

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
 * 헥스 색상을 HSB(HSV) 객체로 변환합니다.
 */
export function hexToHsb(hex: string): { h: number; s: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

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
