import * as vscode from "vscode";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { SimulatorMacOSTaskRunner } from "./SimulatorMacOSTaskRunner";
import { SimulatorWin32TaskRunner } from "./SimulatorWin32TaskRunner";
import { TaskExecutionFactory } from "./TaskExecutionFactory";
import { TaskRunner } from "./TaskRunner";
import { TaskRunnerTerminal } from "./TaskRunnerTerminal";

/**
 * The SimulatorExecutionFactory is responsible for configuring the VS Code
 * pseudoterminal that executes the `playdate-simulator` task.
 */
export class SimulatorExecutionFactory implements TaskExecutionFactory {
  constructor(private config: ConfigurationResolver) {}

  createExecution(definition: vscode.TaskDefinition): vscode.CustomExecution {
    const { openGame, kill } = definition;

    let runner: TaskRunner;
    switch (process.platform) {
      case "darwin": {
        runner = new SimulatorMacOSTaskRunner(this.config, { openGame, kill });
        break;
      }

      case "win32": {
        runner = new SimulatorWin32TaskRunner(this.config, { openGame, kill });
        break;
      }

      // FIXME: The Playdate Simulator currently segfaults when launched from VS Code
      // case "linux": {
      //   runner = new SimulatorLinuxTaskRunner(this.config, { openGame, kill });
      //   break;
      // }

      default:
        return `error: platform '${process.platform}' is not supported`;
    }

    return new vscode.CustomExecution(
      async () => new TaskRunnerTerminal(runner)
    );
  }
}
