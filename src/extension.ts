import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import * as process from "process";

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const provider = new PlaydateConfigurationProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider("playdate", provider)
  );

  const factory = new PlaydateDebugAdapterServerDescriptorFactory();
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory("playdate", factory)
  );
}

export function deactivate() {
  // noop
}

class PlaydateDebugAdapterServerDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory
{
  createDebugAdapterDescriptor(
    _session: vscode.DebugSession,
    _executable: vscode.DebugAdapterExecutable | undefined
  ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
    return new vscode.DebugAdapterServer(55934);
  }
}

class PlaydateConfigurationProvider
  implements vscode.DebugConfigurationProvider
{
  async resolveDebugConfiguration(
    folder: vscode.WorkspaceFolder | undefined,
    config: vscode.DebugConfiguration,
    _token?: vscode.CancellationToken
  ): Promise<vscode.DebugConfiguration | undefined | null> {
    const { type, request, name } = config;
    const workspaceRoot = folder?.uri.fsPath;
    if (!workspaceRoot) {
      // Folder-less setups are not supported
      return null;
    }

    let sdkPath: string | undefined = config.sdkPath;
    if (!sdkPath) {
      sdkPath = await getSDKPath();
    }

    let sourcePath = config.sourcePath;
    if (!sourcePath) {
      sourcePath = path.resolve(workspaceRoot, "source");
    }

    let gamePath = config.gamePath;
    if (!gamePath) {
      gamePath = await getGamePath(workspaceRoot, sourcePath);
    }

    return {
      type,
      request,
      name,
      sdkPath,
      sourcePath,
      gamePath,
    };
  }
}

async function getSDKPath(): Promise<string> {
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

async function getGamePath(
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

interface PDXInfo {
  [key: string]: string;
}

async function getPDXInfo(sourcePath: string): Promise<PDXInfo> {
  const infoPath = path.resolve(sourcePath, "pdxinfo");
  let infoText: string;
  try {
    infoText = await fs.readFile(infoPath, "utf-8");
  } catch (err) {
    throw new Error(`Could not read pdxinfo file at ${infoPath}`);
  }
  const infoLines = infoText.split("\n");

  const pdxInfo = {};
  for (const line of infoLines) {
    const i = line.indexOf("=");
    if (i === -1) {
      continue;
    }

    const key = line.slice(0, i);
    const value = line.slice(i + 1);
    pdxInfo[key] = value;
  }

  return pdxInfo;
}
