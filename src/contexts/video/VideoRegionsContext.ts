import { createContext } from "react";
import type { VideoRegion } from "../../hooks/useRegion";

export interface VideoRegionsContext {
  display: VideoRegion;
  ambient: VideoRegion;
}
export const VideoRegionsContext = createContext<VideoRegionsContext | null>(
  null,
);
