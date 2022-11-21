import * as path from "path";

import { exec, quote } from "../util";

export interface PDCCommandOptions {
  sdkPath: string;
  input: string;
  output: string;
  strip?: boolean;
  noCompress?: boolean;
  verbose?: boolean;
  quiet?: boolean;
  skipUnknown?: boolean;
}

export interface PDCCommandOutput {
  stdout: string;
  stderr: string;
}

export class PDCCommand {
  readonly command: string;

  constructor(options: PDCCommandOptions) {
    const {
      sdkPath,
      input,
      output,
      strip,
      noCompress,
      verbose,
      quiet,
      skipUnknown,
    } = options;

    const executable = quote(path.join(sdkPath, "bin", "pdc"));

    const requiredArgs = [
      "-sdkpath",
      quote(sdkPath),
      quote(input),
      quote(output),
    ];

    const optionalArgs = [];
    if (input.endsWith(".lua")) {
      optionalArgs.push("--main");
    }
    if (strip) {
      optionalArgs.push("--strip");
    }
    if (noCompress) {
      optionalArgs.push("--no-compress");
    }
    if (verbose) {
      optionalArgs.push("--verbose");
    }
    if (quiet) {
      optionalArgs.push("--quiet");
    }
    if (skipUnknown) {
      optionalArgs.push("--skip-unknown");
    }

    const args = optionalArgs.concat(requiredArgs);
    this.command = `${executable} ${args.join(" ")}`;
  }

  execute(): Promise<PDCCommandOutput> {
    return exec(this.command);
  }
}
