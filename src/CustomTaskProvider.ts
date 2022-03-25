import * as vscode from "vscode";

import { CustomExecutionFactory } from "./CustomExecutionFactory";

/**
 * CustomTaskProviderOptions stores the vscode Task options that a
 * CustomTaskProvider uses to create a Task instance.
 */
export interface CustomTaskProviderOptions {
  type: string;
  problemMatchers: string[];
  name: string;
  source: string;
}

/**
 * CustomTaskProvider is a generic TaskProvider that can be configured for
 * different tasks using the options argument of the constructor.
 */
export class CustomTaskProvider implements vscode.TaskProvider {
  constructor(
    private factory: CustomExecutionFactory,
    private options: CustomTaskProviderOptions
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
