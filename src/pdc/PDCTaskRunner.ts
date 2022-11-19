import * as path from "path";

import { OnTaskRunnerMessage, TaskRunner } from "../core";
import { exec, quote } from "../util";

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
}

/**
 * PDCTaskRunner is responsible for executing the PlaydateSDK's `pdc` binary
 * in order to compile a Playdate game's source into a `.pdx` bundle.
 */
export class PDCTaskRunner implements TaskRunner {
  constructor(private options: PDCTaskRunnerOptions) {}

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
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

    const cmd = quote(path.join(sdkPath, "bin", "pdc"));
    const args = [
      "-sdkpath",
      quote(sdkPath),
      quote(sourcePath),
      quote(gamePath),
    ];

    if (strip) {
      args.splice(0, 0, "--strip");
    }
    if (noCompress) {
      args.splice(0, 0, "--no-compress");
    }
    if (verbose) {
      args.splice(0, 0, "--verbose");
    }
    if (quiet) {
      args.splice(0, 0, "--quiet");
    }
    if (skipUnknown) {
      args.splice(0, 0, "--skip-unknown");
    }

    onMessage("Compiling...");
    const command = `${cmd} ${args.join(" ")}`;
    onMessage(`> ${command}`);
    await exec(command);
  }
}
