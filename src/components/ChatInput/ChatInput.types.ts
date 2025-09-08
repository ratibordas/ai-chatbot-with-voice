export interface ChatInputProps {
  sendMessage: (
    input: string,
    setInput: (string: string) => void,
    file?: File,
    selectedModel?: string
  ) => void;
  clearChat: () => void;
  selectedModel: string;
  isLoading?: boolean;
  file?: File | null;
  handleFileSelection: (file: File | null) => void;
}