import styled, { css } from "styled-components";

type ButtonProps = {
  children: React.ReactNode;
  type: "submit" | "button" | "reset";
  style?: React.CSSProperties;
  dashed?: boolean;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ children, type, style, onClick, dashed = false }) => {
  return (
    <StyledButton type={type} style={style} onClick={onClick} $dashed={dashed}>
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<{ $dashed?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 28px;
  cursor: pointer;
  text-align: center;
  text-transform: uppercase;
  transition: background 0.3s ease;
  background-size: 200% 200%;
  border: none;
  ${({ theme, $dashed }) => css`
    font-size: ${theme.fonts.defaultFont};
    color: ${theme.colors.basic.white};
    background-image: linear-gradient(
      165deg,
      ${theme.colors.accent.accent1},
      ${theme.colors.accent.accent2}
    );
    border-left: ${$dashed ? `1px dashed ${theme.colors.accent.accent1SemiTransparent}` : "none"};
  `}

  &:hover {
    background-size: 100% 100%;
  }

  &:active {
    background-size: 150% 150%;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.accent1};
  }
`;
