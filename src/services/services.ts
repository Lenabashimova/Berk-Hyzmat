import type { Project } from "@/types/Project";
import { Language } from "@/i18n";
import type { CompanyService, ServiceCategory } from "@/types/CompanyService";
import type { Post } from "@/types/Post";


const API_URL = process.env.NEXT_PUBLIC_API_URL;
const COMPANY_SLUG = process.env.NEXT_PUBLIC_COMPANY_SLUG;
export const apiLocale = {
    en: "EN",
    ru: "RU",
    tm: "TK",
} as const;

export async function getCompanyServices(): Promise<CompanyService[]> {
    const response = await fetch(
        `${API_URL}/api/v1/companies/${COMPANY_SLUG}/services`
    );
    console.log(`${API_URL}/api/v1/companies/${COMPANY_SLUG}/services`)
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
    const response = await fetch(
        `${API_URL}/api/v1/companies/${COMPANY_SLUG}/service-categories`
    );

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

export function getMediaUrl(path: string | null | undefined) {
    if (!path) return "";

    if (path.startsWith("http")) {
        return path;
    }

    return `${API_URL}${path}`;
}

export async function getProjects(
    language: Language
): Promise<Project[]> {
    const response = await fetch(
        `${API_URL}/api/v1/companies/${COMPANY_SLUG}/projects?locale=${apiLocale[language]}&type=IMAGE&deleted=false&show=true`
    );

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

export type PostsResponse = {
    data: Post[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
};

export async function getPosts(
    language: Language,
    page = 1,
    limit = 6
): Promise<PostsResponse> {
    const response = await fetch(
        `${API_URL}/api/v1/posts/public?locale=${apiLocale[language]}&page=${page}&limit=${limit}`
    );

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

export async function getPostBySlug(
    slug: string,
    language: Language
): Promise<Post> {
    const response = await fetch(
        `${API_URL}/api/v1/posts/public/${slug}?locale=${apiLocale[language]}`
    );

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://melhemli-turkmen-api.com";