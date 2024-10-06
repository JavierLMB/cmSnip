import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { statusMessageErrorAtom, statusMessageSuccessAtom } from "../../../lib/useAtom";
import { useParams } from "react-router-dom";
import { resetPassword } from "../../../services/authService";
import styled, { css } from "styled-components";
import useAsyncHandlerAuth from "../../../utils/asyncHandlers/useAsyncHandlerAuth";
import Button from "../../atoms/button";
import StatusMessage from "../../atoms/statusMessage";

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [countdown, setCountdown] = useState(3);
  const statusMessageError = useAtomValue(statusMessageErrorAtom);
  const statusMessageSuccess = useAtomValue(statusMessageSuccessAtom);

  const { asyncHandler: resetPasswordHandler } = useAsyncHandlerAuth("resetPassword");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success } = await resetPasswordHandler(() =>
      resetPassword(token, password, passwordConfirm)
    );
    if (!success) return;
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          window.location.href = "/auth/account";
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  return (
    <ResetPasswordContainer>
      <FormTitle>Reset Password</FormTitle>
      <StatusMessageWrapper>
        {!statusMessageError && !statusMessageSuccess && (
          <StatusMessage status="default">Please enter your new password.</StatusMessage>
        )}
        {statusMessageError && <StatusMessage status="error">{statusMessageError}</StatusMessage>}
        {statusMessageSuccess && (
          <StatusMessage status="success">
            {statusMessageSuccess} <br /> Redirecting to login page in {countdown} seconds...
          </StatusMessage>
        )}
      </StatusMessageWrapper>
      <ResetPasswordForm onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Input
          type="password"
          placeholder="Confirm New Password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          minLength={8}
        />
        <Button type="submit">Reset Password</Button>
      </ResetPasswordForm>
    </ResetPasswordContainer>
  );
};

export default ResetPassword;

const ResetPasswordContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 400px;
  width: 300px;
  margin: 0 auto;
  padding: 20px;
`;

const ResetPasswordForm = styled.form`
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
