import { useHyperion } from "../hyperion";
import { useRegion } from "../../hooks/useRegion";
import { VideoRegionsContext } from "./VideoRegionsContext";

export const VideoRegionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { video } = useHyperion();

  const { region: displayRegion } = useRegion(
    new DOMRect(0.1, 0.1, 0.35, 0.8),
    "Display",
    video,
  );

  const { region: ambientRegion } = useRegion(
    new DOMRect(0.55, 0.1, 0.35, 0.8),
    "Ambient",
    video,
  );

  return (
    <VideoRegionsContext.Provider
      value={{ display: displayRegion, ambient: ambientRegion }}
    >
      {children}
    </VideoRegionsContext.Provider>
  );
};
