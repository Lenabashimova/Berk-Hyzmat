import Image from "next/image";

type CardProps = {
    title: string;
    imageSrc: string;
    subtitle?: string;
    className?: string;
    contentClassName?: string;
    textClassName?: string;
    linkClassName?: string;
    iconClassName?: string;
};

export default function Card({
    title,
    imageSrc,
    className,
    contentClassName,
    textClassName,
}: CardProps) {
    return (
        <div className="relative w-full flex flex-col lg:h-100 items-center">
            <div className="relative w-full h-32 lg:h-100 rounded-2xl overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 1023px) 100vw, 25vw"
                    className="object-cover"
                />
            </div>
            <div
                className={`relative z-10 -mt-8 mx-4 flex items-center justify-center rounded-2xl bg-[#222d65] px-6 py-4 lg:px-10 ${className ?? ""} ${contentClassName ?? ""}`}
            >
                <h3
                    className={`text-white text-center font-semibold leading-tight lg:text-[20px] ${textClassName ?? ""}`}
                >
                    {title}
                </h3>
            </div>
        </div>
    );
}