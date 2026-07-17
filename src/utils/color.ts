import { converter, toGamut, type Oklab, type Rgb } from "culori";

const toOklab = converter("oklab");
const toRgb = converter("rgb");
const toLinear = converter("lrgb");
const gamutMapRgb = toGamut("rgb", "oklch");

export const COLORS = [
  {
    name: "white",
    value: toRgb("#FFFFFF")!,
  },
  {
    name: "red",
    value: toRgb("#FF0000")!,
  },
  {
    name: "green",
    value: toRgb("#00FF00")!,
  },
  {
    name: "blue",
    value: toRgb("#0000FF")!,
  },
  {
    name: "cyan",
    value: toRgb("#00FFFF")!,
  },
  {
    name: "magenta",
    value: toRgb("#FF00FF")!,
  },
  {
    name: "yellow",
    value: toRgb("#FFFF00")!,
  },
] as const;

export interface CalculateNextAmbientColorOptions {
  learningRate: number;
  lightnessWeight: number;
  chromaWeight: number;
}

export function calculateNextAmbientColor(
  target: Rgb,
  measuredAmbient: Rgb,
  currentOutput: Rgb,
  options: CalculateNextAmbientColorOptions = {
    learningRate: 0.25,
    lightnessWeight: 0.2,
    chromaWeight: 1,
  },
): Rgb {
  const targetLab = toOklab(target);
  const measuredLab = toOklab(measuredAmbient);
  const outputLab = toOklab(currentOutput);

  console.table({
    targetR: target.r,
    targetG: target.g,
    targetB: target.b,
    ambientR: measuredAmbient.r,
    ambientG: measuredAmbient.g,
    ambientB: measuredAmbient.b,
    outputR: currentOutput.r,
    outputG: currentOutput.g,
    outputB: currentOutput.b,
  });

  if (!targetLab || !measuredLab || !outputLab) {
    throw new Error("Could not convert color to OKLab");
  }

  const next: Oklab = {
    mode: "oklab",

    // Correct brightness more conservatively
    l:
      outputLab.l +
      (targetLab.l - measuredLab.l) *
        options.learningRate *
        options.lightnessWeight,

    // Correct color cast more aggressively
    a:
      outputLab.a +
      (targetLab.a - measuredLab.a) *
        options.learningRate *
        options.chromaWeight,

    b:
      outputLab.b +
      (targetLab.b - measuredLab.b) *
        options.learningRate *
        options.chromaWeight,
  };

  console.log("Next OKLab color:", next);

  const mapped = gamutMapRgb(next);

  console.log("Mapped to RGB gamut:", mapped);

  const rgb = toRgb(mapped);

  console.log("Converted to RGB:", rgb);

  if (!rgb) {
    throw new Error("Could not convert corrected color to RGB");
  }

  return rgb;
}

export function subtractBaseline(measured: Rgb, baseline: Rgb): Rgb {
  const measuredLinear = toLinear(measured);
  const baselineLinear = toLinear(baseline);

  if (!measuredLinear || !baselineLinear) {
    throw new Error("Could not convert colors to linear RGB");
  }

  const corrected = toRgb({
    mode: "lrgb",
    r: Math.max(0, measuredLinear.r - baselineLinear.r),
    g: Math.max(0, measuredLinear.g - baselineLinear.g),
    b: Math.max(0, measuredLinear.b - baselineLinear.b),
  });

  if (!corrected) {
    throw new Error("Could not convert corrected color");
  }

  return corrected;
}
