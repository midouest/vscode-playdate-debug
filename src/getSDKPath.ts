import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";

export async function getSDKPath(): Promise<string> {
  let sdkPath: string | undefined;
  try {
    sdkPath = await getSDKPathConfig();
  } catch (err) {
    sdkPath = process.env.PLAYDATE_SDK_PATH;
  }

  if (!sdkPath) {
    throw new Error(
      "Could not find the Playdate SDK. " +
        "Please ensure that the PlaydateSDK is installed and the PLAYDATE_SDK_PATH environment variable is set"
    );
  }

  return sdkPath;
}

async function getSDKPathConfig(): Promise<string | undefined> {
  const configPath = path.resolve(os.homedir(), ".Playdate", "config");
  const configText = await fs.readFile(configPath, "utf-8");
  const configLines = configText.split("\n");

  for (const line of configLines) {
    const components = line.split("\t");
    if (components[0] === "SDKRoot") {
      return components[1];
    }
  }
}
