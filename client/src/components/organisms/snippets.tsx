import React from "react";
import { useAtomValue } from "jotai";
import { statusMessageErrorAtom, statusMessageSuccessAtom } from "../../lib/useAtom";
import { Routes, Route } from "react-router-dom";
import RoleSpecificAccess from "../../utils/roleSpecificAccess";
import styled, { css } from "styled-components";
import StatusMessage from "../atoms/statusMessage";
import SnippetsList from "../molecules/snippets/snippetList";
import SnippetsNew from "../molecules/snippets/snippetNew";
import SnippetsNewTemplate from "../molecules/snippets/snippetNewTemplate";
import SnippetsEdit from "../molecules/snippets/snippetEdit";
import SnippetsEditTemplate from "../molecules/snippets/snippetEditTemplate";

const Snippets = () => {
  const statusMessageError = useAtomValue(statusMessageErrorAtom);
  const statusMessageSuccess = useAtomValue(statusMessageSuccessAtom);

  return (
    <SnippetsContainer>
      <SnippetsHeader>
        <Title>Snippets Views</Title>
        {!statusMessageError && !statusMessageSuccess && (
          <StatusMessage status="default">Snippets</StatusMessage>
        )}
        {statusMessageError && <StatusMessage status="error">{statusMessageError}</StatusMessage>}
        {statusMessageSuccess && (
          <StatusMessage status="success">{statusMessageSuccess}</StatusMessage>
        )}
      </SnippetsHeader>
      <Routes>
        <Route path="/snippets" element={<SnippetsList />} />
        <Route
          path="/snippets/new"
          element={
            <RoleSpecificAccess roles={["admin", "editor", "viewer"]}>
              <SnippetsNew />
            </RoleSpecificAccess>
          }
        />
        <Route
          path="/snippets/new-template"
          element={
            <RoleSpecificAccess roles={["admin", "editor", "viewer"]}>
              <SnippetsNewTemplate />
            </RoleSpecificAccess>
          }
        />
        <Route
          path="/snippets/:id"
          element={
            <RoleSpecificAccess roles={["admin", "editor", "viewer"]}>
              <SnippetsEdit />
            </RoleSpecificAccess>
          }
        />
        <Route
          path="/snippets/:id/template"
          element={
            <RoleSpecificAccess roles={["admin", "editor", "viewer"]}>
              <SnippetsEditTemplate />
            </RoleSpecificAccess>
          }
        />
      </Routes>
    </SnippetsContainer>
  );
};

export default Snippets;

const SnippetsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
`;

const SnippetsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  @media (width <= 650px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const Title = styled.h1`
  ${({ theme }) => css`
    color: ${theme.colors.basic.white};
    font-size: ${theme.fonts.header2Font};
  `}
`;
