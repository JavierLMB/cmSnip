const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PRODUCTION_URL
    : "http://localhost:5000/";

export const getAllUsers = async (page?: number, limit?: number): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }

  const data = await response.json();
  return data.data;
};

export const updateUserRole = async (userId: string, newRole: string): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ role: newRole }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }
};

export const getMe = async (): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }

  const data = await response.json();
  return data.data;
};

export const updateMe = async (newData: { name: string; email: string }): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/users/updateMe`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name: newData.name, email: newData.email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }
};
