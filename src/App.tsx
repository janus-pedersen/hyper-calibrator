import {
  Box,
  Container,
  Divider,
  Stack,
  Title,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { Section } from "./components/Section";
import { ColorSchemeSwitch } from "./components/ColorSchemeSwitch";
import { ConnectionSection } from "./sections/Connection";
import packageJson from "../package.json";
import { DisplaySection } from "./sections/Display";
import { CameraSection } from "./sections/Camera";
import { CalibrateSection } from "./sections/Calibrate";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "./components/GithubIcon";

function App() {
  return (
    <Container size={"sm"} my={"xl"}>
      <Stack>
        <Section>
          <Box pos={"relative"}>
            <Title ff={"monospace"} fw={"bold"}>
              Hyper Calibrator
            </Title>
            <Box
              w={"100%"}
              style={{ borderRadius: "8px" }}
              bg={
                "linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)"
              }
              h={"4"}
            />

            <ColorSchemeSwitch
              style={{
                position: "absolute",
                top: "0",
                right: "0",
              }}
            />
          </Box>

          <Text c={"dimmed"} mt={"xs"} lh={"xs"}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>

          <Group mt={"md"}>
            <Button
              rightSection={
                <GithubIcon color={"white"} variant={"light"} size={16} />
              }
              component={"a"}
              color={"black"}
              href={""}
            >
              Open Repo
            </Button>
            <Button
              rightSection={<ExternalLink size={16} />}
              component={"a"}
              variant={"subtle"}
              href={""}
            >
              Read Guide
            </Button>
          </Group>
        </Section>

        <ConnectionSection />

        <DisplaySection />

        <CameraSection />

        <CalibrateSection />

        <Divider my={"md"} />

        <Text ta={"center"} c={"dimmed"} size={"xs"}>
          Made with ❤️ by {packageJson.author} | v{packageJson.version}
        </Text>
      </Stack>
    </Container>
  );
}

export default App;
