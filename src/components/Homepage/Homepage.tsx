'use client'

import { useLanguage } from "@/context/LanguageContext";



export default function Homepage() {
    const { t } = useLanguage();
    return(
            <div id="home" className="relative bg-linear-to-l lg:bg-cover lg:bg-center lg:bg-no-repeat lg:bg-[url('/back.png')] from-[rgba(17,91,175,0.5)] to-[#222d65]">
                <div className="hidden pointer-events-none lg:block absolute z-0 inset-0 lg:bg-linear-to-r lg:from-[rgba(12,35,62,0)] lg:via-[rgba(12,35,62,0.6)] lg:to-[#062b5ca2] "></div>
                <div className="relative">
                    <section className="px-9">
                        <div className=" text-white mx-auto lg:mx-20 min-h-screen justify-center flex flex-col gap-15 lg:items-end lg:text-right">
                            <div className="flex flex-col gap-5 lg:gap-15">
                                <h1 className="text-[40px] max-w-200 font-semibold lg:hidden">{t.homepage.title}</h1>
                                <h1 className="text-[110px] max-w-330 font-semibold hidden lg:block leading-30">{t.homepage.title}</h1>
                                <p className="text-[20px] lg:text-[35px] max-w-330">{t.homepage.subtitle}</p>  
                            </div>
                        </div>
                    </section>
                </div>
            </div>
    )
}