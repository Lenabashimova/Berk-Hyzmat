import { notFound } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import { translations, Language } from "@/i18n";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function LanguageLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const normalizedLang = lang.toLowerCase() as Language;

    if (!(normalizedLang in translations)) {
        notFound();
    }

    return (
        <LanguageProvider language={normalizedLang}>
            <Header />
            {children}
            <Footer />
        </LanguageProvider>
    );
}