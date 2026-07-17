import { Center, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { formatHex, type Rgb } from "culori";
import { useContrast } from "../hooks/useContrast";

export interface ColorDisplayEvent {
  color: Rgb;
}

export function ColorDisplay() {
  const [color, setColor] = useState<Rgb>({
    mode: "rgb",
    r: 0,
    g: 0,
    b: 0,
  });
  const contrastColor = useContrast(color);

  useEffect(() => {
    const channel = new BroadcastChannel("color-display");

    const handleMessage = (event: MessageEvent<ColorDisplayEvent>) => {
      setColor(event.data.color);
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: formatHex(color),
      }}
      onClick={(event) => {
        (event.target as HTMLDivElement).requestFullscreen();
      }}
    >
      <Center>
        <Text
          style={{
            top: "50%",
            left: "50%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            userSelect: "none",
          }}
          c={formatHex(contrastColor)}
          opacity={0.8}
        >
          Click to enter fullscreen
        </Text>
      </Center>
    </div>
  );
}
