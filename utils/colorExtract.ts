/**
 * 이미지 색상 추출 유틸리티 (클라이언트 전용)
 * Canvas API + k-means 클러스터링으로 대표 색상 추출
 */

type RgbColor = { r: number; g: number; b: number };

// ─── Canvas 기반 이미지 픽셀 샘플링 ──────────────────────────────────────────

/**
 * File → Canvas ImageData 변환 (이미지 로드 → 픽셀 데이터 추출)
 * 최대 100x100 크기로 리사이즈해 샘플링 성능 최적화
 */
async function fileToPixels(file: File): Promise<RgbColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // 최대 100x100으로 축소하여 픽셀 샘플 수 제한
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 2D context를 생성할 수 없습니다."));

      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);

      // RGBA 배열에서 불투명(alpha > 128) 픽셀만 추출
      const pixels: RgbColor[] = [];
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 128) {
          pixels.push({ r: data[i], g: data[i + 1], b: data[i + 2] });
        }
      }
      resolve(pixels);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지 로드에 실패했습니다."));
    };

    img.src = url;
  });
}

// ─── k-means 클러스터링 ────────────────────────────────────────────────────────

/**
 * RGB 두 색상 간 유클리드 거리 계산 (클러스터링 내부 전용)
 */
function rgbDist(a: RgbColor, b: RgbColor): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

/**
 * k-means 클러스터링으로 pixels에서 k개 대표 RGB 색상 추출
 * 최대 maxIter 번 반복 후 수렴
 */
function kMeansColors(pixels: RgbColor[], k: number, maxIter = 20): RgbColor[] {
  if (pixels.length === 0) return [];
  const clampedK = Math.min(k, pixels.length);

  // 초기 중심점: 픽셀 배열에서 균등 간격으로 선택
  let centroids = Array.from({ length: clampedK }, (_, i) =>
    pixels[Math.floor((i * pixels.length) / clampedK)]
  );

  for (let iter = 0; iter < maxIter; iter++) {
    // 각 픽셀을 가장 가까운 중심점에 배정
    const clusters: RgbColor[][] = Array.from({ length: clampedK }, () => []);
    for (const px of pixels) {
      let minDist = Infinity;
      let closest = 0;
      centroids.forEach((c, i) => {
        const d = rgbDist(px, c);
        if (d < minDist) { minDist = d; closest = i; }
      });
      clusters[closest].push(px);
    }

    // 중심점 업데이트 (클러스터 평균)
    const newCentroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];
      const avg = cluster.reduce(
        (acc, px) => ({ r: acc.r + px.r, g: acc.g + px.g, b: acc.b + px.b }),
        { r: 0, g: 0, b: 0 }
      );
      return {
        r: Math.round(avg.r / cluster.length),
        g: Math.round(avg.g / cluster.length),
        b: Math.round(avg.b / cluster.length),
      };
    });

    // 수렴 여부 확인 (모든 중심점이 이전과 동일하면 종료)
    const converged = newCentroids.every((c, i) => rgbDist(c, centroids[i]) < 1);
    centroids = newCentroids;
    if (converged) break;
  }

  return centroids;
}

/**
 * RGB 객체를 HEX 문자열로 변환
 */
function rgbToHex({ r, g, b }: RgbColor): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

// ─── 공개 API ─────────────────────────────────────────────────────────────────

/**
 * 이미지 파일에서 k개의 대표 HEX 색상 배열 추출 (클라이언트 전용)
 * 내부: FileReader → Canvas → getImageData → k-means clustering
 */
export async function extractColorsFromImage(
  file: File,
  k = 5
): Promise<string[]> {
  const pixels = await fileToPixels(file);
  const representative = kMeansColors(pixels, k);
  return representative.map(rgbToHex);
}
