import type { Rgb } from "culori";
import type { ColorSampleMethods } from "./ColorSampling";
import { CALIBRATION_METHODS } from "./methods";
import { useState } from "react";
import { useHyperion } from "../hyperion";
import { useVideoRegions } from "../video/useVideoRegions";

export interface CalibrationContext {
  // Color sampling
  sampleMethod: ColorSampleMethods;
  setSampleMethod: (method: ColorSampleMethods) => void;

  // Calibration method
  calibrationMethod: keyof typeof CALIBRATION_METHODS;
  setCalibrationMethod: (method: keyof typeof CALIBRATION_METHODS) => void;

  errors: {
    [key: string]: number;
  }[];
  clearErrors: () => void;
  progress: number;

  start: (target: Rgb, key: string) => Promise<Rgb>;
}

export const useCalibration = () => {
  const { setAmbientColor, setDisplayColor } = useHyperion();
  const { ambient, display } = useVideoRegions();

  const [sampleMethod, setSampleMethod] =
    useState<ColorSampleMethods>("dominant");
  const [calibrationMethod, setCalibrationMethod] = useState<
    keyof typeof CALIBRATION_METHODS
  >("proportionalOklabFeedbackCalibration");
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<
    {
      [key: string]: number;
    }[]
  >([]);

  const method = CALIBRATION_METHODS[calibrationMethod];

  const start = async (target: Rgb, key: string) => {
    setProgress(0);

    return method.start({
      target,
      overrideAmbient: setAmbientColor,
      overrideDisplay: setDisplayColor,
      reportProgress: (progress) => {
        setProgress(progress);
      },
      reportError: (error, iteration) => {
        setErrors((prev) => {
          const newErrors = [...prev];
          newErrors[iteration] = {
            [key]: error,
            ...(prev.length >= iteration ? prev[iteration] : {}),
          };
          return newErrors;
        });
      },
      sample: async () => {
        const ambientSample = ambient.sample()[sampleMethod];
        const displaySample = display.sample()[sampleMethod];

        return {
          ambient: ambientSample,
          display: displaySample,
        };
      },
    });
  };

  return {
    sampleMethod,
    setSampleMethod,
    calibrationMethod,
    setCalibrationMethod,
    errors,
    clearErrors: () => setErrors([]),
    progress,
    start,
  };
};
