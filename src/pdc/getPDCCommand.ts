import * as path from "path";

import { quote } from "../util";

export interface GetPDCCommandOptions {
  sdkPath: string;
  input: string;
  output: string;
  strip?: boolean;
  noCompress?: boolean;
  verbose?: boolean;
  quiet?: boolean;
  skipUnknown?: boolean;
}

export function getPDCCommand(options: GetPDCCommandOptions) {
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
  return `${executable} ${args.join(" ")}`;
}
