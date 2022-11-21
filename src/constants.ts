export enum DebugType {
  /** Playdate launch.json configuration type */
  playdate = "playdate",
}

/** The Playdate Simulator responds to the Debug Adapter Protocol on this port */
export const SIMULATOR_DEBUG_PORT = 55934;

export enum TaskType {
  /** tasks.json task type for the PDC task */
  pdc = "pdc",

  /** tasks.json task type for the Simulator task */
  simulator = "playdate-simulator",
}

/** tasks.json default task label source for all tasks */
export const TASK_SOURCE = "Playdate";

export enum ProblemMatcher {
  /** The name of the PDC lua problem matcher when referenced in VS Code */
  pdcLua = "$pdc-lua",

  /** The name of the PDC external problem matcher when referenced in VS Code */
  pdcExternal = "$pdc-external",
}

export enum Command {
  /** The name of the "Run file in Playdate Simulator" command when referenced in VS Code */
  runEditorContents = "playdate-debug.runEditorContents",

  /** The name of the "Debug file in Playdate Simulator" command when referenced in VS Code */
  debugEditorContents = "playdate-debug.debugEditorContents",
}
