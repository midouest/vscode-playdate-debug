import * as vscode from "vscode";

export type TaskExecution =
  | vscode.CustomExecution
  | vscode.ShellExecution
  | vscode.ProcessExecution;

/**
 * TaskExecutionFactory is used to encapsulate creating an execution instance
 * for a vscode.TaskProvider. It allows us to use a generic task provider that
 * can be configured for different tasks.
 */
export interface TaskExecutionFactory {
  createExecution(definition: vscode.TaskDefinition): Promise<TaskExecution>;
}
