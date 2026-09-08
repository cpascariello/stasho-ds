"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight, Copy } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";
import { fieldBox } from "../field/field";

const copyableTextVariants = cva("items-center font-mono select-none", {
  variants: {
    size: {
      sm: "text-xs gap-1",
      md: "text-sm gap-1.5",
    },
    fluid: {
      true: "flex w-full",
      false: "inline-flex",
    },
    variant: {
      inline: "",
      field: fieldBox,
    },
  },
  defaultVariants: {
    size: "md",
    fluid: false,
    variant: "inline",
  },
});

type Variant = "inline" | "field";

const iconSize: Record<"sm" | "md", string> = {
  sm: "size-3.5",
  md: "size-4",
};

const buttonSize: Record<"sm" | "md", string> = {
  sm: "size-4",
  md: "size-5",
};

const controlBase =
  "inline-flex items-center justify-center shrink-0 text-muted-foreground hover:bg-foreground/10 transition-colors";

/**
 * Inline: a borderless hit area sized by `size`. Field: a 22px square seated
 * at the box's right edge, on the surface fill with a hairline edge.
 */
function controlClasses(variant: Variant, size: "sm" | "md"): string {
  if (variant === "field") {
    return cn(
      controlBase,
      "size-5.5 rounded-sm border border-edge bg-surface hover:text-foreground",
    );
  }
  return cn(controlBase, "rounded-sm", buttonSize[size]);
}

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url) || url.startsWith("//");
}

function truncateMiddle(
  text: string,
  startChars: number,
  endChars: number,
): string {
  if (text.length <= startChars + endChars) return text;
  return `${text.slice(0, startChars)}...${text.slice(-endChars)}`;
}

function renderTextContent(
  text: string,
  fluid: boolean,
  startChars: number,
  endChars: number,
): ReactNode {
  if (!fluid) return truncateMiddle(text, startChars, endChars);
  if (text.length <= endChars) return text;
  return (
    <>
      <span className="min-w-0 flex-initial overflow-hidden text-ellipsis whitespace-nowrap">
        {text.slice(0, -endChars)}
      </span>
      <span className="flex-none whitespace-nowrap">
        {text.slice(-endChars)}
      </span>
    </>
  );
}

type CopyableTextProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  VariantProps<typeof copyableTextVariants> & {
    text: string;
    startChars?: number;
    endChars?: number;
    href?: string;
  };

const CopyableText = forwardRef<HTMLSpanElement, CopyableTextProps>(
  (
    {
      text,
      startChars = 6,
      endChars = 4,
      href,
      size = "md",
      fluid = false,
      variant = "inline",
      className,
      ...rest
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const handleCopy = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setCopied(false), 1500);
        });
      },
      [text],
    );

    const resolvedSize = size ?? "md";
    const resolvedVariant = variant ?? "inline";
    const iconCn = iconSize[resolvedSize];
    const controlCn = controlClasses(resolvedVariant, resolvedSize);
    const isFluid = resolvedVariant === "field" || (fluid ?? false);
    const content = renderTextContent(text, isFluid, startChars, endChars);
    const titleAttr = isFluid ? text : undefined;

    return (
      <span
        ref={ref}
        className={cn(
          copyableTextVariants({ size, fluid: isFluid, variant }),
          href && "text-accent-500 dark:text-accent",
          className,
        )}
        {...rest}
      >
        {href ? (
          <a
            href={href}
            title={titleAttr}
            {...(isExternalUrl(href)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "cursor-pointer hover:underline",
              isFluid && "flex min-w-0 flex-1 overflow-hidden",
            )}
          >
            {content}
          </a>
        ) : (
          <span
            title={titleAttr}
            className={cn("cursor-default", isFluid && "flex min-w-0 flex-1")}
          >
            {content}
          </span>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className={cn("relative cursor-pointer", controlCn)}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          <Copy
            weight="bold"
            className={cn(
              iconCn,
              "transition-opacity duration-100",
              "motion-reduce:transition-none",
              copied && "opacity-0",
            )}
            aria-hidden="true"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              iconCn,
              "absolute",
              "[stroke-dasharray:20] [stroke-dashoffset:20]",
              "transition-[stroke-dashoffset] duration-300 delay-75 ease-out",
              "motion-reduce:transition-none",
              copied && "[stroke-dashoffset:0]",
            )}
            aria-hidden="true"
          >
            <polyline points="4 12 9 17 20 6" />
          </svg>
        </button>

        {href && isExternalUrl(href) ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn("hover:text-foreground", controlCn)}
            aria-label="Open in new tab"
          >
            <ArrowUpRight weight="bold" className={iconCn} aria-hidden="true" />
          </a>
        ) : null}
      </span>
    );
  },
);

CopyableText.displayName = "CopyableText";

export { CopyableText, copyableTextVariants, type CopyableTextProps };
