import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/92 active:scale-[0.98]",
  secondary:
    "border-2 border-secondary/80 text-primary hover:border-secondary active:scale-[0.98]",
  ghost: "bg-transparent text-primary hover:text-primary/80",
  outline:
    "border-2 border-border bg-transparent text-primary hover:border-primary/40 active:scale-[0.98]",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-10 px-3 text-[13px]",
  md: "min-h-12 px-4 text-sm",
  lg: "min-h-14 px-5 text-[15px]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[14px] font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        sizeClass[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
