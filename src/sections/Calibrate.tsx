import { Scale } from "lucide-react";
import { Section } from "../components/Section";
import { Button, Group, Select, Stack } from "@mantine/core";
import { type Rgb } from "culori";
import { useCalibration } from "../contexts/calibration/useCalibration";
import { CALIBRATION_METHODS } from "../contexts/calibration/methods";
import { COLOR_SAMPLE_METHODS } from "../contexts/calibration/ColorSampling";
import { useHyperion } from "../contexts/hyperion";
import { notifications } from "@mantine/notifications";
import { ColorSelect } from "../components/ColorSelect";
import { useState } from "react";
import { COLORS } from "../utils/color";

export function CalibrateSection() {
  const [colors, setColors] = useState<{ value: Rgb; name: string }[]>([
    ...COLORS,
  ]);

  const { clearAmbientColor, setAdjustment } = useHyperion();
  const {
    calibrationMethod,
    setCalibrationMethod,
    sampleMethod,
    setSampleMethod,
    start,
    clearErrors,
  } = useCalibration();

  return (
    <Section
      icon={Scale}
      title={"Calibrate"}
      subtitle={"Configure and initiate the calibration process."}
    >
      <Stack>
        {/* <ColorInput
          label={"Target Color"}
          placeholder={"#RRGGBB"}
          format="hex"
          value={formatHex(targetColor)}
          onChange={(value) => setTargetColor(rgb(value)!)}
        /> */}

        <ColorSelect
          value={colors}
          onChange={(value) => setColors(value)}
          label={"Selected Colors"}
          description={"Select colors to be used in the calibration process."}
        />

        <Group grow>
          <Select
            label={"Calibration Method"}
            value={calibrationMethod}
            onChange={(value) =>
              setCalibrationMethod(value as keyof typeof CALIBRATION_METHODS)
            }
            data={
              Object.entries(CALIBRATION_METHODS).map(([key, value]) => ({
                value: key,
                label: value.label,
              })) as {
                value: keyof typeof CALIBRATION_METHODS;
                label: string;
              }[]
            }
          />
          <Select
            label={"Sample Method"}
            value={sampleMethod}
            onChange={(value) =>
              setSampleMethod(value as keyof typeof COLOR_SAMPLE_METHODS)
            }
            data={
              Object.entries(COLOR_SAMPLE_METHODS).map(([key, value]) => ({
                value: key,
                label: value,
              })) as {
                value: keyof typeof COLOR_SAMPLE_METHODS;
                label: string;
              }[]
            }
          />
        </Group>

        <Button.Group>
          <Button
            flex={1}
            size={"lg"}
            fullWidth
            onClick={async () => {
              clearErrors();

              for (const color of colors) {
                console.log(
                  "Starting calibration for color:",
                  color.name,
                  color.value,
                );

                await start(color.value, color.name)
                  .then((result) => {
                    console.log("Calibration completed with result:", result);
                    notifications.show({
                      title: "Calibration completed",
                      message: "Calibration process has finished successfully.",
                      color: "green",
                    });

                    clearAmbientColor();

                    setAdjustment(color.name, result);
                  })
                  .catch((error) => {
                    console.error("Calibration failed:", error);
                    notifications.show({
                      title: "Calibration failed",
                      message: `An error occurred during calibration: ${error.message}`,
                      color: "red",
                    });
                  });
              }
            }}
          >
            Start Calibration
          </Button>
        </Button.Group>

        <Button variant={"subtle"} size={"sm"} onClick={clearAmbientColor}>
          Clear override
        </Button>
      </Stack>
    </Section>
  );
}
