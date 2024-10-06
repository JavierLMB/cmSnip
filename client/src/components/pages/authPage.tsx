import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Login from "../organisms/auth/login";
import Signup from "../organisms/auth/signup";
import ForgotPassword from "../organisms/auth/forgotPassword";
import ResetPassword from "../organisms/auth/resetPassword";

const AuthPage: React.FC = () => {
  const [active, setActive] = useState<string>("Login");

  return (
    <AuthContainer>
      <Routes>
        <Route
          path="account"
          element={
            <>
              <Login active={active} setActive={setActive} />
              <Signup active={active} setActive={setActive} />
            </>
          }
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </AuthContainer>
  );
};

export default AuthPage;

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary.main};
  background-repeat: no-repeat;
  background-size: cover;
`;
