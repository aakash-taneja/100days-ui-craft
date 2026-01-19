import { StrictMode } from "react";
import { App } from "./App";
import { createRoot } from "react-dom/client";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

createRoot(elem).render(app);