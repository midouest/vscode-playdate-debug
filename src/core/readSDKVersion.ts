import * as fs from "fs/promises";
import * as path from "path";

export async function readSDKVersion(sdkPath: string): Promise<string> {
  const versionPath = path.resolve(sdkPath, "VERSION.txt");
  let version: string;
  try {
    version = await fs.readFile(versionPath, "utf-8");
  } catch (_err) {
    throw new Error(`Could not read Playdate SDK version at ${versionPath}`);
  }
  return version.trim();
}
