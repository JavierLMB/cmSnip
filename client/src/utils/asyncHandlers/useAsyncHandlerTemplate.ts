import { useState, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import {
  statusMessageErrorAtom,
  statusMessageSuccessAtom,
  globalLoadingAtom,
} from "../../lib/useAtom";

const useAsyncHandlerTemplate = (
  operation?: "createTemplate" | "getAllTemplates" | "updateTemplate" | "deleteTemplate"
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
  if (operation === "getAllTemplates") return;
  return setStatusMessageSuccess("Operation successful!");
};

const handleAsyncError = (
  err: any,
  setStatusMessageError: (error: string) => void,
  operation?: string
) => {
  console.log(err);
  if (err.error?.isOperational) return setStatusMessageError(err.message);

  return setStatusMessageError("An error occurred. Please try again.");
};

export default useAsyncHandlerTemplate;
