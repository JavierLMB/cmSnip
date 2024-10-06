import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const ProjectLogo: React.FC = () => {
  return (
    <LogoContainer>
      <Link to="/dashboard/snippets">
        <LogoInner>cmSnip</LogoInner>
      </Link>
    </LogoContainer>
  );
};

export default ProjectLogo;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  padding: 15px 0px 15px 15px;
  font-size: 5rem;
  @media (width <= 1500px) {
    font-size: 2.5rem;
  }
`;

const LogoInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  color: transparent;
  background: linear-gradient(
    120deg,
    ${({ theme }) => theme.colors.accent.accent2} 0%,
    ${({ theme }) => theme.colors.accent.accent1} 50%,
    ${({ theme }) => theme.colors.accent.accent2} 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: fillText 3s ease-in-out infinite;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.2);
    transition: transform 1s cubic-bezier(1, -1, 0.01, 1.55);
    animation: fillText 1s ease-in-out infinite;

    &::before {
      transform: scale(1.1);
      transition: all 2s ease;
    }
  }

  &:active {
    transform: scale(0.9);
    transition: transform 0.3s ease;
  }

  &::before {
    content: "cmSnip";
    position: absolute;
    top: 0;
    left: 0;
    color: ${({ theme }) => theme.colors.basic.white};
    overflow: hidden;
    opacity: 1;
    transform: scale(1.05);
  }

  @keyframes fillText {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;
