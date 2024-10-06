import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { statusMessageErrorAtom, statusMessageSuccessAtom } from "../../../lib/useAtom";
import styled, { css } from "styled-components";
import { signup } from "../../../services/authService";
import useAsyncHandlerAuth from "../../../utils/asyncHandlers/useAsyncHandlerAuth";
import { useNavigate } from "react-router-dom";
import Button from "../../atoms/button";
import StatusMessage from "../../atoms/statusMessage";

interface SignupProps {
  active: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}

const Signup: React.FC<SignupProps> = ({ active, setActive }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const navigate = useNavigate();
  const statusMessageError = useAtomValue(statusMessageErrorAtom);
  const statusMessageSuccess = useAtomValue(statusMessageSuccessAtom);

  const { asyncHandler: signupHandler } = useAsyncHandlerAuth("signup");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success } = await signupHandler(() => signup(email, password, passwordConfirm));
    if (!success) return;
    navigate("/dashboard/snippets");
  };

  const handleLoginClick = () => {
    setActive("Login");
  };

  return (
    <SignupForm $active={active} onSubmit={handleSubmit}>
      <FormTitle>Sign Up</FormTitle>
      <StatusMessageWrapper>
        {!statusMessageError && !statusMessageSuccess && (
          <StatusMessage status="default">Please fill in the form to sign up.</StatusMessage>
        )}
        {statusMessageError && <StatusMessage status="error">{statusMessageError}</StatusMessage>}
        {statusMessageSuccess && (
          <StatusMessage status="success">{statusMessageSuccess}</StatusMessage>
        )}
      </StatusMessageWrapper>
      <Label htmlFor="emailSignup">Email</Label>
      <Input
        type="email"
        id="emailSignup"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter your email"
      />
      <Label htmlFor="passwordSignup">Password</Label>
      <Input
        type="password"
        id="passwordSignup"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        placeholder="Enter your password"
      />
      <Label htmlFor="passwordConfirmSignup">Confirm Password</Label>
      <Input
        type="password"
        id="passwordConfirmSignup"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        required
        minLength={8}
        placeholder="Re-enter your password"
      />
      <Button type="submit">Sign Up</Button>
      <LoginPrompt>
        Already have an account? <LoginText onClick={handleLoginClick}>Login</LoginText>
      </LoginPrompt>
    </SignupForm>
  );
};

export default Signup;

const SignupForm = styled.form<{ $active: string }>`
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
    z-index: ${$active === "Signup" ? 2 : 1};
    transform: ${$active === "Signup" ? "translateX(0)" : "translateX(-200%)"};
    width: ${$active === "Login" ? "0px" : "300px"};
    opacity: ${$active === "Login" ? "0" : "1"};
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
    box-shadow: 0 0 0px 100px ${({ theme }) => theme.colors.primary.main} inset !important;
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

const LoginPrompt = styled.div`
  margin-top: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.basic.white};
`;

const LoginText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.accent.accent1};

  &:hover {
    text-decoration: none;
  }
`;
