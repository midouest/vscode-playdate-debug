import * as path from "path";

export function getGamePathFromSource(
  sourcePath: string,
  outputPath: string,
): string {
  const inputName = path.basename(sourcePath, ".lua");
  return path.resolve(outputPath, inputName + ".pdx");
}
