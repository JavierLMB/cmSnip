import styled, { css } from "styled-components";

type StatusMessageProps = {
  children: React.ReactNode;
  status?: "error" | "success" | "default";
};

const StatusMessage: React.FC<StatusMessageProps> = ({ children, status = "default" }) => {
  return <StyledStatusMessage $status={status}>{children}</StyledStatusMessage>;
};

export default StatusMessage;

const StyledStatusMessage = styled.div<{ $status: "error" | "success" | "default" }>`
  font-weight: bold;
  line-height: 1.5;
  ${({ $status, theme }) => {
    const statusColors = {
      default: theme.colors.basic.white,
      error: theme.colors.states.error,
      success: theme.colors.states.success,
    };

    return css`
      color: ${statusColors[$status]};
    `;
  }}
`;
