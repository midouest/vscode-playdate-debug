import * as path from "path";

export function getBaseFixturesPath(): string {
  return path.resolve(__dirname, "../../fixtures");
}

export function getPlaydateSDKFixturePath(): string {
  const baseFixturesPath = getBaseFixturesPath();
  return path.resolve(baseFixturesPath, "PlaydateSDK-1.12.3");
}

export function getWorkspaceFixturesPath(): string {
  const baseFixturesPath = getBaseFixturesPath();
  return path.resolve(baseFixturesPath, "workspace");
}

export function getCodeWorkspaceFixturePath(): string {
  const fixturesPath = getWorkspaceFixturesPath();
  return path.resolve(fixturesPath, "fixtures.code-workspace");
}
