import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { statusMessageErrorAtom, statusMessageSuccessAtom } from "../../../lib/useAtom";
import styled, { css } from "styled-components";
import useAsyncHandlerAuth from "../../../utils/asyncHandlers/useAsyncHandlerAuth";
import { forgotPassword } from "../../../services/authService";
import { Link } from "react-router-dom";
import Button from "../../atoms/button";
import StatusMessage from "../../atoms/statusMessage";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const statusMessageError = useAtomValue(statusMessageErrorAtom);
  const statusMessageSuccess = useAtomValue(statusMessageSuccessAtom);

  const { asyncHandler: forgotPasswordHandler } = useAsyncHandlerAuth("forgotPassword");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await forgotPasswordHandler(() => forgotPassword(email));
  };

  return (
    <ForgotPasswordContainer>
      <FormTitle>Forgot Password</FormTitle>
      <StatusMessageWrapper>
        {!statusMessageError && !statusMessageSuccess && (
          <StatusMessage status="default">
            Please enter your email to receive a reset link.
          </StatusMessage>
        )}
        {statusMessageError && <StatusMessage status="error">{statusMessageError}</StatusMessage>}
        {statusMessageSuccess && (
          <StatusMessage status="success">{statusMessageSuccess}</StatusMessage>
        )}
      </StatusMessageWrapper>
      <ForgotPasswordForm onSubmit={handleForgotPassword}>
        <Label htmlFor="emailForgot">Email</Label>
        <Input
          type="email"
          id="emailForgot"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <LoginPrompt>
          <Link to="/auth/account">Back to login</Link>
        </LoginPrompt>
        <Button type="submit">Send Reset Link</Button>
      </ForgotPasswordForm>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;

const ForgotPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 400px;
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 5px;
  backdrop-filter: blur(10px);

  ${({ theme }) => css`
    background-color: ${theme.colors.primary.main};
  `}
`;

const ForgotPasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
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

const LoginPrompt = styled.div`
  display: inline-block;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.colors.basic.white};
  cursor: pointer;
  max-width: 100px;

  &:hover {
    text-decoration: underline;
  }
`;
