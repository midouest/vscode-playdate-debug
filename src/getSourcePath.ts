import * as path from 'path';

export function getSourcePath(workspaceRoot: string): string {
    return path.resolve(workspaceRoot, "source");
}
