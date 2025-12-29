import { createPartFromUri, GoogleGenAI } from "@google/genai";
import type { BotMessage, Message } from "../types/types";
import { generateId } from "../utils/generateId";

export const AI_MAX_TOKENS = 100000;
export const AI_TEMPERATURE = 1.0;
export const AI_THINKING_BUDGET = 0;
export const SAVE_MAX_MESSAGES = 10;

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    await ai.models.list();
    return true;
  } catch {
    return false;
  }
};

export const deleteAllGeminiFiles = async (apiKey: string): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey });
  const filesPager = await ai.files.list();
  for await (const file of filesPager) {
    if (file.name) {
      await ai.files.delete({ name: file.name });
    }
  }
};

export const sendGeminiMessage = async (
  apiKey: string,
  model: string,
  messages: Message[],
  input: string,
  numberOfPreviousMessagesAttached: number,
  files?: File[]
): Promise<BotMessage> => {
  const ai = new GoogleGenAI({ apiKey });
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
          name: sanitizedFileName.substring(0, 40),
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
    model,
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
