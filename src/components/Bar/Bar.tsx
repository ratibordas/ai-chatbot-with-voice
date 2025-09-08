import { Badge } from "@/components/ui/Badge/Badge";
import {
  TooltipProvider,
} from "@/components/ui/Tooltip/TooltipProvider";
import ContextSlider from "../ContextSlider/ContextSlider";
import type { BarProps } from "./Bar.types";
import { AI_MODEL } from "@/api/geminiService";


const Bar: React.FC<BarProps> = ({
  numberOfPreviousMessagesAttached,
  setNumberOfPreviousMessagesAttached,
  currentLang,
}) => {
  
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
          <div className="flex flex-col items-center ">
          <div className="text-right">
              <p className="hidden sm:inline text-white/80 text-sm">
                LLM: {AI_MODEL}
              </p>
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
    </TooltipProvider>
  );
};

export default Bar;
