export type ServiceCategoryBase = {
    id: string;
    companyId: string;
    name: string;
    slug: string;
    description: string | null;
    sortOrder: number;
    showOnHomePage: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type ServiceCategory = ServiceCategoryBase & {
    services: CompanyService[];
};
export type ServiceTranslation = {
    id: string;
    serviceId: string;
    locale: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}; 
export type CompanyService = {
    id: string;
    companyId?: string;
    categoryId?: string;
    title: string;
    description: string;
    image?: string | null;
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    category: ServiceCategoryBase;
    translations?: ServiceTranslation[];
};