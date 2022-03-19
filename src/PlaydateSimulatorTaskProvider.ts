import * as vscode from "vscode";
import { PlaydateSimulatorTaskTerminal } from "./PlaydateSimulatorTaskTerminal";

export class PlaydateSimulatorTaskProvider implements vscode.TaskProvider {
  static taskType = "playdate-simulator";

  private playdateSimulatorPromise: Thenable<vscode.Task[]> | undefined =
    undefined;

  constructor() {}

  public provideTasks(
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Task[]> {
    if (!this.playdateSimulatorPromise) {
      const task = createPlaydateSimulatorTask();
      this.playdateSimulatorPromise = Promise.resolve([task]);
    }
    return this.playdateSimulatorPromise;
  }

  public resolveTask(
    task: vscode.Task,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Task> {
    return createPlaydateSimulatorTask(task.definition);
  }
}

function createPlaydateSimulatorTask(
  task?: vscode.TaskDefinition
): vscode.Task {
  const definition = task?.definition ?? {
    type: PlaydateSimulatorTaskProvider.taskType,
  };
  const scope = task?.scope ?? vscode.TaskScope.Workspace;
  const execution = new vscode.CustomExecution(
    async (_task) => new PlaydateSimulatorTaskTerminal()
  );
  const problemMatchers = ["$pdc-external"];
  return new vscode.Task(
    definition,
    scope,
    "open",
    PlaydateSimulatorTaskProvider.taskType,
    execution,
    problemMatchers
  );
}
