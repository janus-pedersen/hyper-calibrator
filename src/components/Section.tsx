import { Paper, Stack, Title, Text, Group, ThemeIcon } from "@mantine/core";
import type { LucideIcon } from "lucide-react";

export function Section({
  children,
  title,
  subtitle,
  icon,
}: React.PropsWithChildren<{
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
}>) {
  const Icon = icon;

  return (
    <section>
      <Paper
        withBorder
        shadow="md"
        p="md"
        radius="lg"
        bg={
          "linear-gradient(135deg, var(--mantine-color-body), var(--mantine-color-text) 3000%)"
        }
      >
        {(title || subtitle || icon) && (
          <Group align={"flex-start"} mb={"md"} gap={"md"}>
            {Icon && (
              <ThemeIcon
                autoContrast
                size={"xl"}
                radius={"xl"}
                variant={"light"}
              >
                <Icon />
              </ThemeIcon>
            )}
            <Stack gap={0}>
              {title && <Title order={3}>{title}</Title>}
              {subtitle && <Text c="dimmed">{subtitle}</Text>}
            </Stack>
          </Group>
        )}

        {children}
      </Paper>
    </section>
  );
}
