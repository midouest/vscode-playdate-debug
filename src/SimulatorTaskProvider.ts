import * as vscode from "vscode";

import { PLAYDATE_SOURCE } from "./constants";
import { CustomExecutionFactory } from "./CustomExecutionFactory";

export class SimulatorTaskProvider implements vscode.TaskProvider {
  static readonly taskType = "playdate-simulator";

  constructor(private factory: CustomExecutionFactory) {}

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
    const execution = this.factory.createExecution(definition);

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
