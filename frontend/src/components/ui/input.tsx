import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "w-full h-10 px-3 py-2 text-sm rounded-md border transition-colors outline-none shadow-sm",
        // Couleurs de fond et bordure
        "bg-[#f7fbfc] border-[#b9d7ea]",
        // Hover et focus (sans noir)
        "hover:bg-[#d6e6f2] hover:border-[#769fcd]",
        "focus:border-[#769fcd] focus:ring-2 focus:ring-[#769fcd] focus:ring-offset-0",
        // Disabled
        "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
        // Placeholder
        "placeholder:text-gray-500",
        className
      )}
      {...props}
    />
  );
}

export { Input };
