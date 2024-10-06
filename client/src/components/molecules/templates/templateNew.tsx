import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import useAsyncHandlerTemplate from "../../../utils/asyncHandlers/useAsyncHandlerTemplate";
import { createTemplate } from "../../../services/templateService";
import Button from "../../atoms/button";
import Dropdown from "../../atoms/dropdown";

const TemplatesNew = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { asyncHandler: createTemplateHandler } = useAsyncHandlerTemplate("createTemplate");

  const [formData, setFormData] = useState({
    templateName: "",
    templateContent: "",
    templateActive: true,
  });

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success } = await createTemplateHandler(() => createTemplate(formData));
    if (!success) return;
    navigate("/dashboard/templates");
  };

  useEffect(() => {
    if (!iframeRef.current) return;
    const defaultStyle = `
    <style>
      body {
        color: white;
      }
    </style>
  `;

    iframeRef.current.srcdoc = `${defaultStyle}${formData.templateContent}`;
  }, [formData.templateContent]);

  return (
    <TemplatesContainer>
      <FormContainer onSubmit={handleSubmit} autoComplete="off">
        <FormGroup>
          <label htmlFor="templateName">Name</label>
          <input
            type="text"
            id="templateName"
            value={formData.templateName}
            onChange={handleChange}
            required
            placeholder="Template Name"
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="templateContent">Content</label>
          <textarea
            id="templateContent"
            value={formData.templateContent}
            onChange={handleChange}
            required
            placeholder="Enter template content here..."
            rows={10}
          />
        </FormGroup>

        <FormGroup>
          <label>Active</label>
          <Dropdown
            options={["True", "False"]}
            selectedOption={formData.templateActive ? "True" : "False"}
            onOptionSelect={(option) =>
              handleChange({
                target: { id: "templateActive", value: option === "True" },
              })
            }
          />
        </FormGroup>

        <Button type="submit" style={{ height: "36px", width: "150px", alignSelf: "flex-end" }}>
          Create
        </Button>
      </FormContainer>

      <HtmlContentContainer>
        <h3>Preview</h3>
        <iframe ref={iframeRef} title="HTML Preview" />
      </HtmlContentContainer>
    </TemplatesContainer>
  );
};

export default TemplatesNew;

const TemplatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin-top: 10px;
  overflow-y: auto;
  color: ${({ theme }) => theme.colors.basic.white};
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 20px;
  color: ${({ theme }) => theme.colors.basic.white};

  h2 {
    margin-bottom: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  label {
    font-weight: bold;
    font-size: ${({ theme }) => theme.fonts.defaultFont};
  }

  input,
  textarea,
  select {
    padding: 10px;
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.basic.white};
  }

  input {
    border-radius: 0px;
    &:focus {
      border-radius: 4px;
      border-color: ${({ theme }) => theme.colors.accent.accent1};
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
  }

  select {
    cursor: pointer;
  }
`;

const HtmlContentContainer = styled.div`
  margin-top: 10px;
  padding: 10px;
  flex-grow: 1;
  min-height: 1000px;
  border-radius: 4px;

  ${({ theme }) => css`
    border: 1px dashed ${theme.colors.accent.accent1};
    color: ${theme.colors.accent.accent1};
  `}

  h3 {
    margin-bottom: 10px;
    text-transform: uppercase;
    display: inline-block;
    border-bottom: 1px dashed ${({ theme }) => theme.colors.accent.accent1};
  }

  iframe {
    width: 100%;
    height: 97%;
    border: none;
  }
`;
