/**
 * Wrap the given filesystem path in quotes ("). This prevents issues with paths
 * that contain spaces.
 *
 * @param path The filesystem path to be wrapped in quotes
 * @returns A quoted filesystem path
 */
export function quote(path: string): string {
  return `"${path}"`;
}
