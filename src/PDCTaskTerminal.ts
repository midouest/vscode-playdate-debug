import * as path from "path";

import * as vscode from "vscode";

import { getPDXInfo } from "./getPDXInfo";
import { getSourcePath } from "./getSourcePath";
import { PLAYDATE_DEBUG_SECTION } from "./constants";
import { quote } from "./quote";
import { exec, isExecError } from "./exec";
import { wait } from "./wait";

export interface PDCTaskTerminalOptions {
  workspaceRoot: string;
  timeout?: number;
}

export class PDCTaskTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();
  onDidWrite: vscode.Event<string> = this.writeEmitter.event;

  private closeEmitter = new vscode.EventEmitter<number>();
  onDidClose?: vscode.Event<number> = this.closeEmitter.event;

  constructor(private options: PDCTaskTerminalOptions) {}

  open(_initialDimensions: vscode.TerminalDimensions | undefined): void {
    this.run();
  }

  close(): void {
    // noop
  }

  private async run(): Promise<void> {
    const errorMessage = await runPDC(this.options);

    let status = 0;
    if (errorMessage) {
      this.writeEmitter.fire(errorMessage + "\n");
      status = 1;
    }

    this.closeEmitter.fire(status);
  }
}

async function runPDC(
  options: PDCTaskTerminalOptions
): Promise<string | undefined> {
  const { workspaceRoot, timeout } = options;
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
