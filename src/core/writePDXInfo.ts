import * as fs from "fs/promises";
import * as path from "path";

import { compareAlphabetic, sort } from "../util";

import { PDXInfo, PDXInfoKey } from "./PDXInfo";

const knownKeyOrder: PDXInfoKey[] = [
  "name",
  "author",
  "description",
  "bundleID",
  "version",
  "buildNumber",
  "imagePath",
  "launchSoundPath",
  "contentWarning",
  "contentWarning2",
];

export async function writePDXInfo(
  pdxInfo: PDXInfo,
  sourcePath: string
): Promise<void> {
  const knownKeys: string[] = knownKeyOrder;
  const unknownKeys = Object.keys(pdxInfo).filter(
    (key) => !knownKeys.includes(key)
  );
  const unknownKeyOrder = sort(unknownKeys, compareAlphabetic);
  const keyOrder = knownKeys.concat(unknownKeyOrder);

  const lines = [];
  for (const key of keyOrder) {
    const value = pdxInfo[key];
    if (value !== undefined) {
      lines.push(`${key}=${value}`);
    }
  }

  const infoPath = path.resolve(sourcePath, "pdxinfo");
  const data = lines.join("\n") + "\n";
  try {
    await fs.writeFile(infoPath, data);
  } catch (_err) {
    throw new Error(`Could not write pdxinfo file at ${infoPath}`);
  }
}
