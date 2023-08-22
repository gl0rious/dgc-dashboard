import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "ra-language-english";
import frenchMessages from "ra-language-french";

const en = {
  ...englishMessages,
  export: {
    wrong_format: "Wrong exported document format (TXT/PDF)!",
  },
};

const fr = {
  ...frenchMessages,
  export: {
    wrong_format: "Format d'export incorrect (TXT/PDF)!",
  },
};

const translations = { en, fr };

export const i18nProvider = polyglotI18nProvider(
  (locale) => translations[locale],
  "fr", // default locale
  [
    // { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
  ]
);
