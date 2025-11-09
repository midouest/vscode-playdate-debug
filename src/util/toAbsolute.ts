import * as path from "path";

/** Resolve relative paths from the workspace root. Absolute paths are not modified */
export function toAbsolute(
  workspaceRoot: string,
  relativePath: string,
): string {
  if (path.isAbsolute(relativePath)) {
    return relativePath;
  }
  return path.resolve(workspaceRoot, relativePath);
}
