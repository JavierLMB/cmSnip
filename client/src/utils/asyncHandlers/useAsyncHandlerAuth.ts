import { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  statusMessageErrorAtom,
  statusMessageSuccessAtom,
  globalLoadingAtom,
} from "../../lib/useAtom";

const useAsyncHandlerAuth = (
  operation?: "login" | "signup" | "forgotPassword" | "resetPassword" | "logout" | "verifyToken"
) => {
  const [data, setData] = useState<any>(null);
  const [statusMessageError, setStatusMessageError] = useAtom(statusMessageErrorAtom);
  const [statusMessageSuccess, setStatusMessageSuccess] = useAtom(statusMessageSuccessAtom);
  const setGlobalLoading = useSetAtom(globalLoadingAtom);

  useEffect(() => {
    if (statusMessageError || statusMessageSuccess) {
      const timer = setTimeout(() => {
        setStatusMessageError("");
        setStatusMessageSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [statusMessageError, statusMessageSuccess, setStatusMessageError, setStatusMessageSuccess]);

  useEffect(() => {
    if (setGlobalLoading) {
      const timer = setTimeout(() => {
        setGlobalLoading(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [setGlobalLoading]);

  const asyncHandler = async (asyncFunction: () => Promise<any>) => {
    setStatusMessageError("");
    setStatusMessageSuccess("");
    setData(null);
    setGlobalLoading(false);

    try {
      setGlobalLoading(true);
      const result = await asyncFunction();
      setData(result);
      handleAsyncSuccess(setStatusMessageSuccess, operation);
      return { success: true, data: result };
    } catch (err: any) {
      handleAsyncError(err, setStatusMessageError, operation);
      return { success: false };
    } finally {
      setGlobalLoading(false);
    }
  };

  return { asyncHandler, data };
};

const handleAsyncSuccess = (
  setStatusMessageSuccess: (success: string) => void,
  operation?: string
) => {
  if (operation === "logout") return;
  if (operation === "login") return setStatusMessageSuccess("Login successful!");
  if (operation === "signup") return setStatusMessageSuccess("Sign up successful!");
  if (operation === "forgotPassword")
    return setStatusMessageSuccess("A reset link has been sent to your email.");
  if (operation === "resetPassword") return setStatusMessageSuccess("Password reset successful!");
  return setStatusMessageSuccess("Operation successful!");
};

const handleAsyncError = (
  err: any,
  setStatusMessageError: (error: string) => void,
  operation?: string
) => {
  if (err.error?.isOperational) return setStatusMessageError(err.message);

  if (operation === "resetPassword" && err.error?.name === "ValidationError")
    return setStatusMessageError("Passwords do not match.");

  if (operation === "signup" && err.error?.name === "ValidationError")
    return setStatusMessageError("Please provide a valid email.");
  if (operation === "signup" && err.error?.code === 11000)
    return setStatusMessageError("Email already exists");
  console.log(err);
  return setStatusMessageError("An error occurred. Please try again.");
};

export default useAsyncHandlerAuth;
