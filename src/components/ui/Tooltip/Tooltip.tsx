import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import {TooltipProvider } from './TooltipProvider'


export const Tooltip: React.FC<React.ComponentProps<typeof TooltipPrimitive.Root>> = ({
  ...props
}) => {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}