import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./AppWrapper"; // ✅ this shows the name input page
import "./index.css"; // keep styles if you use Tailwind

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
