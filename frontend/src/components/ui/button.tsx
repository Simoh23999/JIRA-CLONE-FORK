import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
 "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100  disabled:text-neutral-300 border border-neutral-200 shadow-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
  variant: {
    primary:
      "bg-[#24527a] text-white hover:bg-[#2e6aa3]",

    destructive:
       "bg-[#FAA18F] text-[#FFF]  hover:bg-[#FF0000] ",
      //  "border border-[#FAA18F] bg-white text-[#24527a] hover:bg-[#F54927] hever: text-[#FFF]",

    outline:
      "border border-[#24527a] bg-white text-[#24527a] hover:bg-[#d6e6f2]",

    secondary:
      "bg-[#d6e6f2] text-[#2a2e35] hover:bg-[#b9d7ea]",

    ghost:
      "bg-transparent text-[#24527a] hover:bg-[#d6e6f2]",

    muted:
      "bg-[#f7fbfc] text-[#2a2e35] hover:bg-[#d6e6f2]",

    tertiary:
      "bg-[#b9d7ea] text-[#2a2e35] hover:bg-[#24527a] hover:text-white",

    backbutton:
      "inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors" 
       
        // Uncomment and customize these variants if needed
        // These are examples and can be modified or removed as per your design requirements

      // primary:
      //   "bg-gradient-to-b from-[#005BAC] to-[#3F3F3F] text-white hover:from-[#3F3F3F] hover:to-[#005BAC]",
      // destructive:
      //   "bg-gradient-to-b from-[#F5B731] to-[#F2853F] text-white hover:from-[#F2853F] hover:to-[#E13B7F]",
      // outline:
      //   "border border-[#005BAC] bg-white text-[#005BAC] hover:bg-[#5AC9F1]/20",
      // secondary:
      //   "bg-[#5AC9F1] text-[#005BAC] hover:bg-[#5AC9F1]/80",
      // ghost:
      //   "border-transparent shadow-none text-[#005BAC] hover:bg-[#5AC9F1]/20",
      // muted:
      //   "bg-[#F5F5F5] text-[#3F3F3F] hover:bg-[#F5F5F5]/80",
      // tertiary:
      //   "bg-[#E13B7F]/10 text-[#E13B7F] border border-transparent hover:bg-[#E13B7F]/20",

      },
      size: {
        default: "h-10 w-20 px-4 ts-12 py-2 text-lg",
				sm: "h-8 rounded-md px-3",
				xs: "h-7 rounded-md px-2 text-xs",
				lg: "h-12 rounded-md px-8",
				icon: "h-12 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
