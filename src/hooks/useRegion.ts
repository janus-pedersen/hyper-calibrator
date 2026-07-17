import type { Rgb } from "culori";
import { useState } from "react";
import { converter } from "culori";
import {
  canvasAvgColor,
  canvasDominantColor,
  videoToCanvas,
} from "../utils/video";

const rgb = converter("rgb");

const FALLBACK = rgb("#000")!;

export interface VideoRegion {
  label: string;
  rect: DOMRect;
  update: (rect: DOMRect) => void;
  reset: () => void;
  sample: () => {
    average: Rgb;
    dominant: Rgb;
  };
}

export const useRegion = (
  initialRect: DOMRect,
  label: string,
  video?: HTMLVideoElement | null,
) => {
  const [region, setRegion] = useState<
    Omit<VideoRegion, "update" | "sample" | "reset">
  >({
    rect: initialRect,
    label,
  });

  const updateRegion = (newRect: DOMRect) => {
    setRegion((prev) => ({ ...prev, rect: newRect }));
  };

  const sampleColor = () => {
    if (!video) {
      // console.warn("Video element is not available for sampling color.");
      return { dominant: FALLBACK, average: FALLBACK };
    }

    if (region.rect.width <= 0 || region.rect.height <= 0) {
      // console.warn("Region dimensions are invalid for sampling color.");
      return { dominant: FALLBACK, average: FALLBACK };
    }

    const { canvas, context } = videoToCanvas(video, region.rect);
    const average = canvasAvgColor(canvas, context);
    const dominant = canvasDominantColor(canvas, context);
    return {
      average,
      dominant: dominant,
    };
  };

  const resetRegion = () => {
    setRegion((prev) => ({ ...prev, rect: initialRect }));
  };

  return {
    region: {
      ...region,
      update: updateRegion,
      sample: sampleColor,
      reset: resetRegion,
    },
  };
};
