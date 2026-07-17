import {
  Select,
  useMantineColorScheme,
  Group,
  type SelectProps,
} from "@mantine/core";
import { Sun, SunMoon, Moon, CheckIcon } from "lucide-react";

const ICONS = {
  dark: Moon,
  light: Sun,
  auto: SunMoon,
};

const iconProps = {
  color: "currentColor",
  opacity: 0.6,
  size: 18,
};

export function ColorSchemeSwitch(props: SelectProps) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const Icon = ICONS[colorScheme as keyof typeof ICONS];

  return (
    <Select
      {...props}
      size={"sm"}
      w={"150"}
      value={colorScheme}
      onChange={(value) => {
        switch (value) {
          case "auto":
          case "dark":
          case "light":
            setColorScheme(value);
            break;
          default:
            throw new Error(`Unknown color scheme: ${value}`);
        }
      }}
      data={[
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" },
        { label: "Auto", value: "auto" },
      ]}
      leftSection={<Icon {...iconProps} color={"text"} />}
      renderOption={({ option, checked }) => {
        const Icon = ICONS[option.value as keyof typeof ICONS];
        return (
          <Group flex="1" gap="xs">
            <Icon {...iconProps} />
            {option.label}
            {checked && (
              <CheckIcon style={{ marginInlineStart: "auto" }} {...iconProps} />
            )}
          </Group>
        );
      }}
    ></Select>
  );
}
