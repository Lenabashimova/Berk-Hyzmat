"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { Language } from "@/i18n";

const languages: Language[] = ["tm", "ru", "en"];

export default function NewsHeader() {
    const router = useRouter();
    const pathname = usePathname();

    const currentLanguage = pathname.split("/")[1] as Language;

    const changeLanguage = (newLanguage: Language) => {
        const parts = pathname.split("/");

        parts[1] = newLanguage;

        const newPath = parts.join("/");

        router.replace(newPath, { scroll: false });
    };

    return (
        <header className="w-full py-6">
            <div className="flex items-center px-20 justify-between cursor-pointer">
                <Image
                    src="/logo-new.png"
                    width={300}
                    height={190}
                    alt="logo"
                />

                <div className="flex items-center gap-2 text-[#1FAC4D] text-[20px]">
                    {languages.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => changeLanguage(lang)}
                            className={`border border-[#1FAC4D] rounded-sm p-3 cursor-pointer transition-colors ${
                                currentLanguage === lang
                                    ? "bg-[#1FAC4D] text-white"
                                    : "hover:bg-[#1FAC4D] hover:text-white"
                            }`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}