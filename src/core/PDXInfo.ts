export type PDXInfoKey =
  | "name"
  | "author"
  | "description"
  | "bundleID"
  | "version"
  | "buildNumber"
  | "imagePath"
  | "launchSoundPath"
  | "contentWarning"
  | "contentWarning2";

/**
 * The pdxinfo metadata file is a simple key-value configuration format. Some of
 * the values are integers, but we don't attempt to convert any of the values to
 * their actual types.
 */
export type PDXInfo = {
  [K in PDXInfoKey]?: string;
} & {
  [key: string]: string | undefined;
};
