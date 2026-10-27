import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RotaAppContainer } from "./routes/index";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Static preview root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <RotaAppContainer />
  </StrictMode>,
);
