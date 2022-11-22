import { injectable, unmanaged } from "inversify";
import * as vscode from "vscode";

import { showErrorMessage } from "../util";

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

  async provideTasks(): Promise<vscode.Task[]> {
    try {
      const task = await this.createTask();
      return [task];
    } catch (err) {
      showErrorMessage(err);
      throw err;
    }
  }

  async resolveTask(
    task: vscode.Task,
    _token: vscode.CancellationToken
  ): Promise<vscode.Task> {
    try {
      return await this.createTask(task.definition, task.scope);
    } catch (err) {
      showErrorMessage(err);
      throw err;
    }
  }

  async createTask(
    maybeDefinition?: vscode.Task["definition"],
    maybeScope?: vscode.Task["scope"]
  ): Promise<vscode.Task> {
    const { type, problemMatchers, name, source } = this.options;
    const definition = maybeDefinition ?? { type };
    const scope = maybeScope ?? vscode.TaskScope.Workspace;
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
