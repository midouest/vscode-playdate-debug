import * as path from "path";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { OnTaskRunnerMessage, TaskRunner } from "./TaskRunner";
import { exec } from "./exec";
import { quote } from "./quote";

/**
 * PDCTaskRunnerOptions contains extra properties asigned to the `pdc` task in
 * `tasks.json`.
 */
export interface PDCTaskRunnerOptions {
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
  constructor(
    private config: ConfigurationResolver,
    private options: PDCTaskRunnerOptions
  ) {}

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    const { strip, noCompress, verbose, quiet, skipUnknown } = this.options;
    const { sdkPath, sourcePath, gamePath } = await this.config.resolve();

    const cmd = quote(path.join(sdkPath, "bin", "pdc"));
    const args = [quote(sourcePath), quote(gamePath)];

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
