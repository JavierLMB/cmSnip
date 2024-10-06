const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PRODUCTION_URL
    : "http://localhost:5000/";

export const signup = async (
  email: string,
  password: string,
  passwordConfirm: string
): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, passwordConfirm }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
};

export const login = async (email: string, password: string): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users/forgotPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.log("Error:", errorData);
    throw errorData;
  }
};

export const resetPassword = async (
  token: any,
  password: string,
  passwordConfirm: string
): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users/resetPassword/${token}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, passwordConfirm }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
};

export const verifyToken = async (): Promise<any> => {
  const response = await fetch(`${API_URL}api/v1/users/verifyToken`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    console.log("Error: Response", response);
    const errorData = await response.json();
    console.log("Error: Data", errorData);
    throw errorData;
  }

  const data = await response.json();
  return data.user;
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
};
