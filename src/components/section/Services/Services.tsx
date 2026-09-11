'use client'

import { useEffect, useState } from "react";
import { getCompanyServices, apiLocale  } from "@/services/services";
import type { CompanyService } from "@/types/CompanyService";
import { useLanguage } from "@/context/LanguageContext";
import ServiceCard from '../../ui/ServiceCard/ServiceCard';
import type { Language } from "@/i18n";

const MAX_SERVICES = 6;

const getTranslatedService = (
    service: CompanyService,
    language: Language
) => {
    const translation = service.translations?.find(
        (translation) =>
            translation.locale === apiLocale[language]
    );

    return {
        title: translation?.title ?? service.title,
        description: translation?.description ?? service.description,
    };
};

export default function Services() {
    const { t, language } = useLanguage();
    const [services, setServices] = useState<CompanyService[]>([]);

    useEffect(() => {
        getCompanyServices()
            .then((data) => {
                const sorted = data
                    .filter((service) => !service.deletedAt)
                    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                    .slice(0, MAX_SERVICES);

                setServices(sorted);
            })
            .catch(console.error);
    }, []);

    return (
        <section id="programs" className="bg-[#222d65] py-12.5 px-12.5 lg:px-25 lg:py-25">
            <div className="flex flex-col gap-8 lg:gap-18">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 leading-12">
                    <h1 className="text-[40px] font-semibold text-white lg:text-[80px] lg:leading-tight">
                        {t.services.title}
                    </h1>
                </div>

                <div className="flex flex-col gap-7 lg:grid lg:grid-cols-2 lg:gap-x-20">
                    {services.map((service) => {
                        const translated = getTranslatedService(service, language);
                        const shortDescription =
                            translated.description && translated.description.length > 200
                                ? translated.description.slice(0, 200) + "..."
                                : translated.description;

                        return (
                            <ServiceCard
                                key={service.id}
                                title={translated.title}
                                description={shortDescription}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}