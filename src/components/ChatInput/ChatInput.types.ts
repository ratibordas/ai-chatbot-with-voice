export interface ChatInputProps {
  sendMessage: (
    input: string,
    setInput: (string: string) => void,
    files?: File[]
  ) => void;
  clearChat: () => void;
  isLoading?: boolean;
  files?: File[] | null;
  handleFileSelection: (files: File[] | null) => void;
}