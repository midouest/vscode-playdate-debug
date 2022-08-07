import * as path from "path";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { TaskRunner } from "./TaskRunner";
import { exec } from "./exec";
import { quote } from "./quote";

/**
 * PDCTaskRunnerOptions contains extra properties asigned to the `pdc` task in
 * `tasks.json`.
 */
export interface PDCTaskRunnerOptions {}

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
    const { sdkPath, sourcePath, productPath } = await this.config.resolve();

    const cmd = path.join(sdkPath, "bin", "pdc");
    const args = [quote(sourcePath), quote(productPath)];
    const command = `${cmd} ${args.join(" ")}`;
    await exec(command);
  }
}
