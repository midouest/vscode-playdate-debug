import { Chainable, OnTaskRunnerMessage, TaskRunner } from "../core";
import { exec } from "../util";

import { getPDCCommand, GetPDCCommandOptions } from "./getPDCCommand";

/**
 * PDCTaskRunnerOptions contains extra properties asigned to the `pdc` task in
 * `tasks.json`.
 */
export interface PDCTaskRunnerOptions {
  sdkPath: string;
  sourcePath: string;
  gamePath: string;
  strip?: boolean;
  noCompress?: boolean;
  verbose?: boolean;
  quiet?: boolean;
  skipUnknown?: boolean;
  main?: string;
}

/**
 * PDCTaskRunner is responsible for executing the PlaydateSDK's `pdc` binary
 * in order to compile a Playdate game's source into a `.pdx` bundle.
 */
export class PDCTaskRunner extends Chainable implements TaskRunner {
  constructor(private options: PDCTaskRunnerOptions) {
    super();
  }

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    const pdcOptions = this.getPDCOptions();
    const pdcCommand = getPDCCommand(pdcOptions);

    onMessage("Compiling...");
    onMessage(`> ${pdcCommand}`);
    await exec(pdcCommand);
  }

  private getPDCOptions(): GetPDCCommandOptions {
    const {
      sdkPath,
      sourcePath,
      gamePath,
      strip,
      noCompress,
      verbose,
      quiet,
      skipUnknown,
    } = this.options;

    return {
      sdkPath,
      input: sourcePath,
      output: gamePath,
      strip,
      noCompress,
      verbose,
      quiet,
      skipUnknown,
    };
  }
}
