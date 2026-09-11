'use client'

import { useLanguage } from "@/context/LanguageContext";



export default function Homepage() {
    const { t } = useLanguage();
    return(
            <div id="home" className="relative bg-linear-to-l lg:bg-cover lg:bg-center lg:bg-no-repeat lg:bg-[url('/back-new.jpg')] from-[rgba(12,62,15,0.5)] to-[#077227]">
                <div className="hidden pointer-events-none lg:block absolute z-0 inset-0 lg:bg-linear-to-r lg:from-[#052e13d7] lg:via-[rgba(13,77,34,0.36)] lg:to-[rgba(31,172,77,0)] "></div>
                <div className="relative">
                    <section className="px-9">
                        <div className=" text-white mx-auto lg:mx-10 min-h-screen justify-center flex flex-col gap-15 lg:items-start lg:text-left">
                            <div className="flex flex-col gap-5 lg:gap-10">
                                <h1 className="text-[40px] max-w-250 font-semibold lg:hidden">{t.homepage.title}</h1>
                                <h1 className="text-[100px] max-w-400 font-semibold hidden lg:block leading-30">{t.homepage.title}</h1>
                                <p className="text-[20px] lg:text-[35px] max-w-300">{t.homepage.subtitle}</p>  
                            </div>
                        </div>
                    </section>
                </div>
            </div>
    )
}