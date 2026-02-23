import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorFallback } from "./ErrorFallback";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorFallback>
    <App />
  </ErrorFallback>
);
