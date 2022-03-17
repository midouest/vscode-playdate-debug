import * as path from "path";

import { getPDXInfo } from "./getPDXInfo";

export async function getGamePath(
  workspaceRoot: string,
  sourcePath: string
): Promise<string> {
  const pdxInfo = await getPDXInfo(sourcePath);
  const name = pdxInfo.name;
  if (!name) {
    throw new Error("Missing field 'name' in pdxinfo");
  }

  const bundleName = name + ".pdx";
  return path.resolve(workspaceRoot, bundleName);
}
