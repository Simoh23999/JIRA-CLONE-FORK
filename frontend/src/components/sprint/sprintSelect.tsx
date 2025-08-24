import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => {
  const baseClasses =
    "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#769ACA] focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1";
  const combinedClassName = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <SelectPrimitive.Trigger ref={ref} className={combinedClassName} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  const baseClasses = "flex cursor-default items-center justify-center py-1";
  const combinedClassName = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={combinedClassName}
      {...props}
    >
      <ChevronUp className="h-4 w-4" />
    </SelectPrimitive.ScrollUpButton>
  );
});
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  const baseClasses = "flex cursor-default items-center justify-center py-1";
  const combinedClassName = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={combinedClassName}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </SelectPrimitive.ScrollDownButton>
  );
});
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    className?: string;
  }
>(({ className, children, position = "popper", ...props }, ref) => {
  const baseClasses =
    "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";
  const popperClasses =
    position === "popper"
      ? "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
      : "";
  const combinedClassName = className
    ? `${baseClasses} ${popperClasses} ${className}`
    : `${baseClasses} ${popperClasses}`;

  const viewportBaseClasses = "p-1";
  const viewportPopperClasses =
    position === "popper"
      ? "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
      : "";
  const viewportClassName = `${viewportBaseClasses} ${viewportPopperClasses}`;

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={combinedClassName}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className={viewportClassName}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  const baseClasses = "py-1.5 pl-8 pr-2 text-sm font-semibold text-gray-900";
  const combinedClassName = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <SelectPrimitive.Label ref={ref} className={combinedClassName} {...props} />
  );
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => {
  const baseClasses =
    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-[#B7D1E6] focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";
  const combinedClassName = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <SelectPrimitive.Item ref={ref} className={combinedClassName} {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  const baseClasses = "-mx-1 my-1 h-px bg-gray-200";
  const combinedClassName = className
    ? `${baseClasses} ${className}`
    : baseClasses;

  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={combinedClassName}
      {...props}
    />
  );
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
