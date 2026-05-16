/**
 * Overrides react-native-google-mobile-ads app IDs from environment variables
 * so real AdMob IDs are kept out of the public repo.
 *
 * Set EXPO_PUBLIC_ADMOB_ANDROID_APP_ID (and EXPO_PUBLIC_ADMOB_IOS_APP_ID for iOS)
 * in .env.local for local builds and in EAS environment for production builds.
 * If unset, app.json's Google test IDs are used as safe fallbacks.
 */
module.exports = ({ config }) => ({
  ...config,
  plugins: (config.plugins || []).map((p) =>
    Array.isArray(p) && p[0] === "react-native-google-mobile-ads"
      ? [
          p[0],
          {
            ...p[1],
            androidAppId:
              process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID ?? p[1].androidAppId,
            iosAppId:
              process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID ?? p[1].iosAppId,
          },
        ]
      : p
  ),
});
