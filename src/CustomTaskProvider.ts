import * as vscode from "vscode";
import { CustomExecutionFactory } from "./CustomExecutionFactory";

export interface CustomTaskProviderOptions {
  type: string;
  problemMatchers: string[];
  name: string;
  source: string;
}

export class CustomTaskProvider implements vscode.TaskProvider {
  constructor(
    private factory: CustomExecutionFactory,
    private options: CustomTaskProviderOptions
  ) {}

  provideTasks(
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Task[]> {
    const task = this.createTask();
    return [task];
  }

  resolveTask(
    task: vscode.Task,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Task> {
    return this.createTask(task);
  }

  private createTask(task?: vscode.Task): vscode.Task {
    const { type, problemMatchers, name, source } = this.options;

    const definition = task?.definition ?? { type };
    const scope = task?.scope ?? vscode.TaskScope.Workspace;
    const execution = this.factory.createExecution(definition);

    return new vscode.Task(
      definition,
      scope,
      name,
      source,
      execution,
      problemMatchers
    );
  }
}
