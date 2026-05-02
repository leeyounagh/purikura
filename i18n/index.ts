import * as Localization from "expo-localization";
import { messages, type MessageKey } from "./locales";

export type AppLocale = keyof typeof messages;

/**
 * Device locale → UI language: Korea → Korean, Japan → Japanese, otherwise English.
 * Uses primary locale languageCode and regionCode from expo-localization.
 */
export function getAppLocale(): AppLocale {
  const primary = Localization.getLocales()[0];
  if (!primary) return "en";

  const lang = primary.languageCode ?? "";
  const region = primary.regionCode ?? "";

  if (lang === "ko" || region === "KR") return "ko";
  if (lang === "ja" || region === "JP") return "ja";
  return "en";
}

export function t(key: MessageKey): string {
  return messages[getAppLocale()][key];
}
