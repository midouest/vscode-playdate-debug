import * as child_process from "child_process";
import * as util from "util";

export const exec = util.promisify(child_process.exec);

export interface ExecError {
  stderr: string;
}

export function isExecError(err: unknown): err is ExecError {
  return (err as ExecError).stderr !== undefined;
}
