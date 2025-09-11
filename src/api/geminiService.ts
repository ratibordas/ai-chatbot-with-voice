import { createPartFromUri, GoogleGenAI } from "@google/genai";
import type { BotMessage, Message } from "../types/types";
import { generateId } from "../utils/generateId";

export const AI_MAX_TOKENS = 100000;
export const AI_TEMPERATURE = 1.0;
export const AI_THINKING_BUDGET = 0; // off
export const AI_MODEL = "gemini-2.5-flash";
export const SAVE_MAX_MESSAGES = 10;

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const deleteAllGeminiFiles = async (): Promise<void> => {
  const filesPager = await ai.files.list();
  for await (const file of filesPager) {
    if (file.name) {
      await ai.files.delete({ name: file.name });
    }
  }
};

export const sendGeminiMessage = async (
  messages: Message[],
  input: string,
  numberOfPreviousMessagesAttached: number,
  files?: File[]
): Promise<BotMessage> => {
  let contents;
  const fileParts = [];

  const recentMessages =
    numberOfPreviousMessagesAttached > 0 && messages && messages.length > 0
      ? messages.slice(-numberOfPreviousMessagesAttached)
      : [];

  if (files && files.length > 0) {
    for (const file of files) {
      const sanitizedFileName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const filePart = await ai.files.upload({
        file: file,
        config: {
          mimeType: file.type,
          displayName: file.name,
          name: sanitizedFileName,
        },
      });
      fileParts.push(createPartFromUri(filePart.uri!, filePart.mimeType!));
    }

    const contextParts = recentMessages.map((msg) => ({
      role: msg.sender === "bot" ? "model" : msg.sender,
      parts: [{ text: msg.text }],
    }));

    const filePartContent = {
      role: "user",
      parts: fileParts,
    };

    const inputPartContent = {
      role: "user",
      parts: [{ text: input }],
    };

    contents = [...contextParts, filePartContent, inputPartContent];
  } else {
    const fullMessages = [...recentMessages, { text: input, sender: "user" }];

    contents = fullMessages.map((msg) => ({
      role: msg.sender === "bot" ? "model" : msg.sender,
      parts: [{ text: msg.text }],
    }));
  }
  const result = await ai.models.generateContent({
    model: AI_MODEL,
    contents,
    config: {
      thinkingConfig: { thinkingBudget: AI_THINKING_BUDGET ?? 10000 },
      temperature: AI_TEMPERATURE ?? 1.0,
      maxOutputTokens: AI_MAX_TOKENS ?? 100000,
    },
  });

  const text =
    result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  const usage = result.usageMetadata || {};

  return {
    id: generateId(),
    sender: "bot",
    text,
    timestamp: Date.now(),
    promptTokenCount: usage.promptTokenCount ?? 0,
    candidatesTokenCount: usage.candidatesTokenCount ?? 0,
    totalTokenCount: usage.totalTokenCount ?? 0,
  };
};
