import EN from "./en";
import RU from "./ru";
import TK from "./tm";

export const translations = {
  en: EN,
  ru: RU,
  tm: TK,
};

export type Language = keyof typeof translations;