'use client'
import { useLanguage } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image"
import Link from "next/link"
import type { Language } from "@/i18n";

const languages: Language[] = ["tm", "ru", "en"];

export default function Header(){
    const router = useRouter();
        
    
        const pathname = usePathname();
        const currentLanguage = pathname.split("/")[1] as Language;
    
        
    const { language, t, setLanguage } = useLanguage();

    const isNewsPage = pathname.includes("/news/");

    const changeLanguage = (newLanguage: Language) => {
        const parts = pathname.split("/");

        parts[1] = newLanguage;

        window.history.replaceState(
            null,
            "",
            parts.join("/")
        );

        setLanguage(newLanguage);
    };

    if (isNewsPage) {
        return null;
    }

    return(
        <>
            <header className={isNewsPage ? "" : "lg:sticky lg:top-0 lg:z-50 lg:h-0 "}>
                <div className="sm:mx-auto flex lg:h-20 h-12 items-center justify-between ">
                    {/* Mobile */}
                    <div className="flex w-full items-center bg-[#1756a6] justify-between lg:hidden">
                        <Image src="/logo.jpg" width={119} height={34} alt="logo"/>
                        <div className="flex items-center gap-2 text-white pr-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => changeLanguage(lang)}
                                    className={`border border-[#1FAC4D] rounded-sm p-1 text-[15px] cursor-pointer transition-colors ${
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
                    {/* Desktop */}
                    <div className="hidden w-full items-center justify-between lg:flex bg-[#1756a6] text-white lg:border-[white] lg:border-3 rounded-2xl px-19 py-5 mt-15 shadow-[0_8px_40px_rgba(0,0,0,0.5)] ">
                        <Image src="/logo.jpg" width={300} height={40} alt="logo" className="cursor-pointer"/>
                        <nav className="flex items-center gap-19">
                            <Link href={'#home'} className="cursor-pointer hover:[text-shadow:0_0_0_currentColor] hover:text-bold text-[30px]">{t.header.home}</Link>
                            <Link href={'#process'} className="cursor-pointer hover:[text-shadow:0_0_0_currentColor] hover:text-bold text-[30px]">{t.header.projects}</Link>
                            <Link href={'#programs'} className="cursor-pointer hover:[text-shadow:0_0_0_currentColor] hover:text-bold text-[30px]">{t.header.services}</Link>
                            <Link href={'#news'} className="cursor-pointer hover:[text-shadow:0_0_0_currentColor] hover:text-bold text-[30px]">{t.header.news}</Link>
                            <Link href={'#footer'} className="cursor-pointer hover:[text-shadow:0_0_0_currentColor] hover:text-bold text-[30px]">{t.header.contacts}</Link>
                        </nav>
                        <div className="flex items-center gap-2 lg:text-[17px] text-white">
                            {languages.map((lang) => (
                                <button key={lang} onClick={() => changeLanguage(lang)} className={`border-[#1FAC4D] border rounded-sm p-5 cursor-pointer ${language === lang? "bg-white text-[#1756a6]" : "hover:text-white hover:bg-[#1FAC4D]"}`}>
                                    {lang.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}