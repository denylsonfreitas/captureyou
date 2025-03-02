import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { Routes, Route } from "react-router-dom";
import { lightTheme, darkTheme } from "./styles/theme";
import { GlobalStyles } from "./styles/globalStyles";
import HomePage from "./pages/Home";
import CameraPage from "./pages/CameraPage";
import ResultPage from "./pages/ResultPage";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Analytics />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
          }
        />
        <Route
          path="/camera"
          element={
            <CameraPage toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
          }
        />
        <Route
          path="/result"
          element={
            <ResultPage toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
