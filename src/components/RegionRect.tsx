import { useRef, type PointerEvent, type ReactNode } from "react";
import { ActionIcon, Paper, Text } from "@mantine/core";
import { Grip } from "lucide-react";

interface SelectionRectProps {
  value: DOMRect;
  label?: ReactNode;
  dashed?: boolean;
  onChange: (rect: DOMRect) => void;
  minWidth?: number;
  minHeight?: number;
}

export function RegionRect({
  value,
  label,
  dashed = false,
  onChange,
  minWidth = 0.1,
  minHeight = 0.2,
}: SelectionRectProps) {
  const interactionRef = useRef<{
    type: "move" | "resize";
    startX: number;
    startY: number;
    initial: DOMRect;
  } | null>(null);

  function startInteraction(
    event: PointerEvent<HTMLElement>,
    type: "move" | "resize",
  ) {
    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);

    interactionRef.current = {
      type,
      startX: event.clientX,
      startY: event.clientY,
      initial: new DOMRect(value.x, value.y, value.width, value.height),
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const interaction = interactionRef.current;

    if (!interaction) return;

    const container = event.currentTarget.parentElement;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const deltaX = (event.clientX - interaction.startX) / bounds.width;
    const deltaY = (event.clientY - interaction.startY) / bounds.height;
    const { initial } = interaction;

    if (interaction.type === "move") {
      onChange(
        new DOMRect(
          clamp(initial.x + deltaX, 0, 1 - initial.width),
          clamp(initial.y + deltaY, 0, 1 - initial.height),
          initial.width,
          initial.height,
        ),
      );
      return;
    }

    onChange(
      new DOMRect(
        initial.x,
        initial.y,
        clamp(initial.width + deltaX, minWidth, 1 - initial.x),
        clamp(initial.height + deltaY, minHeight, 1 - initial.y),
      ),
    );
  }

  function stopInteraction() {
    interactionRef.current = null;
  }

  return (
    <Paper
      withBorder
      shadow="md"
      radius="sm"
      onPointerDown={(event) => startInteraction(event, "move")}
      onPointerMove={handlePointerMove}
      onPointerUp={stopInteraction}
      onPointerCancel={stopInteraction}
      style={{
        position: "absolute",
        left: `${value.x * 100}%`,
        top: `${value.y * 100}%`,
        width: `${value.width * 100}%`,
        height: `${value.height * 100}%`,
        zIndex: 1,
        borderStyle: dashed ? "dashed" : "solid",
        backgroundColor: "transparent",
        boxSizing: "border-box",
        cursor: "move",
        touchAction: "none",
        userSelect: "none",
        borderWidth: "2px",
        overflow: "hidden",
      }}
    >
      {label &&
        (typeof label === "string" ? (
          <Text ta="center" fw={600} c="white" size="sm">
            {label}
          </Text>
        ) : (
          label
        ))}

      <ActionIcon
        aria-label="Resize selection"
        radius="xl"
        variant="default"
        size="md"
        onPointerDown={(event) => startInteraction(event, "resize")}
        style={{
          position: "absolute",
          right: 4,
          bottom: 4,
          cursor: "nwse-resize",
          touchAction: "none",
        }}
      >
        <Grip size={16} />
      </ActionIcon>
    </Paper>
  );
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}
