import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/globalStyles";
import { darkTheme } from "./styles/theme";
import App from "./App";
import Home from "./pages/Home";
import CameraPage from "./pages/CameraPage";
import ResultPage from "./pages/ResultPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={darkTheme}>
    <GlobalStyles />
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  </ThemeProvider>
);
