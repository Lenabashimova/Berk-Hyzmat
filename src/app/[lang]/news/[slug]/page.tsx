import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

import { getPostBySlug, getPosts, getMediaUrl, apiLocale } from "@/services/services";
import { translations, Language } from "@/i18n";
import NewsHeader from "@/components/layout/NewsHeader";

export default async function NewsPostPage({
    params,
}: {
    params: Promise<{ lang: Language; slug: string }>;
}) {
    const { lang, slug } = await params;
    const t = translations[lang];

    let post;
    try {
        post = await getPostBySlug(slug, lang);
    } catch {
        notFound();
    }

    const rawDescription = post.translation?.content ?? post.content ?? "";
    const cleanDescription = DOMPurify.sanitize(rawDescription);

    let sidebarPosts: typeof post extends infer T ? T[] : never = [];
    try {
        const { data } = await getPosts(lang, 1, 6);
        sidebarPosts = data
            .filter((p) => p.slug !== slug)
            .filter((p) => p.translation?.locale === apiLocale[lang])
            .slice(0, 4);
    } catch {
        // если не получилось — просто не покажем сайдбар с новостями
    }

    const dateLocale: Record<Language, string> = {
    en: "en-GB",
    ru: "ru-RU",
    tm: "tk-TM",
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString(dateLocale[lang], {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    const formatTime = (date: string) =>
        new Date(date).toLocaleTimeString(dateLocale[lang], {
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <div className="px-9 py-10 lg:pb-30 lg:px-0 lg:py-0">
            <NewsHeader/>
            <div className="mx-auto mt-10 max-w-[1950px]">
                <Link
                    href={`/${lang}`}
                    className="flex gap-2 text-[23px] items-center font-medium text-[#1FAC4D] hover:text-[#1c5830] transition mb-8"
                >
                    <ArrowLeft size={22} />
                    {t.testimonials.backHome}
                </Link>

                <div className="grid lg:gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">

                    {/* Main article */}
                    <article>
                        <h1 className="text-[28px] lg:text-[40px] font-bold leading-tight text-[#0C233E] mb-4">
                            {post.translation?.title ?? post.title}
                        </h1>

                        <div className="flex items-center gap-2 text-[14px] text-gray-500 mb-6">
                            <Clock size={16} />
                            <span>
                                {formatDate(post.publishedAt)} | {formatTime(post.publishedAt)}
                            </span>
                        </div>

                        {post.coverImageUrl && (
                            <div className="relative h-64 lg:h-105 w-full overflow-hidden rounded-xl mb-8">
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
                            </div>
                        )}

                        <div
                            className="text-[20px] leading-7 text-justify text-[#0C233E] [&_p]:mb-4 last:[&_p]:mb-0"
                            dangerouslySetInnerHTML={{ __html: cleanDescription }}
                        />
                    </article>

                    {/* Sidebar */}
                    {sidebarPosts.length > 0 && (
                        <aside className="min-w-0">
                            <h2 className="text-[32px] font-bold text-[#1FAC4D] mb-6">
                                {t.testimonials.moreNews}
                            </h2>

                            <div className="flex flex-col gap-5">
                                {sidebarPosts.map((sidePost) => (
                                    <Link
                                        key={sidePost.id}
                                        href={`/${lang}/news/${sidePost.slug}`}
                                        className="flex gap-4 group min-w-0"
                                        >
                                        {sidePost.coverImageUrl && (
                                            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                                                <Image
                                                    src={getMediaUrl(sidePost.coverImageUrl)}
                                                    alt={
                                                        sidePost.coverAltText ??
                                                        sidePost.translation?.title ??
                                                        sidePost.title
                                                    }
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="min-w-0 flex flex-col justify-center">
                                            <h3 className="text-[16px] font-medium leading-snug text-[#0C233E] line-clamp-3 group-hover:text-[#B42226] transition-colors">
                                                {sidePost.translation?.title ?? sidePost.title}
                                            </h3>
                                            <div className="flex items-center gap-1 text-[15px] text-gray-400 mt-2 whitespace-nowrap">
                                                <Clock size={12} className="shrink-0" />
                                                <span>
                                                    {formatTime(sidePost.publishedAt)}{" "}
                                                    {formatDate(sidePost.publishedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}