export const toCamelCase = (str: string): string => {
  return str.replace(/\s+/g, "").replace(/^./, (match) => match.toLowerCase());
};
