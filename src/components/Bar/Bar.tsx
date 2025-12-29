import { Badge } from "@/components/ui/Badge/Badge";
import {
  TooltipProvider,
} from "@/components/ui/Tooltip/TooltipProvider";
import ContextSlider from "../ContextSlider/ContextSlider";
import type { BarProps } from "./Bar.types";
import { validateApiKey } from "@/api/geminiService";
import { useApiKey } from "@/hooks/useApiKey";
import { Input } from "@/components/ui/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog/Dialog";
import { useState } from "react";
import { Key } from "lucide-react";


const Bar: React.FC<BarProps> = ({
  numberOfPreviousMessagesAttached,
  setNumberOfPreviousMessagesAttached,
  currentLang,
}) => {
  const { setApiKey, isValidated, setIsValidated, validationError, setValidationError, selectedModel } = useApiKey();
  const [inputValue, setInputValue] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleValidate = async () => {
    if (!inputValue.trim()) {
      setValidationError("Please enter an API key");
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const isValid = await validateApiKey(inputValue.trim());
      if (isValid) {
        setApiKey(inputValue.trim());
        setIsValidated(true);
        setInputValue("");
        setIsDialogOpen(false);
      } else {
        setValidationError("Invalid API key. Please check and try again.");
        setIsValidated(false);
      }
    } catch {
      setValidationError("Failed to validate API key. Please try again.");
      setIsValidated(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isValidating) {
      handleValidate();
    }
  };

  const handleOpenDialog = () => {
    setValidationError(null);
    setInputValue("");
    setIsDialogOpen(true);
  };
  
  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <ContextSlider
            numberOfPreviousMessagesAttached={numberOfPreviousMessagesAttached}
            setNumberOfPreviousMessagesAttached={
              setNumberOfPreviousMessagesAttached
            }
          />
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              {isValidated ? (
                <p className="hidden sm:inline text-white/80 text-sm">
                  LLM: {selectedModel}
                </p>
              ) : (
                <Button
                  onClick={handleOpenDialog}
                  size="sm"
                  className="border shadow-sm overflow-hidden bg-purple-600/20 border-purple-500/30 hover:bg-purple-700/20"
                  >
                  
                  <Key className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Enter API Key</span>
                  <span className="sm:hidden">Key</span>
                </Button>
              )}
            </div>
            <div className="text-right">
              <p className="hidden sm:inline text-white/80 text-sm">
                Voice over language{" "}
              </p>
              <Badge
                variant="outline"
                className="bg-green-500/20 text-green-200 border-green-500/30"
              >
                {currentLang}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Gemini API Key</DialogTitle>
            <DialogDescription>
              Please enter your Gemini API key to start using the chat. Your key will be validated before use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Gemini API Key"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50"
                autoFocus
              />
              {validationError && (
                <p className="text-red-400 text-sm">{validationError}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isValidating}
                className="w-full sm:w-auto text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleValidate}
                disabled={isValidating || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                {isValidating ? "Validating..." : "Validate"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default Bar;
