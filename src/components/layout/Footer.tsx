'use client'

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";


export default function Footer(){
    const { t } = useLanguage();
    return(
        <>
            <section id="footer" className="py-12.5 px-12.5 bg-[#222d65] lg:px-25 lg:py-25">
                <div className="flex flex-col gap-48">
                    <div className="flex flex-col lg:gap-25 gap-7">
                        <div className="flex flex-col gap-6 lg:gap-10 text-white ">
                            <h1 className="font-medium text-[40px] leading-13 lg:leading-tight lg:text-[80px]">{t.footer.title}</h1>
                            <p className='hidden lg:block max-w-228 lg:text-[24px]'>{t.footer.subtitle_lg}</p>
                            <span className="lg:hidden text-[16px] pr-9">{t.footer.subtitle}</span>
                        </div>
                        <div className="lg:flex justify-between items-end">
                            <div className="flex-col mb-48 lg:mb-0">
                                <p className="hidden lg:block text-[18px] text-[#A9A9A9] lg:max-w-200 mb-7">{t.footer.description}</p>
                                <div className="flex gap-3">
                                <input type="email" placeholder={t.footer.placeholder} className="bg-white rounded-3xl placeholder-[#FF7070] text-black lg:w-158 lg:h-15 lg:placeholder-[#A9A9A9] lg:text-start font-extralight text-[11px] lg:text-[20px] text-center py-2 px-6"/>
                                <button className="bg-white rounded-3xl text-[14px] text-[#0C233E] lg:text-[#A9A9A9] py-2 px-9 cursor-pointer lg:text-[20px] hover:bg-[#1FAC4D] hover:text-white">{t.footer.button}</button>
                                </div>
                            </div>
                            <div className="flex gap-20 text-white">
                                <div className="flex flex-col gap-10 lg:flex-row">
                                    <div className="flex flex-col gap-4">
                                        {/* <h3 className="text-[14px] lg:text-[20px] font-semibold">{t.footer.home}</h3>
                                        <nav className="flex flex-col gap-3 text-[14px] lg:text-[20px] font-thin">
                                            <Link href={'#'}  className='hover:text-[#B42226]'>{t.footer.aboutUs}</Link>
                                            <Link href={'#'} className='hover:text-[#B42226]'>{t.footer.collection}</Link>
                                            <Link href={'#'} className='hover:text-[#B42226]'>{t.footer.blogNews}</Link>
                                        </nav> */}
                                    </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[14px] lg:text-[20px] font-semibold">{t.footer.socials}</h3>
                                <nav className="flex flex-col gap-3 text-[14px] lg:text-[20px] font-thin">
                                    <Link href={'#'} className='hover:text-[##1FAC4D]'>{t.footer.instagram}</Link>
                                    <Link href={'#'} className='hover:text-[#1FAC4D]'>{t.footer.facebook}</Link>
                                    <Link href={'#'} className='hover:text-[#1FAC4D]'>{t.footer.tiktok}</Link>
                                </nav>
                            </div>
                        </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[14px] lg:text-[20px] font-semibold">{t.footer.security}</h3>
                                <nav className="flex flex-col gap-3 text-[14px] lg:text-[20px] font-thin">
                                    <Link href={'#'} className='hover:text-[#1FAC4D]'>{t.footer.privacy}</Link>
                                    <Link href={'#'} className='hover:text-[#1FAC4D]'>{t.footer.copyrights}</Link>
                                    <Link href={'#'} className='hover:text-[#1FAC4D]'>{t.footer.userAgreements}</Link>
                                </nav>
                            </div>
                            </div>
                    </div>  
                    </div>
                </div>
                

            </section>
        </>
    )
}