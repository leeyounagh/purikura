export type CropMessages = {
  cropRemovingBg: string;
  cropCancel: string;
  cropDone: string;
  cropAlertNoApiKeyTitle: string;
  cropAlertNoApiKeyMessage: string;
  cropAlertNoticeTitle: string;
  cropAlertServiceUnavailable: string;
};

export const messages: Record<"ko" | "ja" | "en", CropMessages> = {
  ko: {
    cropRemovingBg: "배경 제거 중...",
    cropCancel: "취소",
    cropDone: "완료",
    cropAlertNoApiKeyTitle: "API 키 없음",
    cropAlertNoApiKeyMessage:
      "EXPO_PUBLIC_REMOVE_BG_API_KEY를 설정하세요.",
    cropAlertNoticeTitle: "알림",
    cropAlertServiceUnavailable:
      "해당 기능은 현재 이용할 수 없습니다.\n잠시 후 다시 시도해 주세요.",
  },
  ja: {
    cropRemovingBg: "背景を削除しています...",
    cropCancel: "キャンセル",
    cropDone: "完了",
    cropAlertNoApiKeyTitle: "APIキーがありません",
    cropAlertNoApiKeyMessage:
      "EXPO_PUBLIC_REMOVE_BG_API_KEY を設定してください。",
    cropAlertNoticeTitle: "お知らせ",
    cropAlertServiceUnavailable:
      "この機能は現在ご利用いただけません。\nしばらくしてから再度お試しください。",
  },
  en: {
    cropRemovingBg: "Removing background...",
    cropCancel: "Cancel",
    cropDone: "Done",
    cropAlertNoApiKeyTitle: "Missing API key",
    cropAlertNoApiKeyMessage: "Set EXPO_PUBLIC_REMOVE_BG_API_KEY.",
    cropAlertNoticeTitle: "Notice",
    cropAlertServiceUnavailable:
      "This feature is unavailable right now.\nPlease try again later.",
  },
};

export type MessageKey = keyof CropMessages;
