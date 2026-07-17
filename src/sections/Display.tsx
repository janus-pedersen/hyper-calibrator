import { ExternalLink, Monitor } from "lucide-react";
import { Section } from "../components/Section";
import { Button, Group, Spoiler } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { useHyperion } from "../contexts/hyperion";
import { ColorBox } from "../components/ColorBox";
import type { Rgb } from "culori";

const rgb = (r: number, g: number, b: number): Rgb => ({
  mode: "rgb",
  r,
  g,
  b,
});

const debugColors: { label: string; color: Rgb }[] = [
  { label: "red", color: rgb(255, 0, 0) },
  { label: "green", color: rgb(0, 255, 0) },
  { label: "blue", color: rgb(0, 0, 255) },
  { label: "white", color: rgb(255, 255, 255) },
  { label: "black", color: rgb(0, 0, 0) },
  { label: "cyan", color: rgb(0, 255, 255) },
  { label: "magenta", color: rgb(255, 0, 255) },
  { label: "yellow", color: rgb(255, 255, 0) },
];

export function DisplaySection() {
  const { setDisplayColor } = useHyperion();

  return (
    <Section
      icon={Monitor}
      title={"Display"}
      subtitle={"Configure the display window"}
    >
      <Button
        rightSection={<ExternalLink size={16} />}
        onClick={() => {
          const popup = window.open(
            `${import.meta.env.BASE_URL}#/display`,
            "color-display",
            "width=800,height=600",
          );

          if (!popup) {
            notifications.show({
              title: "Failed to open window",
              message: "Please allow popups for this site.",
              color: "red",
            });
            return;
          }

          popup.document.title = "Hyper Calibrator Display";
          popup.document.body.style.margin = "0";
        }}
      >
        Open Window
      </Button>

      <Spoiler
        showLabel={"Show debug controls"}
        hideLabel={"Hide debug controls"}
        maxHeight={0}
        mt={"md"}
      >
        <Group gap={"xs"} w={"100%"} wrap={"wrap"}>
          {debugColors.map(({ label, color }) => (
            <ColorBox
              label={label}
              color={color}
              key={label}
              p={"xs"}
              px={"lg"}
              onClick={() => setDisplayColor(color)}
            />
          ))}
        </Group>
      </Spoiler>
    </Section>
  );
}
