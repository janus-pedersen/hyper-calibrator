import { parse, wcagContrast, type Color, type Rgb } from "culori";
import { useEffect, useState } from "react";

export const useContrast = (color: Rgb) => {
  const getCssColor = (selector: string) =>
    parse(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(selector),
    );

  const [{ text, base }, setColors] = useState<{
    text?: Color;
    base?: Color;
  }>({
    text: getCssColor("--mantine-color-text"),
    base: getCssColor("--mantine-color-body"),
  });

  useEffect(() => {
    const update = () => {
      setColors({
        text: getCssColor("--mantine-color-text"),
        base: getCssColor("--mantine-color-body"),
      });
    };

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mantine-color-scheme", "class", "style"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!base || !text) {
    // console.warn("Base color or text color is not defined.");
    return text || base || { r: 0, g: 0, b: 0, mode: "rgb" };
  }

  const contrastWithText = wcagContrast(color, text);
  const contrastWithBase = wcagContrast(color, base);

  //   console.log(
  //     `Contrast with text: ${contrastWithText}, Contrast with base: ${contrastWithBase}`,
  //   );

  return contrastWithText > contrastWithBase ? text : base;
};
