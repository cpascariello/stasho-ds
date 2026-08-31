/**
 * Shared "flat slot" chassis classes for form controls (Input, Textarea, and
 * the Select / Combobox / MultiSelect triggers). Extracted from the subsets
 * that are genuinely identical across those five components — see
 * docs/SKIN-PRINCIPLES.md for the underlying rules these encode.
 *
 * Not every component consumes every constant; some classes stay
 * component-side because they diverge (e.g. MultiSelect is a `role="button"`
 * div and uses `aria-disabled:` instead of `disabled:`, so it does not
 * consume `fieldDisabled`).
 */

/** Rest-state surface: fill + hairline border + radius floor. */
export const fieldChassis =
  "bg-background dark:bg-surface border border-edge rounded-sm";

/** Cyan hairline focus pair. */
export const fieldFocus =
  "focus-visible:outline-none focus-visible:border-accent-700 dark:focus-visible:border-accent";

/**
 * Flat-sink disabled cluster for controls using the native `disabled:`
 * pseudo-class (Input, Textarea, Select, Combobox).
 */
export const fieldDisabled =
  "disabled:bg-muted dark:disabled:bg-background disabled:border-edge/50 disabled:text-foreground/30 disabled:cursor-not-allowed";

/** Error rail applied on top of the chassis when a control is invalid. */
export const fieldError =
  "border-error hover:border-error focus-visible:border-error dark:focus-visible:border-error";

/** Dropdown-trigger hover cue (Select, Combobox, MultiSelect only). */
export const fieldTriggerHover = "hover:border-edge-hover";
