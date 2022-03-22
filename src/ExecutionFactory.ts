import * as vscode from "vscode";

export interface ExecutionFactory {
  createExecution(definition: vscode.TaskDefinition): vscode.CustomExecution;
}
