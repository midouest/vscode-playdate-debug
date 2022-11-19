import { injectable, unmanaged } from "inversify";
import * as vscode from "vscode";

import { TaskExecutionFactory } from "./TaskExecutionFactory";

/**
 * TaskProviderOptions stores the vscode Task options that a TaskProvider uses
 * to create a Task instance.
 */
export interface TaskProviderOptions {
  type: string;
  problemMatchers: string[];
  name: string;
  source: string;
}

/**
 * TaskProvider is a generic vscode.TaskProvider that can be configured for
 * different tasks using the options argument of the constructor.
 */
@injectable()
export class TaskProvider implements vscode.TaskProvider {
  constructor(
    @unmanaged() private factory: TaskExecutionFactory,
    @unmanaged() private options: TaskProviderOptions
  ) {}

  provideTasks(): vscode.ProviderResult<vscode.Task[]> {
    return this.createTask().then((task) => [task]);
  }

  resolveTask(
    task: vscode.Task,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Task> {
    return this.createTask(task);
  }

  private async createTask(task?: vscode.Task): Promise<vscode.Task> {
    const { type, problemMatchers, name, source } = this.options;

    const definition = task?.definition ?? { type };
    const scope = task?.scope ?? vscode.TaskScope.Workspace;
    const execution = await this.factory.createExecution(definition, scope);

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
