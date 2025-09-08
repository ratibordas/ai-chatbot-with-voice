import { useRef, useEffect, useState } from "react";
import { Bot } from "lucide-react";
import type { ConversationProps } from "./Conversation.types";

import { Message } from "../Message/Message";
import { detectLanguage } from "@/utils/detectLanguage";


const Conversation: React.FC<ConversationProps> = ({ messages }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const synth = window.speechSynthesis;
  const lastBotMsg = messages.length > 0 && messages[messages.length - 1].sender === 'bot' ? messages[messages.length - 1] : undefined
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [currentSpeechText, setCurrentSpeechText] = useState<string | null>(
    null
  );
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(synth.getVoices());
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, [synth]);

  const speak = (text: string) => {
    if (currentSpeechText === text) {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        setIsPaused(true);
      } else if (synth.paused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.cancel();
        if (utteranceRef.current) {
          utteranceRef.current.text = text;
          synth.speak(utteranceRef.current);
          setIsPaused(false);
        }
      }
    } else {
      synth.cancel();
      setCurrentSpeechText(text);
      if (utteranceRef.current) {
        utteranceRef.current.text = text;
        synth.speak(utteranceRef.current);
        setIsPaused(false);
      }
    }
  };

  useEffect(() => {

    endRef.current?.scrollIntoView({ behavior: "smooth" });

    if (!utteranceRef.current && messages.length > 1) {
      utteranceRef.current = new SpeechSynthesisUtterance();
      const detectedLang = detectLanguage(lastBotMsg?.text ?? '');
      utteranceRef.current.lang = detectedLang;

      const availableVoices = voices.filter(voice => voice.lang === detectedLang);
      let selectedVoice = availableVoices.find(voice => voice.name.includes("Google Chrome"));

      if (!selectedVoice && availableVoices.length > 0) {
        selectedVoice = availableVoices[0];
      }

      if (selectedVoice) {
        utteranceRef.current.voice = selectedVoice;
      }

      utteranceRef.current.onend = () => {
        setCurrentSpeechText(null);
        setIsPaused(false);
      };
    }
  }, [messages, utteranceRef, voices, lastBotMsg?.text]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-white/60">
          <Bot className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
          <p>Ask a question or upload a file to begin chatting with AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scroll">
      {messages.map((msg) => (
        <Message
          synth={synth}
          key={msg.id}
          msg={msg}
          isPaused={isPaused}
          currentSpeechText={currentSpeechText}
          speak={speak}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default Conversation;

