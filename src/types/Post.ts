export type PostTranslation = {
    id: string;
    postId: string;
    locale: string;
    title: string;
    excerpt: string | null;
    content: string;
    coverMediaId: string | null;
    coverImageUrl: string | null;
    coverAltText: string | null;
    createdAt: string;
    updatedAt: string;
};

export type Post = {
    id: string;
    companyId: string | null;
    createdBy: string;

    title: string;
    slug: string;
    excerpt: string | null;
    content: string;

    coverMediaId: string | null;
    coverImageUrl: string | null;
    coverAltText: string | null;

    type: string;
    status: string;
    isGlobal: boolean;
    sortOrder: number;

    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    translation: PostTranslation;
};