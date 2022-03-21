import * as path from "path";

import * as vscode from "vscode";

import { PLAYDATE_DEBUG_SECTION } from "./constants";
import { exec, isExecError } from "./exec";
import { getPDXInfo } from "./getPDXInfo";
import { getSourcePath } from "./getSourcePath";
import { quote } from "./quote";
import { TaskRunner } from "./TaskRunner";
import { wait } from "./wait";

export interface PDCTaskRunnerOptions {
  workspaceRoot: string;
  timeout?: number;
}

export class PDCTaskRunner implements TaskRunner {
  constructor(private options: PDCTaskRunnerOptions) {}

  async run(): Promise<string | undefined> {
    const { workspaceRoot, timeout } = this.options;

    let { sdkPath, sourcePath, outputPath, productName } =
      vscode.workspace.getConfiguration(PLAYDATE_DEBUG_SECTION);

    if (!sourcePath) {
      sourcePath = getSourcePath(workspaceRoot);
    }

    if (!outputPath) {
      outputPath = workspaceRoot;
    }

    if (!productName) {
      const pdxInfo = await getPDXInfo(sourcePath);
      productName = pdxInfo.name;
    }

    const productPath = path.resolve(outputPath, productName);

    const args = [quote(sourcePath), quote(productPath)];
    if (sdkPath) {
      args.splice(0, 0, "-sdkpath", quote(sdkPath));
    }

    const command = `pdc ${args.join(" ")}`;
    try {
      await exec(command);
    } catch (err) {
      if (isExecError(err)) {
        return err.stderr;
      }
    }

    if (!timeout) {
      return;
    }

    await wait(timeout);
  }
}
