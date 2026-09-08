/**
 * Shared label + helper rhythm for the two field wrappers, FormField
 * (editable) and DetailField (read-only). Both compose these constants so a
 * form and a detail card built from the same tokens stack identically.
 */

/** Wrapper: label above value above helper, 6px apart. */
export const fieldStack = "flex flex-col gap-1.5";

/** Label line. */
export const fieldLabel = "text-sm font-medium text-foreground";

/** Helper line under the value; the consumer adds the tone color. */
export const fieldHelper = "text-xs";
