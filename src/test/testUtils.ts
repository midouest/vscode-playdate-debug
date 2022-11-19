import * as path from "path";

export function getFixturesPath(): string {
  return path.resolve(__dirname, "../../fixtures/workspace");
}

export function getFixturesCodeWorkspacePath(): string {
  const fixturesPath = getFixturesPath();
  return path.resolve(fixturesPath, "fixtures.code-workspace");
}
