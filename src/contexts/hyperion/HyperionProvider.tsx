import { useLocalStorage } from "@mantine/hooks";
import { HyperionContext, type HyperionRGB } from "./HyperionContext";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Rgb } from "culori";

export function HyperionProvider({ children }: React.PropsWithChildren) {
  const [host, setHost] = useLocalStorage<URL>({
    key: "hyperion-host",
    defaultValue: new URL("http://localhost:8090"),
    serialize: (value) => value.toString(),
    deserialize: (value) => new URL(value ?? "http://localhost:8090"),
  });

  const [video, setVideo] = useState<HTMLVideoElement | undefined>();

  const channelRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    const channel = new BroadcastChannel("color-display");
    channelRef.current = channel;
    return () => {
      channel.close();
      if (channelRef.current === channel) {
        channelRef.current = null;
      }
    };
  }, []);

  const setDisplayColor = useCallback(
    async (color: Rgb) => {
      channelRef.current?.postMessage({ color });
    },
    [channelRef],
  );

  const jsonRpc = useCallback(
    <T extends Record<string, unknown>>(data: T) => {
      const encoded = encodeURI(JSON.stringify(data));

      return fetch(`${host.origin}/json-rpc?request=${encoded}`, {
        method: "GET",
        mode: "no-cors",
      });
    },
    [host],
  );

  const setAmbientColor = useCallback(
    async (color: HyperionRGB) => {
      await jsonRpc({
        command: "color",
        priority: 50,
        color: [
          Math.round(color.r * 255),
          Math.round(color.g * 255),
          Math.round(color.b * 255),
        ],
      });
    },
    [jsonRpc],
  );

  const clearAmbientColor = useCallback(async () => {
    await jsonRpc({
      command: "clear",
      priority: 50,
    });
  }, [jsonRpc]);

  const setAdjustment = useCallback(
    async (key: string, color: HyperionRGB) => {
      await jsonRpc({
        command: "adjustment",
        adjustment: {
          classic_config: false,
          [key]: [
            Math.round(color.r * 255),
            Math.round(color.g * 255),
            Math.round(color.b * 255),
          ],
        },
      });
    },
    [jsonRpc],
  );

  const test = useCallback(async () => {
    try {
      await jsonRpc({
        command: "serverinfo",
      });
    } catch (error) {
      console.error("Error testing Hyperion connection:", error);
      throw error;
    }
  }, [jsonRpc]);

  return (
    <HyperionContext.Provider
      value={{
        host,
        setHost,
        setAmbientColor,
        clearAmbientColor,
        test,
        setDisplayColor,
        video,
        setVideo,
        setAdjustment,
      }}
    >
      {children}
    </HyperionContext.Provider>
  );
}
