"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Card from "@/components/ui/Card/Card";
import { getProjects, apiLocale, API_BASE_URL } from "@/services/services";
import type { Project as ProjectType } from "@/types/Project";

const DESKTOP_PAGE_SIZE = 4;
const SWIPE_THRESHOLD = 50;

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
        x: 0,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? "-100%" : "100%",
    }),
};

export default function Project() {
    const { t, language } = useLanguage();

    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(0);

    const [isMobile, setIsMobile] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    useEffect(() => {
        getProjects(language)
            .then(setProjects)
            .catch(console.error);
    }, [language]);

    // Определяем мобильную версию
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1023px)");

        const handleChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        setIsMobile(mediaQuery.matches);

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    const pageSize = isMobile ? 1 : DESKTOP_PAGE_SIZE;

    const pageCount = Math.ceil(projects.length / pageSize);

    useEffect(() => {
        setCurrentPage(0);
        setDirection(0);
    }, [language, projects.length, isMobile]);

    const visibleProjects = useMemo(() => {
        const start = currentPage * pageSize;

        return projects.slice(start, start + pageSize);
    }, [projects, currentPage, pageSize]);

    const goToPage = (index: number) => {
        if (
            index === currentPage ||
            index < 0 ||
            index >= pageCount
        ) {
            return;
        }

        setDirection(index > currentPage ? 1 : -1);
        setCurrentPage(index);
    };

    // Начало свайпа
    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        if (!isMobile) return;

        setTouchStartX(event.clientX);
    };

    // Конец свайпа
    const handlePointerUp = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        if (!isMobile || touchStartX === null) return;

        const deltaX = event.clientX - touchStartX;

        setTouchStartX(null);

        // Слишком маленькое движение — считаем обычным тапом
        if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
            return;
        }

        if (deltaX < 0) {
            // Свайп влево → следующий проект
            goToPage(currentPage + 1);
        } else {
            // Свайп вправо → предыдущий проект
            goToPage(currentPage - 1);
        }
    };

    const handlePointerCancel = () => {
        setTouchStartX(null);
    };

    return (
        <section
            id="process"
            className="px-9 py-7.5 flex flex-col lg:gap-40 gap-12 lg:py-25 lg:px-25"
        >
            <div className="text-[#222d65] flex flex-col gap-10 lg:flex-row lg:justify-between items-center lg:gap-20">
                <h1 className="font-semibold leading-14 text-[48px] lg:text-[100px] lg:leading-tight">
                    {t.process.title}
                </h1>

                <p className="text-[20px] text-center lg:hidden">
                    {t.process.subtitle}
                </p>

                <p className="hidden lg:flex lg:max-w-250 lg:text-[20px] lg:text-balance">
                    {t.process.subtitle_lg}
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div
                    className="relative h-50 lg:min-h-80 mb-40"
                    style={{
                        touchAction: isMobile ? "pan-y" : "auto",
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                >
                    <AnimatePresence
                        mode="popLayout"
                        custom={direction}
                        initial={false}
                    >
                        <motion.div
                            key={currentPage}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                duration: 0.4,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className="absolute inset-0 grid gap-6 lg:flex lg:h-80 lg:gap-10 lg:justify-center"
                        >
                            {visibleProjects.map((project) => {
                                const translatedProject =
                                    project.translations?.find(
                                        (translation) =>
                                            translation.locale ===
                                            apiLocale[language]
                                    );

                                const title =
                                    translatedProject?.title ??
                                    project.title;
                                
                                    const imageSrc = `${API_BASE_URL}${project.coverImage}`

                                return (
                                    <Card
                                        key={project.id}
                                        title={title}
                                        imageSrc={imageSrc}
                                    />
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {pageCount > 1 && (
                    <div className="flex justify-center gap-3">
                        {Array.from({ length: pageCount }).map(
                            (_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => goToPage(index)}
                                    aria-label={`Страница ${index + 1}`}
                                    aria-current={
                                        currentPage === index
                                    }
                                    className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                                        currentPage === index
                                            ? "bg-[#B42226]"
                                            : "bg-[#0C233E]/25 hover:bg-[#0C233E]/50"
                                    }`}
                                />
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}