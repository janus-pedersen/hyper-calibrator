import {
  ColorSwatch,
  Text,
  MultiSelect,
  Pill,
  type ComboboxRenderPillInput,
  type MultiSelectProps,
} from "@mantine/core";
import { type Rgb } from "culori";
import { COLORS } from "../utils/color";

type ColorSelectColor = {
  value: Rgb;
  name: string;
};

export interface ColorSelectProps {
  value: ColorSelectColor[];
  onChange: (value: ColorSelectColor[]) => void;
}

export const ColorSelect = (
  props: ColorSelectProps & Omit<MultiSelectProps, "value" | "onChange">,
) => {
  //   const [value, setValue] = useState<ColorSelectColor[]>([]);

  const renderPill = ({ option, value, onRemove }: ComboboxRenderPillInput) => {
    return (
      <Pill
        withRemoveButton
        onRemove={onRemove}
        styles={{
          label: {
            display: "flex",
            alignItems: "center",
          },
          root: {
            paddingInline: "0.4rem",
          },
        }}
      >
        <ColorSwatch color={value as string} size={"1lh"} mr={5} />
        <Text tt={"capitalize"} size={"xs"} fw={500}>
          {option.label}
        </Text>
      </Pill>
    );
  };

  return (
    <MultiSelect
      {...props}
      data={
        COLORS?.map((color) => ({
          value: color.name,
          label: color.name,
        })) || []
      }
      value={props.value.map((color) => color.name)}
      searchable
      onChange={(selectedNames) => {
        const selectedColors = COLORS.filter((color) =>
          selectedNames.includes(color.name),
        );
        props.onChange?.(selectedColors);
      }}
      renderPill={renderPill}
    />
  );
};
