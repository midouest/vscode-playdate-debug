import * as vscode from "vscode";

/**
 * CustomExecutionFactory is used to encapsulate creating a CustomExecution for
 * a vscode.TaskProvider. It allows us to use a generic task provider that can
 * be configured for different tasks.
 */
export interface CustomExecutionFactory {
  createExecution(definition: vscode.TaskDefinition): vscode.CustomExecution;
}
