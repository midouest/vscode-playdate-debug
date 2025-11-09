import * as assert from "assert";
import * as path from "path";

import { ExtensionModule } from "../../ExtensionModule";
import { Configuration, ConfigurationResolver, CoreModule } from "../../core";

import { getFixtureWorkspaceFolder } from "./suiteTestUtils";

suite("Configuration Test Suite", () => {
  let configResolver: ConfigurationResolver;

  setup(() => {
    const loaded = ExtensionModule.load(CoreModule);
    assert.ok(loaded);

    configResolver = loaded.container.get(ConfigurationResolver, {
      autobind: true,
    });
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

    assert.match(sdkVersion, /^\d+\.\d+\.\d+$/);

    assert.ok(path.isAbsolute(sourcePath));
    assert.ok(
      sourcePath.endsWith(
        path.join("/fixtures/workspace/basic-configuration/source"),
      ),
    );

    assert.ok(path.isAbsolute(outputPath));
    assert.ok(
      outputPath.endsWith(path.join("/fixtures/workspace/basic-configuration")),
    );

    assert.strictEqual(productName, "Basic Configuration");

    assert.ok(path.isAbsolute(productPath));
    assert.ok(
      productPath.endsWith(
        path.join(
          "/fixtures/workspace/basic-configuration/Basic Configuration",
        ),
      ),
    );

    assert.ok(path.isAbsolute(gamePath));
    assert.ok(
      gamePath.endsWith(
        path.join(
          "/fixtures/workspace/basic-configuration/Basic Configuration.pdx",
        ),
      ),
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
    assert.ok(sdkPath.endsWith(path.join("/fixtures/PlaydateSDK")));

    assert.match(sdkVersion, /^\d+\.\d+\.\d+$/);

    assert.ok(path.isAbsolute(sourcePath));
    assert.ok(
      sourcePath.endsWith(
        path.join("/fixtures/workspace/basic-configuration/source"),
      ),
    );

    assert.ok(path.isAbsolute(outputPath));
    assert.ok(
      outputPath.endsWith(
        path.join("/fixtures/workspace/override-configuration"),
      ),
    );

    assert.strictEqual(productName, "Override Configuration");

    assert.ok(path.isAbsolute(productPath));
    assert.ok(
      productPath.endsWith(
        path.join(
          "/fixtures/workspace/override-configuration/Override Configuration",
        ),
      ),
    );

    assert.ok(path.isAbsolute(gamePath));
    assert.ok(
      gamePath.endsWith(
        path.join(
          "/fixtures/workspace/override-configuration/Override Configuration.pdx",
        ),
      ),
    );
  });
});
