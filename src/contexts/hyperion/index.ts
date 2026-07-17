import { HyperionContext } from "./HyperionContext";
import { useContext } from "react";

export const useHyperion = () => {
  const context = useContext(HyperionContext);

  if (!context) {
    throw new Error("useHyperion must be used within a HyperionProvider");
  }
  return context;
};
