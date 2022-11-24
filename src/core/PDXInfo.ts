/**
 * The pdxinfo metadata file is a simple key-value configuration format. Some of
 * the values are integers, but we don't attempt to convert any of the values to
 * their actual types.
 *
 * Currently only the name property is used.
 */
export interface PDXInfo {
  name?: string;
  author?: string;
  description?: string;
  bundleID?: string;
  version?: string;
  buildNumber?: string;
  imagePath?: string;
  launchSoundPath?: string;
  contentWarning?: string;
  contentWarning2?: string;
  [key: string]: string | undefined;
}
