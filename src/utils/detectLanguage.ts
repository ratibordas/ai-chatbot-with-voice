export const detectLanguage = (text: string): string => {
  const russianRegex = /[\u0400-\u04FF]/;
  if (russianRegex.test(text)) {
    return "ru-RU";
  }
  return "en-US";
};