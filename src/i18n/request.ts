import { getRequestConfig } from "next-intl/server";
export default getRequestConfig(async ({ locale }) => {
  let messages;
  switch (locale) {
      case "ar": messages = (await import("../../messages/ar.json")).default; break;
      case "en": messages = (await import("../../messages/en.json")).default; break;
      case "es": messages = (await import("../../messages/es.json")).default; break;
      case "fr": messages = (await import("../../messages/fr.json")).default; break;

    default: messages = (await import("../../messages/en.json")).default; break;
  }
  return { locale: String(locale), messages };
});
