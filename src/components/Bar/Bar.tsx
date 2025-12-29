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
import { useState } from "react";


const Bar: React.FC<BarProps> = ({
  numberOfPreviousMessagesAttached,
  setNumberOfPreviousMessagesAttached,
  currentLang,
}) => {
  const { setApiKey, isValidated, setIsValidated, validationError, setValidationError, selectedModel } = useApiKey();
  const [inputValue, setInputValue] = useState("");
  const [isValidating, setIsValidating] = useState(false);

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
    if (e.key === "Enter") {
      handleValidate();
    }
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
          <div className="flex flex-col items-center gap-2">
            {!isValidated ? (
              <div className="flex flex-col items-end gap-2 w-full">
                <div className="flex gap-2 w-full">
                  <Input
                    type="password"
                    placeholder="Enter Gemini API Key"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button
                    onClick={handleValidate}
                    disabled={isValidating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isValidating ? "Validating..." : "Validate"}
                  </Button>
                </div>
                {validationError && (
                  <p className="text-red-400 text-sm">{validationError}</p>
                )}
              </div>
            ) : (
              <div className="text-right">
                <p className="hidden sm:inline text-white/80 text-sm">
                  LLM: {selectedModel}
                </p>
              </div>
            )}
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
    </TooltipProvider>
  );
};

export default Bar;
