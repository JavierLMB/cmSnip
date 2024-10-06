const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PRODUCTION_URL
    : "http://localhost:5000/";

export const createSnippet = async (snippet: {
  snippetName: string;
  snippetContent: string;
  snippetFields?: { [key: string]: string };
  snippetTemplateID?: string;
  snippetActive: boolean;
}): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/snippets/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: snippet.snippetName,
      content: snippet.snippetContent,
      fields: snippet.snippetFields,
      templateID: snippet.snippetTemplateID,
      active: snippet.snippetActive,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }
};

export const updateSnippet = async (
  snippetId: string,
  snippet: {
    name: string;
    content: string;
    fields?: { [key: string]: string };
    templateID?: string;
    active: boolean;
  }
): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/snippets/${snippetId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: snippet.name,
      content: snippet.content,
      fields: snippet.fields,
      templateID: snippet.templateID,
      active: snippet.active,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }
};

export const deleteSnippet = async (snippetId: string): Promise<void> => {
  const response = await fetch(`${API_URL}api/v1/snippets/${snippetId}`, {
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

export const getAllSnippets = async (page?: number, limit?: number): Promise<any> => {
  const response = await fetch(`${API_URL}api/v1/snippets?page=${page}&limit=${limit}`, {
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
