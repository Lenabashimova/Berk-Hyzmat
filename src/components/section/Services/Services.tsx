'use client'

import { useEffect, useMemo, useState } from "react";
import { getCompanyServices, getServiceCategories, apiLocale } from "@/services/services";
import type { CompanyService, ServiceCategoryBase } from "@/types/CompanyService";
import { useLanguage } from "@/context/LanguageContext";
import ServiceCard from '../../ui/ServiceCard/ServiceCard';
import type { Language } from "@/i18n";

type ServiceGroup = {
    key: string;
    category: ServiceCategoryBase | null; // null — услуги без категории
    services: CompanyService[];
};

const bySortOrder = <T extends { sortOrder?: number }>(a: T, b: T) =>
    (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

const findTranslation = <T extends { locale: string }>(
    translations: T[] | undefined,
    language: Language
) =>
    translations?.find(
        (translation) => translation.locale.toUpperCase() === apiLocale[language]
    );

const getTranslatedService = (
    service: CompanyService,
    language: Language
) => {
    const translation = findTranslation(service.translations, language);

    return {
        title: translation?.title ?? service.title,
        description: translation?.description ?? service.description,
    };
};

const getCategoryName = (
    category: ServiceCategoryBase,
    language: Language
) =>
    findTranslation(category.translations, language)?.name ?? category.name;

// Раскладывает услуги по категориям. Порядок — по sortOrder.
// Услуги без категории (или с удалённой/неизвестной) не теряются:
// они идут отдельной группой в конце, без заголовка.
const groupServices = (
    services: CompanyService[],
    categories: ServiceCategoryBase[]
): ServiceGroup[] => {
    const activeServices = services
        .filter((service) => !service.deletedAt)
        .sort(bySortOrder);

    const activeCategories = categories
        .filter((category) => !category.deletedAt)
        .sort(bySortOrder);

    const groups: ServiceGroup[] = activeCategories
        .map((category) => ({
            key: category.id,
            category,
            services: activeServices.filter(
                (service) => service.categoryId === category.id
            ),
        }))
        .filter((group) => group.services.length > 0);

    const knownCategoryIds = new Set(
        activeCategories.map((category) => category.id)
    );

    const uncategorized = activeServices.filter(
        (service) =>
            !service.categoryId ||
            !knownCategoryIds.has(service.categoryId)
    );

    if (uncategorized.length > 0) {
        groups.push({
            key: "uncategorized",
            category: null,
            services: uncategorized,
        });
    }

    return groups;
};

export default function Services() {
    const { t, language } = useLanguage();

    const [services, setServices] = useState<CompanyService[]>([]);
    const [categories, setCategories] = useState<ServiceCategoryBase[]>([]);

    // Какие категории сейчас открыты
    const [openCategories, setOpenCategories] = useState<
        Record<string, boolean>
    >({});

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            getCompanyServices(),

            // Если категории не загрузились —
            // всё равно показываем услуги
            getServiceCategories().catch((error) => {
                console.error(
                    "[Services] не удалось загрузить категории:",
                    error
                );

                return [] as ServiceCategoryBase[];
            }),
        ])
            .then(([servicesData, categoriesData]) => {
                if (cancelled) return;

                setServices(servicesData);
                setCategories(categoriesData);
            })
            .catch((error) =>
                console.error(
                    "[Services] не удалось загрузить услуги:",
                    error
                )
            );

        return () => {
            cancelled = true;
        };
    }, []);

    const groups = useMemo(
        () => groupServices(services, categories),
        [services, categories]
    );

    // Открыть / закрыть категорию
    const toggleCategory = (key: string) => {
        setOpenCategories((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <section
            id="programs"
            className="bg-[#222d65] py-12.5 px-12.5 lg:px-25 lg:py-25"
        >
            <div className="flex flex-col gap-8 lg:gap-18">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 leading-12">
                    <h1 className="text-[40px] font-semibold text-white lg:text-[80px] lg:leading-tight">
                        {t.services.title}
                    </h1>
                </div>

                <div className="flex flex-col gap-12 lg:gap-20">
                    {groups.map((group) => {
                        const isOpen =
                            openCategories[group.key] ?? false;

                        return (
                            <div
                                key={group.key}
                                className="flex flex-col"
                            >
                                {group.category ? (
                                    <>
                                        {/* Кнопка категории */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleCategory(group.key)
                                            }
                                            className="flex w-full items-center justify-between border-b border-white/30 pb-4 text-left"
                                            aria-expanded={isOpen}
                                        >
                                            <h2 className="text-[26px] cursor-pointer font-semibold hover:text-[#1FAC4D] leading-tight text-white lg:text-[40px]">
                                                {getCategoryName(
                                                    group.category,
                                                    language
                                                )}
                                            </h2>

                                            {/* Стрелка */}
                                            <svg
                                                className={`h-6 w-6 shrink-0 cursor-pointer hover:text-[#1FAC4D] text-white transition-transform duration-300 lg:h-10 lg:w-10 ${
                                                    isOpen
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M6 9L12 15L18 9"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>

                                        {/* Список услуг */}
                                        <div
                                            className={`grid transition-all duration-300 ease-in-out ${
                                                isOpen
                                                    ? "grid-rows-[1fr] opacity-100"
                                                    : "grid-rows-[0fr] opacity-0"
                                            }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="pt-6 lg:pt-10">
                                                    <div className="flex flex-col gap-7 lg:grid lg:grid-cols-2 lg:gap-x-20">
                                                        {group.services.map(
                                                            (service) => {
                                                                const translated =
                                                                    getTranslatedService(
                                                                        service,
                                                                        language
                                                                    );

                                                                const shortDescription =
                                                                    translated.description &&
                                                                    translated
                                                                        .description
                                                                        .length >
                                                                        200
                                                                        ? translated.description.slice(
                                                                              0,
                                                                              200
                                                                          ) +
                                                                          "..."
                                                                        : translated.description;

                                                                return (
                                                                    <ServiceCard
                                                                        key={
                                                                            service.id
                                                                        }
                                                                        title={
                                                                            translated.title
                                                                        }
                                                                        description={
                                                                            shortDescription
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Услуги без категории
                                    <div className="flex flex-col gap-7 lg:grid lg:grid-cols-2 lg:gap-x-20">
                                        {group.services.map(
                                            (service) => {
                                                const translated =
                                                    getTranslatedService(
                                                        service,
                                                        language
                                                    );

                                                const shortDescription =
                                                    translated.description &&
                                                    translated.description
                                                        .length > 200
                                                        ? translated.description.slice(
                                                              0,
                                                              200
                                                          ) + "..."
                                                        : translated.description;

                                                return (
                                                    <ServiceCard
                                                        key={service.id}
                                                        title={
                                                            translated.title
                                                        }
                                                        description={
                                                            shortDescription
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
