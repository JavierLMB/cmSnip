import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import useAsyncHandlerSnippet from "../../../utils/asyncHandlers/useAsyncHandlerSnippet";
import useAsyncHandlerTemplate from "../../../utils/asyncHandlers/useAsyncHandlerTemplate";
import { createSnippet } from "../../../services/snippetService";
import { getAllTemplates } from "../../../services/templateService";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../atoms/button";
import Dropdown from "../../atoms/dropdown";
import processTemplate from "../../../utils/processTemplate";
import decodeHtml from "../../../utils/decodehtml";

const SnippetsNewTemplate = () => {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isFetchedRef = useRef(false);
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [templateContent, setTemplateContent] = useState<string>("");
  const [templateFields, setTemplateFields] = useState<any[]>([]);
  const [updatedContent, setUpdatedContent] = useState<string>("");

  const { asyncHandler: createSnippetHandler } = useAsyncHandlerSnippet("createSnippet");
  const { asyncHandler: getAllTemplatesHandler, data: getAllTemplatesData } =
    useAsyncHandlerTemplate("getAllTemplates");

  const [formData, setFormData] = useState({
    snippetName: "",
    snippetContent: "",
    snippetFields: {},
    snippetTemplate: "",
    snippetActive: true,
  });

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...templateFields];
    updatedFields[index].value = value;
    setTemplateFields(updatedFields);
    const { updateTemplateContent } = processTemplate(templateContent);
    const newContent = updateTemplateContent(updatedFields);
    setUpdatedContent(newContent);

    setFormData((prevData) => ({
      ...prevData,
      snippetFields: {
        ...prevData.snippetFields,
        [updatedFields[index].label]: value,
      },
      snippetContent: newContent,
    }));
  };

  const handleTemplateSelect = (templateName: string, templateID?: string) => {
    if (!templateID) return;
    setSelectedOption(templateName);

    const selectedTemplate = getAllTemplatesData.template.find(
      (template: { _id: string }) => template._id === templateID
    );

    setTemplateContent(selectedTemplate.content);
    const {
      fields,
      updateTemplateContent,
      formData: initialFieldData,
    } = processTemplate(selectedTemplate.content);
    setTemplateFields(fields);

    const newContent = updateTemplateContent(fields);
    setUpdatedContent(newContent);

    setFormData((prevData) => ({
      ...prevData,
      snippetFields: {
        ...initialFieldData,
      },
      snippetTemplateID: templateID,
      snippetContent: newContent,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { success } = await createSnippetHandler(() => createSnippet(formData));
    if (!success) return;
    navigate("/dashboard/snippets");
  };

  useEffect(() => {
    if (!iframeRef.current) return;

    iframeRef.current.srcdoc = `<style>body { color: white; }</style>${decodeHtml(updatedContent)}`;
  }, [updatedContent]);

  useEffect(() => {
    const activeNav =
      location.pathname.split("/")[location.pathname.split("/").indexOf("snippets") + 1];

    if (activeNav === "new-template" && !isFetchedRef.current) {
      const fetchTemplates = async () => {
        isFetchedRef.current = true;
        await getAllTemplatesHandler(() => getAllTemplates());
      };
      fetchTemplates();
    } else if (activeNav !== "new-template") {
      isFetchedRef.current = false;
    }
  }, [location.pathname, getAllTemplatesHandler]);

  return (
    <SnippetsContainer>
      <FormContainer onSubmit={handleSubmit} autoComplete="off">
        <FormGroup>
          <label htmlFor="snippetName">Name</label>
          <input
            type="text"
            id="snippetName"
            value={formData.snippetName}
            onChange={handleChange}
            required
            placeholder="Snippet Name"
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="snippetTemplate">Template</label>

          <Dropdown
            options={
              getAllTemplatesData?.template.length > 0
                ? getAllTemplatesData.template.map((template: { _id: string; name: string }) => ({
                    id: template._id,
                    name: template.name,
                  }))
                : [{ id: false, name: "No Templates" }]
            }
            selectedOption={selectedOption}
            placeholder="Select Template"
            onOptionSelect={(templateName, templateID) =>
              handleTemplateSelect(templateName, templateID)
            }
            idRequired={true}
          />
        </FormGroup>

        {templateFields.length > 0 &&
          templateFields.map((field, index) => (
            <FormGroup key={index}>
              <label htmlFor={`field-${index}`}>{field.label}</label>
              <input
                type="text"
                id={`field-${index}`}
                value={field.value}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                placeholder={`Enter ${field.label}`}
              />
            </FormGroup>
          ))}

        <FormGroup>
          <label>Active</label>
          <Dropdown
            options={["True", "False"]}
            selectedOption={formData.snippetActive ? "True" : "False"}
            onOptionSelect={(option) =>
              handleChange({
                target: { id: "snippetActive", value: option === "True" },
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
    </SnippetsContainer>
  );
};

export default SnippetsNewTemplate;

const SnippetsContainer = styled.div`
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

  input {
    padding: 10px;
    color: ${({ theme }) => theme.colors.basic.white};
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
