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
export class TaskProvider implements vscode.TaskProvider {
  constructor(
    private factory: TaskExecutionFactory,
    private options: TaskProviderOptions
  ) {}

  provideTasks(): vscode.ProviderResult<vscode.Task[]> {
    const task = this.createTask();
    return [task];
  }

  resolveTask(task: vscode.Task): vscode.ProviderResult<vscode.Task> {
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
