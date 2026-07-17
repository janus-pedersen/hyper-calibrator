import type { VideoRegion } from "../../hooks/useRegion";

export type ColorSampleMethods = keyof ReturnType<VideoRegion["sample"]>;

export const COLOR_SAMPLE_METHODS = {
  average: "Average Color",
  dominant: "Dominant Color",
} satisfies Record<ColorSampleMethods, string>;
