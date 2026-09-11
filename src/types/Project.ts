export type ProjectTranslation = {
    id: string;
    projectId: string;
    locale: string;
    title: string;
    imageSrc?: string;
    description: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type Project = {
    id: string;
    companyId: string;
    title: string;
    slug: string;
    description: string | null;
    coverImage: string | null;
    status: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;

    translations?: ProjectTranslation[];
    translation?: ProjectTranslation;
};