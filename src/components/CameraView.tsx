import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useCamera } from "../hooks/useCamera";
import { ArrowRightLeft, Camera, Pause, Play, RotateCcw } from "lucide-react";
import { useHyperion } from "../contexts/hyperion";
import { RegionRect } from "./RegionRect";
import { ColorBox } from "./ColorBox";
import { type Rgb } from "culori";
import { useState } from "react";
import { useInterval } from "@mantine/hooks";
import { useVideoRegions } from "../contexts/video/useVideoRegions";

export function CameraView() {
  const { videoRef, devices, device, start, status } = useCamera();
  const { setVideo } = useHyperion();

  const { display: displayRegion, ambient: ambientRegion } = useVideoRegions();
  const [displayColor, setDisplayColor] = useState<Rgb | null>(null);
  const [ambientColor, setAmbientColor] = useState<Rgb | null>(null);

  const [live, setLive] = useState(false);

  useInterval(
    () => {
      if (!live) return;

      setDisplayColor(displayRegion.sample().average);
      setAmbientColor(ambientRegion.sample().dominant);
    },
    100,
    { autoInvoke: true },
  );

  return (
    <Stack gap="md">
      <Select
        label="Camera source"
        placeholder="Choose a camera"
        leftSection={<Camera size={16} />}
        value={device?.deviceId || null}
        data={devices.map((camera, index) => ({
          value: camera.deviceId,
          label: camera.label || `Camera ${index + 1}`,
        }))}
        onChange={(deviceId) => start(deviceId || undefined)}
        allowDeselect={false}
      />

      <Paper
        withBorder
        radius="md"
        pos="relative"
        bg="dark.9"
        style={{ overflow: "hidden" }}
      >
        <LoadingOverlay
          visible={status !== "active"}
          zIndex={2}
          overlayProps={{ radius: "md", blur: 3 }}
          loaderProps={{
            children: (
              <Stack align="center" gap="xs">
                <Text fw={600}>Camera preview</Text>
                <Button
                  leftSection={<Play size={16} />}
                  onClick={() => start()}
                >
                  {status === "error" ? "Try again" : "Start camera"}
                </Button>
              </Stack>
            ),
          }}
        />

        <RegionRect
          value={displayRegion.rect}
          onChange={(value) => displayRegion.update(value)}
          label={
            displayColor && (
              <ColorBox label={"Display"} color={live ? displayColor : null} />
            )
          }
        />
        <RegionRect
          dashed
          value={ambientRegion.rect}
          onChange={(value) => ambientRegion.update(value)}
          label={
            ambientColor && (
              <ColorBox label={"Ambient"} color={live ? ambientColor : null} />
            )
          }
        />

        <video
          ref={videoRef}
          onLoadedMetadata={(event) => setVideo(event.currentTarget)}
          muted
          playsInline
          autoPlay
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            aspectRatio: status === "active" ? "auto" : "16/9",
          }}
        />
      </Paper>

      <Group>
        <Button
          variant={"subtle"}
          onClick={() => {
            displayRegion.reset();
            ambientRegion.reset();
          }}
          leftSection={<RotateCcw size={16} />}
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            const displayRect = displayRegion.rect;
            const ambientRect = ambientRegion.rect;

            displayRegion.update(ambientRect);
            ambientRegion.update(displayRect);
          }}
          leftSection={<ArrowRightLeft size={16} />}
        >
          Swap
        </Button>

        <Box flex={1} />

        <Button
          variant={live ? "filled" : "subtle"}
          onClick={() => setLive(!live)}
          disabled={status !== "active"}
          leftSection={live ? <Pause size={16} /> : <Play size={16} />}
        >
          {live ? "Pause" : "Resume"}
        </Button>
      </Group>
    </Stack>
  );
}
