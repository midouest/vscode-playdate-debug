import * as assert from "assert";
import * as path from "path";

import { Container } from "inversify";

import { Configuration, ConfigurationResolver, CoreModule } from "../../core";

import { getFixtureWorkspaceFolder } from "./suiteTestUtils";

suite("Configuration Test Suite", () => {
  let configResolver: ConfigurationResolver;

  setup(() => {
    const container = new Container();
    const coreModule = new CoreModule(container);
    assert.ok(coreModule.load());

    configResolver = container.resolve(ConfigurationResolver);
    assert.ok(configResolver);
  });

  async function resolveConfig(fixture: string): Promise<Configuration> {
    const folder = getFixtureWorkspaceFolder(fixture);
    assert.ok(folder);

    const config = await configResolver.resolve(folder);
    assert.ok(config);

    return config;
  }

  test("basic-configuration", async () => {
    const {
      sdkPath,
      sdkVersion,
      sourcePath,
      outputPath,
      productName,
      productPath,
      gamePath,
    } = await resolveConfig("basic-configuration");

    assert.ok(sdkPath);
    assert.ok(path.isAbsolute(sdkPath));
    assert.strictEqual(sdkPath, process.env.PLAYDATE_SDK_PATH);

    assert.ok(sdkVersion.match(/\d+.\d+.\d+/));

    assert.ok(path.isAbsolute(sourcePath));
    assert.ok(
      sourcePath.endsWith("/fixtures/workspace/basic-configuration/source")
    );

    assert.ok(path.isAbsolute(outputPath));
    assert.ok(outputPath.endsWith("/fixtures/workspace/basic-configuration"));

    assert.strictEqual(productName, "Basic Configuration");

    assert.ok(path.isAbsolute(productPath));
    assert.ok(
      productPath.endsWith(
        "/fixtures/workspace/basic-configuration/Basic Configuration"
      )
    );

    assert.ok(path.isAbsolute(gamePath));
    assert.ok(
      gamePath.endsWith(
        "/fixtures/workspace/basic-configuration/Basic Configuration.pdx"
      )
    );
  });

  test("override-configuration", async () => {
    const {
      sdkPath,
      sdkVersion,
      sourcePath,
      outputPath,
      productName,
      productPath,
      gamePath,
    } = await resolveConfig("override-configuration");

    assert.ok(sdkPath);
    assert.ok(path.isAbsolute(sdkPath));
    assert.ok(sdkPath.endsWith("/fixtures/PlaydateSDK"));

    assert.strictEqual(sdkVersion, "1.12.3");

    assert.ok(path.isAbsolute(sourcePath));
    assert.ok(
      sourcePath.endsWith("/fixtures/workspace/basic-configuration/source")
    );

    assert.ok(path.isAbsolute(outputPath));
    assert.ok(
      outputPath.endsWith("/fixtures/workspace/override-configuration")
    );

    assert.strictEqual(productName, "Override Configuration");

    assert.ok(path.isAbsolute(productPath));
    assert.ok(
      productPath.endsWith(
        "/fixtures/workspace/override-configuration/Override Configuration"
      )
    );

    assert.ok(path.isAbsolute(gamePath));
    assert.ok(
      gamePath.endsWith(
        "/fixtures/workspace/override-configuration/Override Configuration.pdx"
      )
    );
  });
});
