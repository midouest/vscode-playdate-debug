declare class NYC {
  config: any;

  subprocessBin: string;
  cwd: string;
  reporter: string[];
  cacheDirectory: string;
  cache: boolean;
  extensions: string[];
  exclude: any;
  sourceMaps: any;
  require: string[];
  transforms: { [ext: string]: any };
  hookRequire: boolean | undefined;
  hookRunInContext: boolean | undefined;
  hookRunInThisContext: boolean | undefined;
  fakeRequire: boolean | null;
  processInfo: any;
  hashCache: { [filename: string]: string };

  constructor(config: any);

  instrumenter(): any;
  addFile(filename: string): void;
  addAllFiles(): Promise<void>;
  instrumentAllFiles(input: string, output: string): Promise<void>;
  maybePurgeSourceMapCache(): void;
  createTempDirectory(): Promise<void>;
  reset(): Promise<void>;
  wrap(): ThisType<NYC>;
  writeCoverageFile(): void;
  getCoverageMapFromAllCoverageFiles(baseDirectory: string): Promise<any>;
  report(): Promise<void>;
  writeProcessIndex(): Promise<void>;
  showProcessTre(): Promise<void>;
  checkCoverage(thresholds: any, perFile: boolean): Promise<void>;
  coverageFiles(baseDirectory?: string): Promise<string[]>;
  coverageFileLoad(filename: string, baseDirectory?: string): Promise<any>;
  coverageData(baseDirectory: string): Promise<any>;
  tempDirectory(): string;
  reportDirectory(): string;
}

declare namespace NYC {}

declare module "nyc" {
  export = NYC;
}

declare var nycConfigTypescript: any;

declare module "@istanbuljs/nyc-config-typescript" {
  export = nycConfigTypescript;
}
