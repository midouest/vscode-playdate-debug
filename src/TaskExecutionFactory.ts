import * as vscode from "vscode";

/**
 * TaskExecutionFactory is used to encapsulate creating an execution instance
 * for a vscode.TaskProvider. It allows us to use a generic task provider that
 * can be configured for different tasks.
 */
export interface TaskExecutionFactory {
  createExecution(
    definition: vscode.TaskDefinition
  ): vscode.CustomExecution | vscode.ShellExecution | vscode.ProcessExecution;
}
