import { Badge } from "@/components/ui/Badge/Badge";
import { Slider } from "@/components/ui/Slider/Slider";
import { Tooltip } from "@/components/ui/Tooltip/Tooltip";
import { TooltipProvider } from "@/components/ui/Tooltip/TooltipProvider";
import { TooltipContent } from "@/components/ui/Tooltip/TooltipContent";
import { TooltipTrigger} from "@/components/ui/Tooltip/TooltipTrigger";
import { useState, useEffect } from "react";
import type { ContextSliderProps } from "./ContextSlider.types";


const ContextSlider: React.FC<ContextSliderProps> = ({
  numberOfPreviousMessagesAttached,
  setNumberOfPreviousMessagesAttached,
}) => {
  const [sliderValue, setSliderValue] = useState(
    numberOfPreviousMessagesAttached
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setNumberOfPreviousMessagesAttached(sliderValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [setNumberOfPreviousMessagesAttached, sliderValue]);

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-white/80 text-sm font-medium">
            Context:
          </span>
          <Badge
            variant="secondary"
            className="bg-blue-500/20 text-blue-200 border-blue-500/30"
          >
            {sliderValue} messages
          </Badge>
        </div>
        <div className="w-full max-w-[200px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Slider
                  value={[sliderValue]}
                  onValueChange={(value) => setSliderValue(value[0])}
                  max={50}
                  min={0}
                  step={1}
                  className="w-8/10 sm:w-full"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adjust how many previous messages to include in context</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ContextSlider;
