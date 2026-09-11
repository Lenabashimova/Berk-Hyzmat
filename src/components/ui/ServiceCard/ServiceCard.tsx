import Image from 'next/image';


type ServiceCardProps = {
    image?: string;
    title: string;
    description: string;
};


export default function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <div className="flex flex-col justify-between h-full bg-white p-6 rounded-2xl text-[#0c1838]">
      <div>
        <h3 className="lg:text-[25px] font-bold mb-3">{title}</h3>
        <p className="text-sm font-light text-[#0c1838] leading-relaxed lg:text-[20px]">
          {description}
        </p>
      </div>
      {/* <div className="mt-6 text-right">
        <span className="text-xs text-[#0c1838] font-light cursor-pointer hover:underline">
          See More...
        </span>
      </div> */}
    </div>
  );
}