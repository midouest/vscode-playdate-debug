import * as fs from "fs/promises";
import * as path from "path";

import { PDXInfo } from "./PDXInfo";

/**
 * getPDXInfo reads the metadata contained in the pdxinfo file in the source
 * directory.
 */
export async function getPDXInfo(sourcePath: string): Promise<PDXInfo> {
  const infoPath = path.resolve(sourcePath, "pdxinfo");
  let infoText: string;
  try {
    infoText = await fs.readFile(infoPath, "utf-8");
  } catch (err) {
    throw new Error(`Could not read pdxinfo file at ${infoPath}`);
  }
  const infoLines = infoText.split("\n");

  const pdxInfo: PDXInfo = {};
  for (const line of infoLines) {
    const i = line.indexOf("=");
    if (i === -1) {
      continue;
    }

    const key = line.slice(0, i);
    const value = line.slice(i + 1);
    pdxInfo[key] = value.trim();
  }

  return pdxInfo;
}
