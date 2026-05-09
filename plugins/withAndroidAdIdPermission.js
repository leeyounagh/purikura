/**
 * Ensures com.google.android.gms.permission.AD_ID is in the merged manifest.
 * Play Console requires this when the Advertising ID declaration says the app uses the ID.
 */
const { AndroidConfig, withAndroidManifest } = require("expo/config-plugins");

const AD_ID = "com.google.android.gms.permission.AD_ID";

function withAndroidAdIdPermission(config) {
  return withAndroidManifest(config, (config) => {
    AndroidConfig.Permissions.ensurePermissions(config.modResults, [AD_ID]);
    return config;
  });
}

module.exports = withAndroidAdIdPermission;
