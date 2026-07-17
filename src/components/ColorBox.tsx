import { Box, type PaperProps } from "@mantine/core";
import { useContrast } from "../hooks/useContrast";
import { formatHex, type Rgb, converter } from "culori";

const rgb = converter("rgb");

export function ColorBox({
  color,
  label,
  ...props
}: {
  color?: Rgb | null;
  label: string;
} & PaperProps & { onClick?: () => void }) {
  const contrastColor = useContrast(color ?? rgb("#000")!);

  return (
    <Box
      fw={550}
      tt={"uppercase"}
      {...props}
      p={"xs"}
      bg={color ? formatHex(color) : "transparent"}
      c={formatHex(contrastColor)}
      style={{
        boxShadow: "inset 0px 4px 6px rgba(0, 0, 0, 0.1)",
        ...props["style"],
      }}
    >
      {label}
    </Box>
  );
}
