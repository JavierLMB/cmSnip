import React from "react";
import styled, { css } from "styled-components";
import Users from "../organisms/users";
import Snippets from "../organisms/snippets";
import Templates from "../organisms/templates";
import Profile from "../organisms/profile";
import { useAtomValue } from "jotai";
import { globalLoadingAtom } from "../../lib/useAtom";
import Loader from "../../utils/loader";

type ContentViewProps = {
  selectedNav: string;
};

const ContentView: React.FC<ContentViewProps> = ({ selectedNav }) => {
  const globalLoading = useAtomValue(globalLoadingAtom);
  return (
    <ContentWrapper>
      {globalLoading && <Loader />}
      <ContentContainer $isSelected={selectedNav === "templates"}>
        <SingleView>
          <Templates />
        </SingleView>
      </ContentContainer>
      <ContentContainer $isSelected={selectedNav === "snippets"}>
        <SingleView>
          <Snippets />
        </SingleView>
      </ContentContainer>
      <ContentContainer $isSelected={selectedNav === "users"}>
        <SingleView>
          <Users />
        </SingleView>
      </ContentContainer>
      <ContentContainer $isSelected={selectedNav === "profile"}>
        <SingleView>
          <Profile />
        </SingleView>
      </ContentContainer>
    </ContentWrapper>
  );
};

export default ContentView;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  overflow: hidden;
`;

const ContentContainer = styled.div<{ $isSelected: boolean }>`
  height: 100%;
  width: 100%;
  padding: 0px 0px 0px 10px;
  position: absolute;
  transition: all 0.5s ease;

  ${({ $isSelected }) => css`
    transform: ${$isSelected ? "translate(0%, 0%) " : "translate(50%, 50%) "};
    opacity: ${$isSelected ? 1 : 0};
    pointer-events: ${$isSelected ? "auto" : "none"};
  `}
`;

const SingleView = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  border-radius: 10px;
`;
