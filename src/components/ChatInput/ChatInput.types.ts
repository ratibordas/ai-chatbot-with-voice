export interface ChatInputProps {
  sendMessage: (
    input: string,
    setInput: (string: string) => void,
    files?: File[],
    selectedModel?: string
  ) => void;
  clearChat: () => void;
  selectedModel: string;
  isLoading?: boolean;
  files?: File[] | null;
  handleFileSelection: (files: File[] | null) => void;
}