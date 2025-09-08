import * as TooltipPrimitive from "@radix-ui/react-tooltip"


export const TooltipProvider: React.FC<React.ComponentProps<typeof TooltipPrimitive.Provider>> =({
  delayDuration = 0,
  ...props
}) => {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}