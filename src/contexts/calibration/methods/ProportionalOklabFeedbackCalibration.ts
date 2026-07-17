import { differenceEuclidean, filterBrightness } from "culori";
import type { CalibrationMethod } from "../CalibrationMethod";
import { variance } from "../../../utils/math";
import { calculateNextAmbientColor } from "../../../utils/color";
import { Repeat } from "lucide-react";

const differenceOklab = differenceEuclidean("oklab");
const darken = filterBrightness(0.5, "rgb");

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default {
  label: "Proportional Oklab Feedback",
  icon: Repeat,
  start: async ({
    target,
    sample,
    overrideAmbient,
    overrideDisplay,
    reportError,
  }) => {
    // Capture a baseline sample of the wall
    await overrideAmbient({ r: 0, g: 0, b: 0, mode: "rgb" });
    await overrideDisplay({ r: 0, g: 0, b: 0, mode: "rgb" });

    await wait(1000); // Wait for the display and ambient light to settle

    // Start with a darkened version of the target color for the ambient light, that way theres room to increase brightness of some channels if needed
    let current = darken(target);
    await overrideDisplay(target);
    await overrideAmbient(current);

    await wait(1000); // Wait for the display and ambient light to settle
    const { ambient, display } = await sample();
    const errors = [differenceOklab(display, ambient)];
    reportError(errors[0], 0);

    do {
      const { ambient, display } = await sample();
      current = calculateNextAmbientColor(display, ambient, current, 0.5);
      await overrideAmbient(current);

      await wait(1000);
      const { ambient: newAmbient, display: newDisplay } = await sample();

      const error = differenceOklab(newDisplay, newAmbient);
      errors.push(error);
      reportError(error, errors.length);

      // Do the magic to calculate next ambient colors based off the target, measured ambient, and current output colors
    } while (errors.length < 10 || variance(errors.slice(-10)) > 0.001);

    return current;
  },
} satisfies CalibrationMethod;
