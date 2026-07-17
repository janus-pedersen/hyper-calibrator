import { TextInput, Button, Text, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Section } from "../components/Section";
import { useEffect } from "react";
import { useValidatedState } from "@mantine/hooks";
import { useHyperion } from "../contexts/hyperion";
import { ChevronsLeftRightEllipsis } from "lucide-react";

export function ConnectionSection() {
  const { host, setHost, test } = useHyperion();
  const [{ value, valid }, setValue] = useValidatedState("", (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setValue(host.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [host]);

  return (
    <Section
      icon={ChevronsLeftRightEllipsis}
      title={"Hyperion Connection"}
      subtitle={"Configure the Hyperion host and test the connection."}
    >
      <Group align={"flex-end"}>
        <TextInput
          label={"Hyperion Host"}
          value={value}
          flex={1}
          error={valid ? undefined : "Invalid URL"}
          onChange={(e) => {
            setValue(e.currentTarget.value);
          }}
          onBlur={() => {
            if (valid) {
              setHost(new URL(value));
            }
          }}
        />

        <Button
          onClick={() => {
            test()
              .then(() => {
                notifications.show({
                  title: "Connection successful",
                  message: `Successfully connected to ${host.toString()}`,
                  color: "green",
                });
              })
              .catch((error) => {
                notifications.show({
                  title: "Connection failed",
                  message: `Failed to connect to ${host.toString()}: ${error.message}`,
                  color: "red",
                });
              });
          }}
        >
          Test
        </Button>
      </Group>

      <Text c="dimmed" fz={"xs"}>
        Current host: {host.toString()}
      </Text>
    </Section>
  );
}
