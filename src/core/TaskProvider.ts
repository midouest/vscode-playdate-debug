import { injectable, unmanaged } from "inversify";
import * as vscode from "vscode";

import { TaskExecutionFactory } from "./TaskExecutionFactory";
import { TaskProviderErrorTerminal } from "./TaskProviderErrorTerminal";

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
    @unmanaged() private options: TaskProviderOptions,
  ) {}

  async provideTasks(): Promise<vscode.Task[]> {
    let task: vscode.Task;
    try {
      task = await this.createTask();
    } catch (err) {
      task = this.createErrorTask(err);
    }
    return [task];
  }

  async resolveTask(
    task: vscode.Task,
    _token: vscode.CancellationToken,
  ): Promise<vscode.Task> {
    const { definition, scope } = task;
    try {
      return await this.createTask(definition, scope);
    } catch (err) {
      return this.createErrorTask(err, definition, scope);
    }
  }

  async createTask(
    maybeDefinition?: vscode.Task["definition"],
    maybeScope?: vscode.Task["scope"],
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
      problemMatchers,
    );
  }

  protected createErrorTask(
    error: unknown,
    maybeDefinition?: vscode.Task["definition"],
    maybeScope?: vscode.Task["scope"],
  ): vscode.Task {
    const { type, problemMatchers, name, source } = this.options;
    const definition = maybeDefinition ?? { type };
    const scope = maybeScope ?? vscode.TaskScope.Workspace;
    const execution = new vscode.CustomExecution(() =>
      Promise.resolve(new TaskProviderErrorTerminal(error)),
    );

    return new vscode.Task(
      definition,
      scope,
      name,
      source,
      execution,
      problemMatchers,
    );
  }
}
