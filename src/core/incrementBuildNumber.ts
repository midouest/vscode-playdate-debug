import { PDXInfo } from "./PDXInfo";

export function incrementBuildNumber(pdxInfo: PDXInfo): void {
  const { buildNumber: prevBuildNumber } = pdxInfo;

  let buildNumber = parseInt(prevBuildNumber ?? "");
  if (Number.isNaN(buildNumber)) {
    buildNumber = 1;
  } else {
    buildNumber += 1;
  }

  pdxInfo.buildNumber = `${buildNumber}`;
}
