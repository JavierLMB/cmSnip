import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectLogo from "../atoms/projectLogo";

type SideNavProps = {
  selectedNav: string;
  setSelectedNav: React.Dispatch<React.SetStateAction<string>>;
};

const SideNav: React.FC<SideNavProps> = ({ selectedNav, setSelectedNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleNavClick = (Nav: string) => {
    navigate(`${Nav.toLowerCase()}`);
  };

  const handleNavButton = () => {
    setIsMobileNavOpen((prev) => !prev);
  };

  useEffect(() => {
    const navItem =
      location.pathname.split("/")[location.pathname.split("/").indexOf("dashboard") + 1];
    if (navItem) setSelectedNav(navItem);
  }, [location.pathname, setSelectedNav]);

  return (
    <>
      <MobileNavButton onClick={() => handleNavButton()} />
      <MobileNavBackground onClick={() => handleNavButton()} $isMobileNavOpen={isMobileNavOpen} />
      <SideNavWrapper $isMobileNavOpen={isMobileNavOpen}>
        <ProjectLogo />
        <SideNavContainer>
          <NavItem
            $isSelected={selectedNav === "snippets"}
            onClick={() => handleNavClick("snippets")}
          >
            Snippets
          </NavItem>
          <NavItem
            $isSelected={selectedNav === "templates"}
            onClick={() => handleNavClick("templates")}
          >
            Templates
          </NavItem>
          <NavItem $isSelected={selectedNav === "users"} onClick={() => handleNavClick("users")}>
            Users
          </NavItem>
          <NavItem
            $isSelected={selectedNav === "profile"}
            onClick={() => handleNavClick("profile")}
          >
            Profile
          </NavItem>
        </SideNavContainer>
      </SideNavWrapper>
    </>
  );
};

export default SideNav;

const SideNavWrapper = styled.div<{ $isMobileNavOpen: boolean }>`
  width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-right: auto;
  transition: all 0.5s ease;

  @media (width <= 1500px) {
    width: 150px;
  }
  @media (width <= 1000px) {
    position: absolute;
    width: 300px;
    padding-right: 15px;
    z-index: 10;
    left: 0;
    top: 0;

    ${({ theme, $isMobileNavOpen }) => css`
      background-color: ${theme.colors.primary.main};
      transform: ${$isMobileNavOpen ? "translateX(0%)" : "translateX(-200%)"};
    `}
  }
`;

const MobileNavButton = styled.div`
  display: none;
  @media (width <= 1000px) {
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 35px;
    height: 35px;
    border-radius: 0% 0% 100% 0%;
    cursor: pointer;
    z-index: 11;
    transition: all 0.5s ease;
    background: linear-gradient(
      165deg,
      ${({ theme }) => theme.colors.accent.accent1},
      ${({ theme }) => theme.colors.accent.accent2}
    );
    &:active {
      border-radius: 0% 0% 0% 0%;
      transition: all 0.5s ease;
    }
  }
`;

const MobileNavBackground = styled.div<{ $isMobileNavOpen: boolean }>`
  display: none;
  @media (width <= 1000px) {
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100vh;
    z-index: 9;
    transition: all 0.5s ease;
    background: rgba(0, 0, 0, 0.5);
    ${({ $isMobileNavOpen }) => css`
      opacity: ${$isMobileNavOpen ? "1" : "0"};
      pointer-events: ${$isMobileNavOpen ? "all" : "none"};
    `}
  }
`;

const SideNavContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 0px 0px 15px;
`;

const hoverStyles = css`
  ${({ theme }) => css`
    color: ${theme.colors.basic.white};
    background-image: linear-gradient(
      165deg,
      ${theme.colors.accent.accent1},
      ${theme.colors.accent.accent2}
    );
    background-size: 200% 200%;
  `}
`;

const NavItem = styled.div<{ $isSelected: boolean }>`
  padding: 10px 20px 10px 10px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
  ${({ theme, $isSelected }) => css`
    color: ${theme.colors.basic.white};
    background-image: ${$isSelected
      ? `linear-gradient(165deg, ${theme.colors.accent.accent1}, ${theme.colors.accent.accent2})`
      : "transparent"};
    background-size: ${$isSelected ? "200% 200%" : "auto"};
    font-size: ${theme.fonts.defaultFont};
  `}

  ${({ $isSelected }) => $isSelected && hoverStyles}

  &:hover {
    ${hoverStyles}
  }

  &:active {
    transition: all 0s;

    ${({ theme }) => css`
      background-image: linear-gradient(
        165deg,
        ${theme.colors.accent.accent1},
        ${theme.colors.accent.accent2}
      );
      background-size: 150% 150%;
    `}
  }

  &:last-child {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 36px;
      left: 0;
      width: 100%;
      height: 10px;
      border-bottom: 10px solid ${({ theme }) => theme.colors.primary.main};
    }
  }

  @media (width <= 1000px) {
    margin-bottom: 10px;
  }
`;
