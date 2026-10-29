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
    translations?: ServiceCategoryTranslation[];
};

export type ServiceCategory = ServiceCategoryBase & {
    services?: CompanyService[];
};


export type ServiceTranslation = {
    id: string;
    serviceId: string;
    locale: string;
    title: string;
    description: string;
}; 


export type CompanyService = {
    id: string;
    companyId?: string;
    categoryId?: string | null;
    title: string;
    description: string;
    image?: string | null;
    sortOrder?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    category?: ServiceCategoryBase | null;
    translations?: ServiceTranslation[];
};

export interface ServiceCategoryTranslation {
    id: string;
    categoryId: string;
    locale: string;
    name: string;
    description: string;
}