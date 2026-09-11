"use client";

import {
    createContext,
    useContext,
    ReactNode,
    useState,
} from "react";

import { translations, Language } from "@/i18n";

type LanguageContextType = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: typeof translations[Language];
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
    children,
    language: initialLanguage,
}: {
    children: ReactNode;
    language: Language;
}) {
    const [language, setLanguage] = useState<Language>(initialLanguage);

    const value: LanguageContextType = {
        language,
        setLanguage,
        t: translations[language],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}