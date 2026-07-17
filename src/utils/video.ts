import type { Rgb } from "culori";

const CANVAS = document.createElement("canvas");
const CONTEXT = CANVAS.getContext("2d", {
  willReadFrequently: true,
  alpha: false,
})!;

export function videoToCanvas(
  video: HTMLVideoElement,
  rect: DOMRect,
): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } {
  const scaled = new DOMRect(
    rect.x * video.videoWidth,
    rect.y * video.videoHeight,
    rect.width * video.videoWidth,
    rect.height * video.videoHeight,
  );

  // Crop the canvas to the relevant rectangle dimensions
  CANVAS.width = scaled.width;
  CANVAS.height = scaled.height;

  // Only draw the specified rectangle from the video onto the canvas
  CONTEXT.drawImage(
    video,
    scaled.x,
    scaled.y,
    scaled.width,
    scaled.height,
    0,
    0,
    scaled.width,
    scaled.height,
  );

  return { canvas: CANVAS, context: CONTEXT };
}

export function canvasRgbData(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
): Rgb[] {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const colors: Rgb[] = [];

  for (let i = 0; i < data.length; i += 4) {
    colors.push({
      mode: "rgb",
      r: data[i] / 255,
      g: data[i + 1] / 255,
      b: data[i + 2] / 255,
    });
  }

  return colors;
}

export function canvasAvgColor(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
): Rgb {
  const rgbs = canvasRgbData(canvas, context);

  let r = 0,
    g = 0,
    b = 0;
  const pixelCount = rgbs.length;

  for (const color of rgbs) {
    r += color.r;
    g += color.g;
    b += color.b;
  }

  return {
    mode: "rgb",
    r: r / pixelCount,
    g: g / pixelCount,
    b: b / pixelCount,
  };
}

export function canvasDominantColor(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  bucketSize = 0.2,
): Rgb {
  const colors = canvasRgbData(canvas, context);
  if (colors.length === 0)
    throw new Error("No colors found in the canvas data.");

  const buckets = new Map<
    string,
    { count: number; r: number; g: number; b: number }
  >();

  for (const color of colors) {
    const r = color.r ?? 0;
    const g = color.g ?? 0;
    const b = color.b ?? 0;

    const key = [
      Math.floor(r / bucketSize),
      Math.floor(g / bucketSize),
      Math.floor(b / bucketSize),
    ].join(",");

    const bucket = buckets.get(key) ?? {
      count: 0,
      r: 0,
      g: 0,
      b: 0,
    };

    bucket.count++;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;

    buckets.set(key, bucket);
  }

  const dominant = [...buckets.values()].reduce((largest, bucket) =>
    bucket.count > largest.count ? bucket : largest,
  );

  return {
    mode: "rgb",
    r: dominant.r / dominant.count,
    g: dominant.g / dominant.count,
    b: dominant.b / dominant.count,
  };
}
