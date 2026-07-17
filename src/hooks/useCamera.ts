import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useCamera = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "active" | "error">(
    "idle",
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const device = useMemo(
    () => devices.find((d) => d.deviceId === deviceId) || null,
    [devices, deviceId],
  );

  const updateDevices = useCallback((infos: MediaDeviceInfo[]) => {
    setDevices(infos.filter((info) => info.kind === "videoinput"));
  }, []);

  const refreshDevices = useCallback(
    () => navigator.mediaDevices.enumerateDevices().then(updateDevices),
    [updateDevices],
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(updateDevices);
    navigator.mediaDevices.addEventListener("devicechange", refreshDevices);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        refreshDevices,
      );
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [refreshDevices, updateDevices]);

  const start = useCallback(
    async (deviceId?: string) => {
      const video = videoRef.current;
      if (!video) return;

      setStatus("loading");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: "environment",
            deviceId: deviceId ? { exact: deviceId } : undefined,
            width: { ideal: 1920, max: 1920 },
            height: { ideal: 1080, max: 1080 },
            frameRate: { ideal: 30, max: 60 },
          },
        });
        const track = stream.getVideoTracks()[0];

        console.log("Started camera with track:", track.getSettings());
        console.log("Track capabilities:", track.getCapabilities());

        if (!track) {
          notifications.show({
            title: "No video track found",
            message: "Could not find a video track in the media stream.",
            color: "red",
          });
          setStatus("error");
          return;
        }

        streamRef.current?.getTracks().forEach((current) => current.stop());
        streamRef.current = stream;
        video.srcObject = stream;
        setDeviceId(track.getSettings().deviceId || null);
        await video.play();
        await refreshDevices();
        setStatus("active");
      } catch (error) {
        notifications.show({
          title: "Could not start camera",
          message:
            "Check camera access in your browser settings and try again.",
          color: "red",
        });
        console.error("Error accessing camera", error);
        setStatus("error");
      }
    },
    [refreshDevices],
  );

  return {
    videoRef,
    streamRef,
    devices,
    device,
    status,

    start,
  };
};
