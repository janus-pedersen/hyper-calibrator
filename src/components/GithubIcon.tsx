/// <reference types="vite-plugin-svgr/client" />
import { ThemeIcon, type ThemeIconProps } from "@mantine/core";
import GithubSvg from "../assets/github.svg?react";

export function GithubIcon(props: ThemeIconProps) {
  return (
    <ThemeIcon {...props}>
      <GithubSvg fill={"currentColor"} viewBox="0 0 24 24" />
    </ThemeIcon>
  );
}
