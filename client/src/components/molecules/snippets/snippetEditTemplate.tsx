import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAsyncHandlerSnippet from "../../../utils/asyncHandlers/useAsyncHandlerSnippet";
import useAsyncHandlerTemplate from "../../../utils/asyncHandlers/useAsyncHandlerTemplate";
import { updateSnippet } from "../../../services/snippetService";
import { getAllTemplates } from "../../../services/templateService";
import processTemplate from "../../../utils/processTemplate";
import Button from "../../atoms/button";
import Dropdown from "../../atoms/dropdown";
import decodeHtml from "../../../utils/decodehtml";

const SnippetsEditTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const snippet = location.state?.snippet;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isFetchedRef = useRef(false);
  const isInitialFieldsRef = useRef(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [templateContent, setTemplateContent] = useState<string>(snippet.content);
  const [templateFields, setTemplateFields] = useState<any[]>(snippet.fields);
  const [updatedContent, setUpdatedContent] = useState<string>(snippet.content);

  const { asyncHandler: updateSnippetHandler } = useAsyncHandlerSnippet("updateSnippet");
  const { asyncHandler: getAllTemplatesHandler, data: getAllTemplatesData } =
    useAsyncHandlerTemplate("getAllTemplates");

  const [formData, setFormData] = useState({
    snippetName: snippet.name,
    snippetContent: snippet.content,
    snippetFields: snippet.fields,
    snippetTemplate: snippet.templateID,
    snippetActive: snippet.active,
  });

  // Handle form input change
  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle change in dynamic fields within the template
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
      snippetTemplate: templateID,
      snippetContent: newContent,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const snippetData = {
      name: formData.snippetName,
      content: formData.snippetContent,
      fields: formData.snippetFields,
      templateID: formData.snippetTemplate,
      active: formData.snippetActive,
    };
    const { success } = await updateSnippetHandler(() => updateSnippet(id!, snippetData));
    if (!success) return;
    navigate("/dashboard/snippets");
  };

  // Update iframe preview with new content
  useEffect(() => {
    if (!iframeRef.current) return;

    iframeRef.current.srcdoc = `<style>body { color: white; }</style>${decodeHtml(updatedContent)}`;
  }, [updatedContent]);

  useEffect(() => {
    const activeNav =
      location.pathname.split("/")[location.pathname.split("/").indexOf("snippets") + 2];

    if (activeNav === "template" && !isFetchedRef.current) {
      const fetchTemplates = async () => {
        isFetchedRef.current = true;
        await getAllTemplatesHandler(() => getAllTemplates());
      };

      fetchTemplates();
    }
  }, [location.pathname, getAllTemplatesHandler]);

  useEffect(() => {
    if (!getAllTemplatesData) return;
    if (isInitialFieldsRef.current) return;
    isInitialFieldsRef.current = true;
    const selectedTemplate = getAllTemplatesData.template.find(
      (template: any) => template._id === snippet.templateID
    );
    setSelectedOption(selectedTemplate.name);
    setTemplateContent(selectedTemplate.content);
    const { fields } = processTemplate(selectedTemplate.content);
    const initialFields = fields.map((field) => ({
      ...field,
      value: templateFields[field.label as any] || field.value,
    }));

    setTemplateFields(initialFields);
  }, [getAllTemplatesData, snippet.templateID, templateFields]);

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
          Update
        </Button>
      </FormContainer>

      <HtmlContentContainer>
        <h3>Preview</h3>
        <iframe ref={iframeRef} title="HTML Preview" />
      </HtmlContentContainer>
    </SnippetsContainer>
  );
};

export default SnippetsEditTemplate;

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
    border-radius: 4px;
    color: ${({ theme }) => theme.colors.basic.white};
    border: 1px solid ${({ theme }) => theme.colors.primary.main};
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
