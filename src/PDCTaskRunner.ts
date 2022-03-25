import { ConfigurationResolver } from "./ConfigurationResolver";
import { TaskRunner } from "./TaskRunner";
import { exec, isExecError } from "./exec";
import { quote } from "./quote";
import { wait } from "./wait";

/**
 * PDCTaskRunnerOptions contains extra properties asigned to the `pdc` task in
 * `tasks.json`.
 */
export interface PDCTaskRunnerOptions {
  timeout?: number;
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

  async run(): Promise<string | undefined> {
    const { timeout } = this.options;
    const { sdkPath, sourcePath, productPath } = await this.config.resolve({
      sdkPath: false,
    });

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
