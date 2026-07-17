import { Camera } from "lucide-react";
import { Section } from "../components/Section";
import { CameraView } from "../components/CameraView";

export function CameraSection() {
  return (
    <Section
      icon={Camera}
      title={"Camera"}
      subtitle={"Configure the camera settings"}
    >
      <CameraView />
    </Section>
  );
}
