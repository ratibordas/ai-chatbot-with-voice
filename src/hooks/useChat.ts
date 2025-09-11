import { useEffect, useRef, useState } from "react";
import { deleteAllGeminiFiles, SAVE_MAX_MESSAGES, sendGeminiMessage } from "../api/geminiService";
import type { BotMessage, Message } from "../types/types";
import { generateId } from "../utils/generateId";


export const useChat = (selectedModel: string) => {
 
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialLoad = useRef(true);
  const [files, setFiles] = useState<File[] | null>(null);
  const [
    numberOfPreviousMessagesAttached,
    setNumberOfPreviousMessagesAttached,
  ] = useState<number>(SAVE_MAX_MESSAGES);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatMessages-${selectedModel}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [selectedModel]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    localStorage.setItem(
      `chatMessages-${selectedModel}`,
      JSON.stringify(messages)
    );
  }, [messages, selectedModel]);

  const sendMessage = async (
    input: string,
    setInput: (string: string) => void,
    files?: File[],
    selectedModel?: string
  ) => {
    if ((!input.trim() && (!files || files.length === 0)) || isLoading) return;
    setIsLoading(true);
    setInput("");

    const userMsg: Message = {
      id: generateId(),
      sender: "user",
      text: files && files.length > 0 ? `files: ${files.map(f => f.name).join(", ")}; ${input}` : input,
      timestamp: Date.now(),
    };

    setMessages((msgs) => [...msgs, userMsg]);

    try {
        const botMsg = await sendGeminiMessage(
          messages,
          input,
          numberOfPreviousMessagesAttached,
          files || undefined
        );
      

      setMessages((msgs) => [...msgs, botMsg]);
      if (files && files.length > 0) {
        handleFileSelection(null);
      }
      localStorage.setItem(
        `totalTokenCount-${selectedModel}`,
        (
          (Number(localStorage.getItem(`totalTokenCount-${selectedModel}`)) ||
            0) + (botMsg! as BotMessage).totalTokenCount
        ).toString()
      );
    } catch (e) {
      const errorMsg: Message = {
        id: generateId(),
        sender: "bot",
        text: `Error: ${e instanceof Error ? e.message : String(e)}`,
        timestamp: Date.now(),
      };
      setMessages((msgs) => [...msgs, errorMsg]);
    }

    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    setFiles(null);
    localStorage.removeItem(`chatMessages-${selectedModel}`);
    deleteAllGeminiFiles();
    setNumberOfPreviousMessagesAttached(SAVE_MAX_MESSAGES);
  };

  const handleFileSelection = (selectedFiles: File[] | null) => {
    setFiles(selectedFiles);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    files,
    handleFileSelection,
    numberOfPreviousMessagesAttached,
    setNumberOfPreviousMessagesAttached,
  };
};
