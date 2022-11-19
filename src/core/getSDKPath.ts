import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import * as process from "process";

/**
 * getSDKPath retrieves the path to the PlaydateSDK folder. The SDK folder can
 * be found using one of two methods:
 * - A tab-separated file at $HOME/.Playdate/config containing a SDKRoot
 *   key and value (macOS)
 * - The PLAYDATE_SDK_PATH environment variable (macOS, Windows and Linux)
 */
export async function getSDKPath(): Promise<string> {
  let sdkPath = process.env.PLAYDATE_SDK_PATH;
  if (sdkPath) {
    return sdkPath;
  }

  if (process.platform === "darwin") {
    try {
      sdkPath = await getSDKPathConfig();
    } catch (err) {
      // noop
    }
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
      return components[1].trim();
    }
  }
}
