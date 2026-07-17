import { useContext } from "react";
import { VideoRegionsContext } from "./VideoRegionsContext";

export const useVideoRegions = () => {
  const context = useContext(VideoRegionsContext);
  if (!context) {
    throw new Error(
      "useVideoRegions must be used within a VideoRegionsProvider",
    );
  }

  return context;
};
