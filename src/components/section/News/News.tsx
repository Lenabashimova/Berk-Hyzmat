"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DOMPurify from "dompurify";

import { useLanguage } from "@/context/LanguageContext";
import { getMediaUrl, getPosts, apiLocale } from "@/services/services";

import type { Post } from "@/types/Post";
import type { Language } from "@/i18n";
import Link from "next/link";

const PAGE_SIZE = 6; // сколько постов запрашиваем у сервера за раз
const TARGET_BATCH = 6; // сколько ПЕРЕВЕДЁННЫХ постов хотим получить за один клик/загрузку

// Гоняет запросы к серверу постранично, пока не наберёт targetCount постов
// с нужным переводом, либо пока не закончатся страницы на сервере.
async function fetchFilteredBatch(
    language: Language,
    startPage: number,
    targetCount: number
): Promise<{ posts: Post[]; lastPage: number; totalPages: number }> {
    let collected: Post[] = [];
    let page = startPage;
    let totalPages = Infinity;

    while (collected.length < targetCount) {
        const nextPage = page + 1;
        const { data, meta } = await getPosts(language, nextPage, PAGE_SIZE);

        totalPages = meta.pages;
        page = nextPage;

        const filtered = data.filter(
            (post) => post.translation?.locale === apiLocale[language]
        );
        collected = [...collected, ...filtered];

        if (page >= totalPages) break; // на сервере больше нет страниц
    }

    return { posts: collected, lastPage: page, totalPages };
}

export default function News() {
    const { t, language } = useLanguage();

    const [posts, setPosts] = useState<Post[]>([]);
    const [serverPage, setServerPage] = useState(0);
    const [totalServerPages, setTotalServerPages] = useState(1);
    const [revealSteps, setRevealSteps] = useState(1); // для мобильной раскрутки 3 → 6 → 9 ...
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // сколько постов было видно ДО смены языка — столько же постараемся восстановить
        const targetCount = Math.max(posts.length, PAGE_SIZE);
        let cancelled = false;

        setLoading(true);

        fetchFilteredBatch(language, 0, targetCount)
            .then(({ posts: newPosts, lastPage, totalPages }) => {
                if (cancelled) return;

                setPosts(newPosts);
                setServerPage(lastPage);
                setTotalServerPages(totalPages);
                setRevealSteps(
                    Math.max(1, Math.ceil(newPosts.length / PAGE_SIZE))
                );
            })
            .catch(console.error)
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const loadMore = () => {
        if (loading || serverPage >= totalServerPages) return;

        setLoading(true);

        fetchFilteredBatch(language, serverPage, TARGET_BATCH)
            .then(({ posts: newPosts, lastPage, totalPages }) => {
                setPosts((prev) => [...prev, ...newPosts]);
                setServerPage(lastPage);
                setTotalServerPages(totalPages);
                setRevealSteps((prev) => prev + 1);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const renderPost = (post: Post) => {
        const rawDescription =
            post.translation?.content ??
            post.content ??
            "";

        const cleanDescription = DOMPurify.sanitize(rawDescription);

        // убираем HTML-теги, чтобы получить чистый текст для превью на карточке
        const plainDescription = cleanDescription.replace(/<[^>]*>/g, "");

        const shortDescription =
            plainDescription.length > 200
                ? plainDescription.slice(0, 200) + "..."
                : plainDescription;

        return (
            <article
                key={post.id}
                className="flex flex-col overflow-hidden rounded-xl bg-[#EEF2FF]"
            >
                <div className="relative h-55 w-full overflow-hidden">
                    {post.coverImageUrl && (
                        <Image
                            src={getMediaUrl(post.coverImageUrl)}
                            alt={
                                post.coverAltText ??
                                post.translation?.title ??
                                post.title
                            }
                            fill
                            className="object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-[20px] font-semibold leading-7 text-[#222d65]">
                        {post.translation?.title ?? post.title}
                    </h2>

                    <p className="mt-4 text-[16px] leading-6 text-[#222d65]">
                        {shortDescription}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                        <Link
                            href={`/${language}/news/${post.slug}`}
                            className="shrink-0 whitespace-nowrap rounded-lg bg-white px-5 py-2 text-[16px] font-medium text-[#1FAC4D] hover:bg-[#0d5525ce] hover:text-white transition cursor-pointer shadow-md text-center"
                        >
                            {t.testimonials.readMore}
                        </Link>

                        <span className="shrink-0 whitespace-nowrap text-[16px] text-[#1FAC4D]">
                            {new Date(
                                post.publishedAt
                            ).toLocaleDateString("en-GB")}
                        </span>
                    </div>
                </div>
            </article>
        );
    };

    return (
        <section
            id="news"
            className="px-12.5 lg:px-25 mb-25"
        >
            <div className="flex flex-col gap-6 lg:gap-13">

                {/* Header */}
                <div className="flex flex-col lg:justify-center items-center gap-4 leading-12">
                    <hr className="border-2 border-[#1FAC4D] w-350 flex mb-30"/>
                    <h1 className="text-[40px] lg:hidden font-semibold text-[#222d65]">
                        {t.testimonials.title}
                    </h1>

                    <h1 className="hidden lg:block mb-15 text-[80px] font-semibold text-[#222d65] pl-2">
                        {t.testimonials.title}
                    </h1>

                </div>

                {/* Mobile — 3 → 6 → 9 → ... */}
                <div className="grid gap-6 lg:hidden">
                    {posts
                        .slice(0, revealSteps * 3)
                        .map(renderPost)}
                </div>

                {/* Desktop — все загруженные посты */}
                <div className="hidden gap-6 lg:grid lg:grid-cols-3">
                    {posts.map(renderPost)}
                </div>

                {serverPage < totalServerPages && (
                    <div className="flex justify-center py-8">
                        <button
                            onClick={loadMore}
                            disabled={loading}
                            className="rounded-lg bg-[#1FAC4D] px-9 py-4 text-[20px] text-white transition hover:bg-[#0d5525] cursor-pointer disabled:opacity-50"
                        >
                            {loading ? t.testimonials.loading : t.testimonials.loadMore}
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
}