import type { Rgb } from "culori";
import type { LucideIcon } from "lucide-react";

export interface CalibrationContext {
  target: Rgb;
  sample: () => Promise<{
    ambient: Rgb;
    display: Rgb;
  }>;
  overrideAmbient: (color: Rgb) => Promise<void>;
  overrideDisplay: (color: Rgb) => Promise<void>;
  /** Report the estimated progress */
  reportProgress: (progress: number) => void;
  /** Report the error between the ambient and display colors */
  reportError: (error: number, iteration: number) => void;
}

export interface CalibrationMethod {
  label: string;
  icon?: LucideIcon;
  start: (ctx: CalibrationContext) => Promise<Rgb>;
}
