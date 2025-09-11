import type { MessageProps } from "./Message.types";
import type { BotMessage } from "../../types/types";
import ReactMarkdown from "react-markdown";
import TokenInfo from "../TokenInfo/TokenInfo";
import { Card } from "@/components/ui/Card/Card";
import { User, Bot, Volume2, VolumeX } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar/Avatar";
import { AvatarFallback } from "@/components/ui/Avatar/AvatarFallback";
import { isChromeOrEdge, isTablet, isSpeechSynthesisSupported } from "../../utils/browserUtils";

export const Message: React.FC<MessageProps> = ({
  msg,
  speak,
  synth,
  isPaused,
  currentSpeechText,
}) => {
  const shouldShowVoiceOver = isChromeOrEdge() && !isTablet() && isSpeechSynthesisSupported();

  const renderIcon = () => {
    if (currentSpeechText === msg.text && synth.paused && isPaused) {
      return <VolumeX onClick={() => speak(msg.text)} className="w-4 h-4" />;
    }

    return <Volume2 onClick={() => speak(msg.text)} className="w-4 h-4" />;
  };

  return (
    <div
      key={msg.id}
      className={`flex gap-3 ${
        msg.sender === "user" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar
        className={`w-8 h-8 ${
          msg.sender === "user" ? "bg-purple-600" : "bg-blue-600"
        }`}
      >
        <AvatarFallback className="text-white bg-transparent">
          {msg.sender === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex-1 max-w-[80%] ${
          msg.sender === "user" ? "text-right" : "text-left"
        }`}
      >
        <Card
          className={`p-4 ${
            msg.sender === "user"
              ? "bg-purple-600/20 border-purple-500/30 ml-auto"
              : "bg-blue-600/20 border-blue-500/30"
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className="font-medium">
                {msg.sender === "user" ? "You" : "AI Assistant"}
              </span>
              <span>•</span>
              <span>
                {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                  hour12: false,
                })}
              </span>
              {msg.sender === "bot" && shouldShowVoiceOver && (
                <span className="cursor-pointer text-white/60 hover:text-white">
                  {renderIcon()}
                </span>
              )}
            </div>

            <div className="text-white/90">
              {msg.sender === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}
            </div>

            {msg.sender === "bot" &&
              (msg as BotMessage).totalTokenCount !== undefined && (
                <TokenInfo {...(msg as BotMessage)} />
              )}
          </div>
        </Card>
      </div>
    </div>
  );
};
