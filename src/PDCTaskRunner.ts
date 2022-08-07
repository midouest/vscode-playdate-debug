import * as path from "path";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { TaskRunner } from "./TaskRunner";
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
 *
 * TODO: consider supporting make and cmake for C projects
 */
export class PDCTaskRunner implements TaskRunner {
  constructor(
    private config: ConfigurationResolver,
    private options: PDCTaskRunnerOptions
  ) {}

  async run(): Promise<void> {
    const { strip, noCompress, verbose, quiet, skipUnknown } = this.options;
    const { sdkPath, sourcePath, productPath } = await this.config.resolve();

    const cmd = path.join(sdkPath, "bin", "pdc");
    const args = [quote(sourcePath), quote(productPath)];

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
      args.splice(0, 0, "--unknown");
    }

    const command = `${cmd} ${args.join(" ")}`;
    await exec(command);
  }
}
