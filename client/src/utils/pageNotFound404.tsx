import styled, { css } from "styled-components";

import { IoWarningOutline } from "react-icons/io5";

const PageNotFound404 = () => {
  return (
    <PageNotFoundMainWrapper>
      <PageNotFoundPageWrapper>
        <PageNotFoundMessageBox>
          <div>
            <PageNotFoundMessageTitle>
              <StyledWarningIcon /> <span>404 - PAGE NOT FOUND</span> <StyledWarningIcon />
            </PageNotFoundMessageTitle>
          </div>
          <div>We couldn't find the page you're looking for.</div>
          <div>Please check the URL or contact support if you believe this is a mistake.</div>
        </PageNotFoundMessageBox>
      </PageNotFoundPageWrapper>
    </PageNotFoundMainWrapper>
  );
};

export default PageNotFound404;

const PageNotFoundMainWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary.main};
`;

const PageNotFoundPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

const PageNotFoundMessageBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.primary.dark};
  color: ${({ theme }) => theme.colors.basic.white};
  padding: 20px;
  text-align: center;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fonts.smallFont};
  font-weight: 600;
`;
const PageNotFoundMessageTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.defaultFont};
  gap: 10px;
`;

const commonIconStyles = css`
  font-size: 2rem;
  display: inline-block;
`;

const StyledWarningIcon = styled(IoWarningOutline)`
  ${commonIconStyles}
  font-size: 3rem;
`;
