import React from "react";
import { useAtomValue } from "jotai";
import { statusMessageErrorAtom, statusMessageSuccessAtom } from "../../lib/useAtom";
import { Routes, Route } from "react-router-dom";
import RoleSpecificAccess from "../../utils/roleSpecificAccess";
import styled, { css } from "styled-components";
import StatusMessage from "../atoms/statusMessage";
import TemplatesList from "../molecules/templates/templateList";
import TemplatesNew from "../molecules/templates/templateNew";
import TemplatesEdit from "../molecules/templates/templateEdit";

const Templates = () => {
  const statusMessageError = useAtomValue(statusMessageErrorAtom);
  const statusMessageSuccess = useAtomValue(statusMessageSuccessAtom);

  return (
    <TemplatesContainer>
      <TemplatesHeader>
        <Title>Templates View</Title>
        {!statusMessageError && !statusMessageSuccess && (
          <StatusMessage status="default">Templates</StatusMessage>
        )}
        {statusMessageError && <StatusMessage status="error">{statusMessageError}</StatusMessage>}
        {statusMessageSuccess && (
          <StatusMessage status="success">{statusMessageSuccess}</StatusMessage>
        )}
      </TemplatesHeader>
      <Routes>
        <Route path="/templates" element={<TemplatesList />} />
        <Route
          path="/templates/new"
          element={
            <RoleSpecificAccess roles={["admin", "editor", "viewer"]}>
              <TemplatesNew />
            </RoleSpecificAccess>
          }
        />
        <Route
          path="/templates/:id"
          element={
            <RoleSpecificAccess roles={["admin", "editor", "viewer"]}>
              <TemplatesEdit />
            </RoleSpecificAccess>
          }
        />
      </Routes>
    </TemplatesContainer>
  );
};

export default Templates;

const TemplatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const TemplatesHeader = styled.div`
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
