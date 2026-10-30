"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../button/button";

/** How long a transient copy label sits before reverting to idle. */
const COPY_FEEDBACK_MS = 2000;

type CopyState = "idle" | "copied" | "failed";

const COPY_LABEL: Record<CopyState, string> = {
  idle: "Copy prompt for your agent",
  copied: "Copied",
  failed: "Copy failed",
};

/**
 * One copy affordance's transient state: `idle`, then `copied` or `failed`
 * for two seconds, then `idle` again. Each call owns its own state, so two
 * affordances on one surface never light each other up.
 *
 * `copy` never throws: `navigator.clipboard` is absent in insecure contexts
 * and `writeText` rejects on a denied permission, and neither is worth an
 * error boundary.
 */
function useCopyFeedback(): { state: CopyState; copy: (text: string) => void } {
  const [state, setState] = useState<CopyState>("idle");
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (revertTimer.current) clearTimeout(revertTimer.current);
    },
    [],
  );

  const copy = useCallback((text: string) => {
    const flash = (next: CopyState) => {
      setState(next);
      if (revertTimer.current) clearTimeout(revertTimer.current);
      revertTimer.current = setTimeout(() => setState("idle"), COPY_FEEDBACK_MS);
    };
    void (async () => {
      try {
        await navigator.clipboard.writeText(text);
        flash("copied");
      } catch {
        flash("failed");
      }
    })();
  }, []);

  return { state, copy };
}

interface AgentPromptButtonProps {
  /** The text written to the clipboard. It is never rendered. */
  prompt: string;
  /**
   * Accessible name for the button, for a surface that stacks two of them
   * and would otherwise leave two buttons named identically. The visible
   * text never changes.
   */
  label?: string;
}

/**
 * A primary button that copies a prompt written for a coding agent. The
 * prompt itself is not rendered: it is written for an agent, not a reader.
 * The visible label flips to "Copied" or "Copy failed" for two seconds and is
 * announced politely.
 */
function AgentPromptButton({ prompt, label }: AgentPromptButtonProps) {
  const { state, copy } = useCopyFeedback();
  return (
    <Button
      aria-live="polite"
      {...(label === undefined ? {} : { "aria-label": label })}
      onClick={() => copy(prompt)}
    >
      {COPY_LABEL[state]}
    </Button>
  );
}

export {
  AgentPromptButton,
  useCopyFeedback,
  type AgentPromptButtonProps,
  type CopyState,
};
