import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* Base Reset */
  body {
    margin: 0;
    font-family: "Martian Mono", monospace !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100vh;
    width: 100vw;
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Reset for inputs, buttons, etc. */
  input,
  button,
  textarea,
  select {
    font: inherit;
    color: inherit;
    border: none;
    background: none;
    outline: none;
    text-align: inherit;
  }

  html {
    box-sizing: border-box;
    font-size: 62.5%; /* 1rem = 10px for easier rem calculations */
    line-height: 1;

    @media (width <= 800px) {
      font-size: 55%;
  }
  }

  /* Button Reset */
  button {
    text-align: inherit;
    background: none;
    cursor: pointer;
    border: none;
    color: inherit;
    font: inherit;
  }

  /* Anchor Reset */
  a {
    text-decoration: none;
    color: inherit;
    font: inherit;
  }

  a:hover {
    text-decoration: none;
  }

  /* Media Elements Reset */
  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  /* Ensure media elements scale properly */
  audio,
  video {
    width: 100%;
    height: auto;
  }

  /* Accessibility: Reset focus outline */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.accent1};
    outline-offset: 2px;
  }

  /* Placeholder text color */
  ::placeholder {
    color: ${({ theme }) => theme.colors.neutral.placeholder};
  }

  /* Prevent resizing for textareas */
  textarea {
    resize: none;
  }

  /* Remove default list styles */
  ul,
  ol {
    list-style: none;
  }

  /* Hide scrollbars globally */
  ::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
