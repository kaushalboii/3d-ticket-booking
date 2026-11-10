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
        "bg-[#1c1c1f] hover:bg-[#25252a] text-[#ededed] border-[#323238] border-b-[#121214] shadow-sm active:bg-[#18181a]",
      primary:
        "bg-[#55E6A5] hover:brightness-105 text-[#050505] font-semibold border-[#45c98e] border-b-[#2e8a60] shadow-[0_4px_12px_rgba(85,230,165,0.25)] active:bg-[#4dd496]",
      secondary:
        "bg-[#28282d] hover:bg-[#323238] text-white border-[#3f3f46] border-b-[#1f1f23]",
      subtle:
        "bg-transparent hover:bg-white/5 text-[#a1a1aa] hover:text-white border-transparent border-b-transparent shadow-none",
    }[variant];

    const baseClass = cn(
      "relative inline-flex items-center justify-center font-medium select-none transition-all duration-75 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#55E6A5]/50 disabled:opacity-50 disabled:pointer-events-none",
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

