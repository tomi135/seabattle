import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./mobile-landscape.css";
import "./mobile-portrait.css";
import Seabattle from "./components/Seabattle";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Seabattle />
  </React.StrictMode>
);
