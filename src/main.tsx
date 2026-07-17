import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { HyperionProvider } from "./contexts/hyperion/HyperionProvider.tsx";
import { Notifications } from "@mantine/notifications";
import App from "./App.tsx";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import { VideoRegionsProvider } from "./contexts/video/VideoRegionsProvider.tsx";
import { DisplayPopup } from "./DisplayPopup.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <HyperionProvider>
        {location.href.endsWith(`${import.meta.env.BASE_URL}#/display`) ? (
          <DisplayPopup />
        ) : (
          <>
            <VideoRegionsProvider>
              <Notifications />
              <App />
            </VideoRegionsProvider>
          </>
        )}
      </HyperionProvider>
    </MantineProvider>
  </StrictMode>,
);
