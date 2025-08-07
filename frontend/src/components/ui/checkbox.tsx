import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-primary text-primary-foreground",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      disabled={disabled}
      {...props}
    >
      {checked && <Check className="h-4 w-4" />}
    </button>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
