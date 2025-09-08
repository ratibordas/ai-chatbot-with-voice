import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/utils/classNames"

export const Avatar: React.FC<React.ComponentProps<typeof AvatarPrimitive.Root>> = ({
  className,
  ...props
} ) =>  {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}