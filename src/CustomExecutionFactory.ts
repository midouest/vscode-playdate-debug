import * as vscode from "vscode";

export interface CustomExecutionFactory {
  createExecution(definition: vscode.TaskDefinition): vscode.CustomExecution;
}
