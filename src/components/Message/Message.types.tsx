import type { Message } from "@/types/types";

export interface MessageProps {
  msg: Message;
  speak: (text: string) => void;
  synth: SpeechSynthesis;
  isPaused: boolean;
  currentSpeechText: string | null;
}