/**
 * Expo Router requires a `_layout.tsx` without a platform extension whenever
 * `_layout.native.tsx` / `_layout.web.tsx` exist. This file is the route-tree fallback;
 * Metro still resolves `_layout.native.tsx` on Android/iOS and `_layout.web.tsx` on web.
 */
export { default } from "./_layout.native";
