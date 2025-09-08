import * as TooltipPrimitive from "@radix-ui/react-tooltip"


export const TooltipTrigger:React.FC<React.ComponentProps<typeof TooltipPrimitive.Trigger>> =({
  ...props
}) => {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}