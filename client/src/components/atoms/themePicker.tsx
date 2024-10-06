import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Dropdown from "./dropdown";
import { useSetAtom } from "jotai";
import { currentThemeAtom } from "../../lib/useAtom";
import { toCamelCase } from "../../utils/camelCase";

const ThemePicker: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState("Dark Theme");
  const setCurrentThemeAtom = useSetAtom(currentThemeAtom);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) return;
    setCurrentTheme(savedTheme);
    setCurrentThemeAtom(toCamelCase(savedTheme));
  }, [setCurrentThemeAtom]);

  const handleOptionSelect = (option: string) => {
    setCurrentTheme(option);
    setCurrentThemeAtom(toCamelCase(option));
    localStorage.setItem("theme", option);
  };

  return (
    <ThemePickerContainer>
      <Dropdown
        options={[
          "Dark Theme",
          "Light Theme",
          "Ocean Blue Theme",
          "Retro Neon Theme",
          "Classic Vintage Theme",
        ]}
        selectedOption={currentTheme}
        onOptionSelect={(option) => handleOptionSelect(option)}
        style={{ width: "200px" }}
      />
    </ThemePickerContainer>
  );
};

export default ThemePicker;

const ThemePickerContainer = styled.div`
  display: flex;
`;
