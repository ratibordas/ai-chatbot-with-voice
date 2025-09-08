import { cn } from "@/utils/classNames";

export const CardContent: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  return (
    <div
    data-slot="card-content"
    className={cn("px-6", className)}
    {...props}
  />
  );
}