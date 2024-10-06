import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/pages/authPage";
import ProtectedRoute from "./utils/protectedRoute";
import MainPage from "./components/pages/mainPage";
import PageNotFound404 from "../src/utils/pageNotFound404";

function App() {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthPage />} />

      <Route path="/" element={<Navigate to="/dashboard/snippets" />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<PageNotFound404 />} />
    </Routes>
  );
}

export default App;
