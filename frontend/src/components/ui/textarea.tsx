import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base
        "w-full min-h-[4rem] px-3 py-2 text-sm rounded-md border transition-colors outline-none shadow-sm resize-y",
        // Couleurs de fond et bordure
        "bg-[#f7fbfc] border-[#b9d7ea]",
        // Hover et focus
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

export { Textarea };
