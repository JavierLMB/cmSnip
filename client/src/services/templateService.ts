const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PRODUCTION_URL
    : "http://localhost:5000/";

export const createTemplate = async (template: {
  templateName: string;
  templateContent: string;
  templateActive: boolean;
}): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/templates/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: template.templateName,
      content: template.templateContent,
      active: template.templateActive,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }
};

export const updateTemplate = async (
  templateId: string,
  template: {
    content: string;
    name: string;
    active: boolean;
  }
): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/templates/${templateId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      content: template.content,
      name: template.name,
      active: template.active,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }
};

export const deleteTemplate = async (templateId: string): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/templates/${templateId}`, {
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

export const getAllTemplates = async (page?: number, limit?: number): Promise<any> => {
  const response = await fetch(`${API_URL}api/v1/templates?page=${page}&limit=${limit}`, {
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
