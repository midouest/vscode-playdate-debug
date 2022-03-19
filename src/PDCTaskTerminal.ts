import * as path from 'path';
import * as child_process from 'child_process';
import * as util from 'util';

import * as vscode from 'vscode'

import { getPDXInfo } from './getPDXInfo';
import { getSDKPath } from './getSDKPath';
import { getSourcePath } from './getSourcePath';

export class PDCTaskTerminal implements vscode.Pseudoterminal {
    private writeEmitter = new vscode.EventEmitter<string>();
    onDidWrite: vscode.Event<string> = this.writeEmitter.event;

    private closeEmitter = new vscode.EventEmitter<number>();
    onDidClose?: vscode.Event<number> = this.closeEmitter.event;

    constructor(private workspaceRoot: string) {}

    open(_initialDimensions: vscode.TerminalDimensions | undefined): void {
        this.run();
    }

    close(): void {
        // noop
    }

    private async run(): Promise<void> {
        const errorMessage = await runPDC(this.workspaceRoot);

        let status = 0;
        if (errorMessage) {
            this.writeEmitter.fire(errorMessage);
            status = 1;
        }

        this.closeEmitter.fire(status);
    }
}

interface PDCError {
    stderr: string;
}

function isPDCError(err: unknown): err is PDCError {
    return (err as PDCError).stderr !== undefined;
}

async function runPDC(workspaceRoot: string): Promise<string | undefined> {
    const sdkPath = await getSDKPath();
    const sourcePath = getSourcePath(workspaceRoot);
    const pdxInfo = await getPDXInfo(sourcePath);
    const outputPath = path.resolve(workspaceRoot, pdxInfo.name);

    const command = `pdc -sdkpath "${sdkPath}" "${sourcePath}" "${outputPath}"`;
    const exec = util.promisify(child_process.exec);
    try {
        await exec(command);
    } catch (err) {
        if (isPDCError(err)) {
            return err.stderr;
        }
    }
}
