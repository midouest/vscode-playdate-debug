import * as vscode from "vscode";
import { PLAYDATE_SOURCE } from "./constants";
import { SimulatorTaskRunner } from "./SimulatorTaskRunner";
import { TaskRunnerTerminal } from "./TaskRunnerTerminal";

export class SimulatorTaskProvider implements vscode.TaskProvider {
  static readonly taskType = "playdate-simulator";

  constructor(private workspaceRoot: string) {}

  public provideTasks(
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Task[]> {
    const task = this.createPlaydateSimulatorTask();
    return [task];
  }

  public resolveTask(
    task: vscode.Task,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Task> {
    return this.createPlaydateSimulatorTask(task);
  }

  private createPlaydateSimulatorTask(task?: vscode.Task): vscode.Task {
    const definition = task?.definition ?? {
      type: SimulatorTaskProvider.taskType,
    };
    const scope = task?.scope ?? vscode.TaskScope.Workspace;
    const execution = new vscode.CustomExecution(async (_task) => {
      const runner = new SimulatorTaskRunner({
        workspaceRoot: this.workspaceRoot,
        timeout: definition.timeout,
      });
      return new TaskRunnerTerminal(runner);
    });
    const problemMatchers = ["$pdc-external"];
    return new vscode.Task(
      definition,
      scope,
      "Simulator",
      PLAYDATE_SOURCE,
      execution,
      problemMatchers
    );
  }
}
