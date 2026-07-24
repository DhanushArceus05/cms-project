/** Merge conditional class names without pulling in a dependency like clsx. */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ');
}
