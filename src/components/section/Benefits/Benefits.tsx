
'use client'

import { useLanguage } from "@/context/LanguageContext";
import Card from "@/components/ui/Card/Card"

import { useEffect, useState } from "react";
import { getCompanyServices } from "@/services/services";
import type { CompanyService } from "@/types/CompanyService";
import { Language } from "@/i18n";


export default function Benefits(){    
   const [services, setServices] = useState<CompanyService[]>([]);
   const getTranslatedService = (
        service: CompanyService,
        language: Language
    ) => {
        const translation = service.translations?.find(
            (translation) =>
                translation.locale.toLowerCase() === language.toLowerCase()
        );

        return {
            title: translation?.title ?? service.title,
            description: translation?.description ?? service.description,
        };
    };
    useEffect(() => {
        getCompanyServices()
            .then((data) => {
                const homeServices = data
                    .filter((service) => service.category.showOnHomePage)
                    .slice(0, 6);

                setServices(homeServices);
            })
            .catch(console.error);
    }, []);
    const { t, language } = useLanguage();
    return(
        <>
        <section className="py-9 px-9 lg:my-25 lg:px-25">
            <div className="flex flex-col text-center gap-4 lg:gap-12 mb-11 lg:mb-25">
                {/* <h2 className="font-semibold lg:text-[80px] text-[38px] text-center text-[#0C1736] lg:leading-14 leading-tight ">{t.benefits.title}</h2>
                <p className="text-[16px] text-[#0C1736] lg:max-w-205 lg:self-center lg:text-[24px] lg:font-extralight">{t.benefits.subtitle}</p> */}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                {services.map((service, index)=>{
                    const translated = getTranslatedService(service, language);
                    return(
                    <div key={service.id} className={index >=3 ? 'hidden lg:block' : ''}>
                    <Card  title={translated.title} subtitle={translated.description?.length > 200 ? translated.description?.slice(0, 200) + "..." : translated.description} className='lg:items-start lg:gap-3 lg:max-w-140 lg:h-50' linkClassName='lg:text-[12px] self-end' contentClassName="lg:text-[20px]" iconClassName='lg:w-7 lg:h-7' textClassName="lg:text-[15px]"/> 
                    </div>
                )})}
            </div>
        </section>
        </>
    )
}