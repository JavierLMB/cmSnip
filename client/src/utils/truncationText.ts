export const truncateText = (text: string, length: number = 15) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }

  return text;
};
