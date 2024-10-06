const processTemplate = (templateContent: string) => {
  const formData: { [key: string]: string } = {};

  // Function to extract template fields from the content
  const generateTemplateFields = () => {
    const matches = [...templateContent.matchAll(/{{(.*?)}}/g)];

    matches.forEach((match) => {
      const label = match[1].trim();
      formData[label] = ""; // Initialize formData with empty values
    });

    return matches.map((match) => ({
      label: match[1].trim(),
      value: "",
      original: match[0],
    }));
  };

  // Function to update the template content with the new field values
  const updateTemplateContent = (updatedFields: { original: string; value: string }[]) => {
    let updatedContent = templateContent; // Keep the initial template content

    // Update each field by replacing the original placeholder with the new value
    updatedFields.forEach(({ original, value }) => {
      updatedContent = updatedContent.replace(new RegExp(original, "g"), value);
      const label = original.replace(/{{|}}/g, "").trim();
      formData[label] = value; // Update formData with the new value
    });

    return updatedContent;
  };

  const fields = generateTemplateFields();
  return { fields, updateTemplateContent, formData };
};

export default processTemplate;
