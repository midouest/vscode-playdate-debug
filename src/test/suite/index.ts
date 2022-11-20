import * as path from "path";

import * as nycConfigTypescript from "@istanbuljs/nyc-config-typescript";
import * as glob from "glob";
import * as Mocha from "mocha";
import * as NYC from "nyc";
import "reflect-metadata";

export async function run(): Promise<void> {
  await wrapNYC(() => runMocha());
}

async function wrapNYC(cb: () => Promise<void>): Promise<void> {
  const nyc = new NYC({
    ...nycConfigTypescript,
    cwd: path.resolve(__dirname, "../../.."),
    reporter: ["html", "text-summary"],
    all: true,
    silent: false,
    instrument: true,
    hookRequire: true,
    hookRunInContext: true,
    hookRunInThisContext: true,
    include: ["out/**/*.js"],
    exclude: ["out/test/**"],
  });
  nyc.wrap();

  await nyc.createTempDirectory();
  await nyc.addAllFiles();

  await cb();

  await nyc.writeProcessIndex();
  nyc.maybePurgeSourceMapCache();
  await nyc.report();
}

function runMocha(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
    timeout: 5000,
  });

  const testsRoot = path.resolve(__dirname, "..");

  return new Promise((resolve, reject) => {
    glob("**/**.test.js", { cwd: testsRoot }, (err, files) => {
      if (err) {
        return reject(err);
      }

      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run((failures) => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}
