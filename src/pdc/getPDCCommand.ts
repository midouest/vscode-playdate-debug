import * as path from "path";

import { WIN32_FORWARD_SLASH_SDK_VERSION } from "../constants";
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
  libPath?: string[];
  sdkVersion: string;
}

export function getPDCCommand(options: GetPDCCommandOptions) {
  let { input } = options;
  const {
    sdkPath,
    output,
    strip,
    noCompress,
    verbose,
    quiet,
    skipUnknown,
    libPath,
    sdkVersion,
  } = options;

  const executable = quote(path.join(sdkPath, "bin", "pdc"));

  const optionalArgs = [];
  if (input.endsWith(".lua")) {
    optionalArgs.push("--main");
    if (
      process.platform === "win32" &&
      sdkVersion >= WIN32_FORWARD_SLASH_SDK_VERSION
    ) {
      input = input.split(path.win32.sep).join(path.posix.sep);
    }
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
  if (libPath) {
    libPath.forEach((lib) => {
      optionalArgs.push("--libpath", quote(lib));
    });
  }

  const requiredArgs = [
    "-sdkpath",
    quote(sdkPath),
    quote(input),
    quote(output),
  ];

  const args = optionalArgs.concat(requiredArgs);
  return `${executable} ${args.join(" ")}`;
}
