import type { Rgb } from "culori";
import { createContext } from "react";

export type HyperionRGB = Rgb;

export interface HyperionContextType {
  host: URL;
  setHost: (host: URL) => void;

  video?: HTMLVideoElement;
  setVideo: (video: HTMLVideoElement) => void;

  // channel: BroadcastChannel;

  test: () => Promise<void>;
  setDisplayColor: (color: HyperionRGB) => Promise<void>;
  setAmbientColor: (color: HyperionRGB) => Promise<void>;
  clearAmbientColor: () => Promise<void>;
  setAdjustment: (key: string, color: HyperionRGB) => Promise<void>;
}

export const HyperionContext = createContext<HyperionContextType>({
  host: new URL("http://localhost:8090"),
  setHost: () => {},
  setVideo: () => {},
  test: () => Promise.resolve(),
  setDisplayColor: () => Promise.resolve(),
  setAmbientColor: () => Promise.resolve(),
  clearAmbientColor: () => Promise.resolve(),
  setAdjustment: () => Promise.resolve(),
});
