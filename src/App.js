import React from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/globalStyles";
import { darkTheme } from "./styles/theme";
import Home from "./pages/Home";

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
      <Home />
    </ThemeProvider>
  );
}

export default App;
