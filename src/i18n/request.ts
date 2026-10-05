import { getRequestConfig } from "next-intl/server";
export default getRequestConfig(async ({ locale }) => {
  let messages;
  try {
    switch (locale) {
      case "zh": messages = (await import("../../messages/zh.json")).default; break;
      case "es": messages = (await import("../../messages/es.json")).default; break;
      case "fr": messages = (await import("../../messages/fr.json")).default; break;
      case "ar": messages = (await import("../../messages/ar.json")).default; break;
      default: messages = (await import("../../messages/en.json")).default; break;
    }
  } catch(e) {
    // If nested differently, try one directory up
    try {
      switch (locale) {
        case "zh": messages = (await import("../messages/zh.json")).default; break;
        case "es": messages = (await import("../messages/es.json")).default; break;
        case "fr": messages = (await import("../messages/fr.json")).default; break;
        case "ar": messages = (await import("../messages/ar.json")).default; break;
        default: messages = (await import("../messages/en.json")).default; break;
      }
    } catch(e2) {}
  }
  return { locale, messages };
});
