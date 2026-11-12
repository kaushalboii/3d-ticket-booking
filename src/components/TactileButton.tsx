import React from "react";
import { cn } from "@/helpers/classname-helper";
import { playTactileClick } from "@/helpers/audio-helper";

export type TactileButtonDepth = "shallow" | "deep";
export type TactileButtonSize = "xs" | "sm" | "md" | "lg";
export type TactileButtonVariant = "default" | "primary" | "secondary" | "subtle";

export interface TactileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  depth?: TactileButtonDepth;
  size?: TactileButtonSize;
  variant?: TactileButtonVariant;
  href?: string;
  children?: React.ReactNode;
}

export const TactileButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  TactileButtonProps
>(
  (
    {
      className,
      children,
      depth = "shallow",
      size = "sm",
      variant = "default",
      href,
      onClick,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      xs: "h-6 px-2 text-[11px] gap-1 rounded-md",
      sm: "h-7 px-2.5 text-xs gap-1.5 rounded-lg",
      md: "h-9 px-3.5 text-sm gap-2 rounded-xl",
      lg: "h-11 px-5 text-base gap-2.5 rounded-2xl",
    }[size];

    const depthClasses =
      depth === "deep"
        ? "border-b-[3px] active:border-b active:translate-y-[2px]"
        : "border-b-2 active:border-b active:translate-y-[1px]";

    const variantClasses = {
      default:
        "bg-[#1c1a17] hover:bg-[#25221e] text-[#efe9de] border-[#efe9de]/[0.12] border-b-[#0c0b0a] shadow-sm active:bg-[#141311]",
      primary:
        "bg-[#E5A93C] hover:brightness-105 text-[#0c0b0a] font-semibold border-[#d99827] border-b-[#9e6912] active:bg-[#d4972c]",
      secondary:
        "bg-[#25221e] hover:bg-[#2f2b26] text-[#efe9de] border-[#efe9de]/[0.14] border-b-[#141311]",
      subtle:
        "bg-transparent hover:bg-[#efe9de]/[0.05] text-[#9b9388] hover:text-[#efe9de] border-transparent border-b-transparent shadow-none",
    }[variant];

    const baseClass = cn(
      "relative inline-flex items-center justify-center font-medium select-none transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#E5A93C]/50 disabled:opacity-50 disabled:pointer-events-none",
      sizeClasses,
      depthClasses,
      variantClasses,
      className,
    );

    const handleClick = (e: React.MouseEvent<any>) => {
      playTactileClick();
      onClick?.(e);
    };

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseClass}
          onClick={handleClick}
          {...(props as any)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        className={baseClass}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);

TactileButton.displayName = "TactileButton";

