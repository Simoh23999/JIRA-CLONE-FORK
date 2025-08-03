import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100  disabled:text-neutral-300 border border-neutral-200 shadow-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-[#005BAC] to-[#3F3F3F] text-white hover:from-[#3F3F3F] hover:to-[#005BAC]",
        destructive:
          "bg-gradient-to-b from-[#F5B731] to-[#F2853F] text-white hover:from-[#F2853F] hover:to-[#E13B7F]",
        outline:
          "border border-[#005BAC] bg-white text-[#005BAC] hover:bg-[#5AC9F1]/20",
        secondary: "bg-[#5AC9F1] text-[#005BAC] hover:bg-[#5AC9F1]/80",
        ghost:
          "border-transparent shadow-none text-[#005BAC] hover:bg-[#5AC9F1]/20",
        suprimebt:
          "border-transparent shadow-none text-[#005BAC] hover:bg-[#5AC9F1]/20",
        muted: "bg-[#F5F5F5] text-[#3F3F3F] hover:bg-[#F5F5F5]/80",
        tertiary:
          "bg-[#E13B7F]/10 text-[#E13B7F] border border-transparent hover:bg-[#E13B7F]/20",
      },
      size: {
        default: "h-20 w-60 px-4 ts-12 py-2 text-lg",
        sm: "h-8 rounded-md px-3",
        xs: "h-7 rounded-md px-2 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-12 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
