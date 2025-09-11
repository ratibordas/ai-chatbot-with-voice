import { Button } from "@/components/ui/Button/Button";
import { Input as UIInput } from "@/components/ui/Input/Input";
import { Tooltip } from "@/components/ui/Tooltip/Tooltip";
import { TooltipProvider } from "@/components/ui/Tooltip/TooltipProvider";
import { TooltipContent } from "@/components/ui/Tooltip/TooltipContent";
import { TooltipTrigger} from "@/components/ui/Tooltip/TooltipTrigger";
import { Send, Paperclip, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { useState, memo } from "react";
import type { ChatInputProps } from "./ChatInput.types";


const ChatInput: React.FC<ChatInputProps> = memo(({
  sendMessage,
  selectedModel,
  clearChat,
  isLoading,
  files,
  handleFileSelection,
}) => {
  const [input, setInput] = useState<string>("");
   
  const handleSend = () => {
    sendMessage(input, setInput, files || undefined, selectedModel);
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {files && files.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-primary/20 border border-primary/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-white" />
              <span className="text-primary-foreground text-sm font-medium">
                {files.map((file) => file.name).join(", ")}
              </span>
              <Badge
                variant="secondary"
                className="bg-primary/20 text-primary-foreground border-primary/30 text-xs"
              >
                {(files.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(1)} KB
              </Badge>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleFileSelection(null)}
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:text-primary-foreground hover:bg-primary/20 h-6 w-6 p-0"
                >
                  <X className="w-4 h-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove attached files</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <div className="flex items-center gap-2 p-2 bg-background/5 backdrop-blur-sm rounded-xl border border-border/10">
          <UIInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) handleSend();
            }}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white"
            disabled={isLoading}
          />

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <label>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const selectedFiles = e.target.files ? Array.from(e.target.files) : null;
                      handleFileSelection(selectedFiles );
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-foreground/70 hover:text-foreground/20 bg-foreground/10"
                    disabled={isLoading}
                    asChild
                  >
                    <span className="cursor-pointer">
                      <Paperclip className="w-4 h-4 text-white" />
                    </span>
                  </Button>
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Attach files
                    <span className="block text-xs text-muted-foreground mt-1">
                      Supports: JSONL, JPEG, PNG, GIF, WebP, PDFs and etc
                    </span>
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSend}
                  size="sm"
                  disabled={isLoading || (!input.trim() && (!files || files.length === 0))}
                  className="bg-blue-400/20 hover:bg-blue-800 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={clearChat}
                  size="sm"
                  variant="destructive"
                  disabled={isLoading}
                  className="bg-destructive/20 hover:bg-destructive/30 border border-destructive/30"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear entire chat</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

export default ChatInput;
