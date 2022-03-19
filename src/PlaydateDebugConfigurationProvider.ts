import * as path from "path";

import * as vscode from "vscode";

import { getGamePath } from "./getGamePath";
import { getSDKPath } from "./getSDKPath";
import { getSourcePath } from "./getSourcePath";

export class PlaydateDebugConfigurationProvider
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
      sourcePath = getSourcePath(workspaceRoot);
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
