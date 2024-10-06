import React from "react";
import ReactDOM from "react-dom/client";
import { inject } from "@vercel/analytics";
import { GlobalStyle } from "./styles";
import App from "./App";
import { ThemeProvider } from "styled-components";
import {
  lightTheme,
  darkTheme,
  oceanBlueTheme,
  retroNeonTheme,
  classicVintageTheme,
} from "./theme";
import { useAtomValue } from "jotai";
import { currentThemeAtom } from "../src/lib/useAtom";
import { BrowserRouter } from "react-router-dom";

inject();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const themes = {
  lightTheme,
  darkTheme,
  oceanBlueTheme,
  retroNeonTheme,
  classicVintageTheme,
};

type ThemeKeys = keyof typeof themes;

const RootComponent = () => {
  const currentTheme = useAtomValue(currentThemeAtom) as ThemeKeys;

  return (
    <ThemeProvider theme={themes[currentTheme]}>
      <GlobalStyle />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
