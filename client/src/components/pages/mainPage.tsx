import React, { useState } from "react";
import styled from "styled-components";
import SideNav from "../templates/sideNav";
import ContentView from "../templates/contentView";

const MainPage: React.FC = () => {
  const [selectedNav, setSelectedNav] = useState<string>("Dashboard");
  return (
    <MainContainer>
      <SideNav selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
      <ContentView selectedNav={selectedNav} />
    </MainContainer>
  );
};

export default MainPage;

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary.main};
  background-repeat: no-repeat;
  background-size: cover;
  @media (width <= 800px) {
    padding: 10px 0px;
  }
`;
