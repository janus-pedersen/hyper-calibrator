import { useEffect, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";

const styles = await import("@mantine/core/styles.css");
console.log(styles.default);

interface PopupPortalProps {
  window: Window;
  children: ReactNode;
}

export function PopupPortal({
  window: popupWindow,
  children,
}: PopupPortalProps) {
  const container = useMemo(
    () => popupWindow.document.createElement("div"),
    [popupWindow],
  );

  useEffect(() => {
    popupWindow.document.body.appendChild(container);

    const styles = window.document.querySelectorAll(
      'link[rel="stylesheet"], style',
    );

    for (const style of styles) {
      popupWindow.document.head.appendChild(style.cloneNode(true));
    }

    return () => {
      container.remove();
    };
  }, [container, popupWindow]);

  return createPortal(children, container);
}
