import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { statusMessageErrorAtom, statusMessageSuccessAtom } from "../../../lib/useAtom";
import styled, { css } from "styled-components";
import { login } from "../../../services/authService";
import useAsyncHandlerAuth from "../../../utils/asyncHandlers/useAsyncHandlerAuth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../../atoms/button";
import StatusMessage from "../../atoms/statusMessage";
import { useSetAtom } from "jotai";
import { currentThemeAtom } from "../../../lib/useAtom";
import { toCamelCase } from "../../../utils/camelCase";

type LoginProps = {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
};

const Login: React.FC<LoginProps> = ({ active, setActive }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const statusMessageError = useAtomValue(statusMessageErrorAtom);
  const statusMessageSuccess = useAtomValue(statusMessageSuccessAtom);
  const setCurrentThemeAtom = useSetAtom(currentThemeAtom);

  const { asyncHandler: loginHandler } = useAsyncHandlerAuth("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success } = await loginHandler(() => login(email, password));
    if (!success) return;
    navigate("/dashboard/snippets");
  };

  const handleSignUpClick = () => {
    setActive("Signup");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) return;
    setCurrentThemeAtom(toCamelCase(savedTheme));
  }, [setCurrentThemeAtom]);

  return (
    <LoginForm $active={active} onSubmit={handleSubmit}>
      <FormTitle>Login</FormTitle>
      <StatusMessageWrapper>
        {!statusMessageError && !statusMessageSuccess && (
          <StatusMessage status="default">Please fill in the form to log in.</StatusMessage>
        )}
        {statusMessageError && <StatusMessage status="error">{statusMessageError}</StatusMessage>}
        {statusMessageSuccess && (
          <StatusMessage status="success">{statusMessageSuccess}</StatusMessage>
        )}
      </StatusMessageWrapper>
      <Label htmlFor="emailLogin">Email</Label>
      <Input
        type="email"
        id="emailLogin"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your email"
      />
      <Label htmlFor="passwordLogin">Password</Label>
      <Input
        type="password"
        id="passwordLogin"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Enter your password"
      />
      <Button type="submit">Login</Button>
      <ForgotPasswordPrompt>
        <Link to="/auth/forgot-password">Forgot Password?</Link>
      </ForgotPasswordPrompt>
      <SignupPrompt>
        Don't have an account? <SignupText onClick={handleSignUpClick}>Sign Up</SignupText>
      </SignupPrompt>
    </LoginForm>
  );
};

export default Login;

const LoginForm = styled.form<{ $active: string }>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 500px;
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  position: absolute;

  transition: all 0.5s cubic-bezier(0.43, -0.53, 0.83, 0.67);

  ${({ $active, theme }) => css`
    z-index: ${$active === "Login" ? 2 : 1};
    transform: ${$active === "Login" ? "translateX(0)" : "translateX(-200%)"};
    width: ${$active === "Login" ? "300px" : "0px"};
    opacity: ${$active === "Login" ? "1" : "0"};
  `}
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  ${({ theme }) => css`
    color: ${theme.colors.basic.white};
    font-size: ${theme.fonts.header2Font};
  `}
`;

const StatusMessageWrapper = styled.div`
  margin-bottom: 15px;
  text-align: center;
`;

const Label = styled.label`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.basic.white};
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  ${({ theme }) => css`
    color: ${({ theme }) => theme.colors.basic.white};
    font-size: ${theme.fonts.defaultFont};
  `}

  &:focus {
    border-radius: 4px;

    &:not(:placeholder-shown):valid {
      outline: 2px solid ${({ theme }) => theme.colors.states.success};
    }

    &:not(:placeholder-shown):focus:invalid {
      outline: 2px solid ${({ theme }) => theme.colors.states.warning};
    }
  }

  &:-webkit-autofill {
    color: ${({ theme }) => theme.colors.basic.white} !important;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.basic.white} !important;
    box-shadow: 0 0 0px 1000px ${({ theme }) => theme.colors.primary.main} inset !important;
  }

  &:-moz-autofill {
    color: ${({ theme }) => theme.colors.basic.white} !important;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.basic.white} !important;
    box-shadow: 0 0 0px 1000px ${({ theme }) => theme.colors.primary.main} inset !important;
  }

  &:-internal-autofill-selected {
    color: ${({ theme }) => theme.colors.basic.white} !important;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.basic.white} !important;
    box-shadow: 0 0 0px 1000px ${({ theme }) => theme.colors.primary.main} inset !important;
  }
`;

const ForgotPasswordPrompt = styled.div`
  display: inline-block;
  margin-top: 15px;
  color: ${({ theme }) => theme.colors.basic.white};
  cursor: pointer;
  max-width: 120px;

  &:hover {
    text-decoration: underline;
  }
`;

const SignupPrompt = styled.div`
  margin-top: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.basic.white};
`;

const SignupText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.accent.accent1};

  &:hover {
    text-decoration: none;
  }
`;
