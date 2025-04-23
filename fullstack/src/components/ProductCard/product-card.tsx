import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

interface ProductCardProps {
  key?: string;
  name?: string;
  price?: number;
  imageSrc?: string;
}

const isValidImageUrl = (url: string) =>
  /^(https?:\/\/.*|data:image\/(png|jpeg|jpg|gif|webp);base64,[a-zA-Z0-9+/=]+)$/i.test(
    url.trim(),
  );

export function ProductCard({
  name = "Mystic Artifact",
  price = 0.0,
  imageSrc = "/next.svg",
}: ProductCardProps) {
  return (
    <Card className="md:w-52 w-36 bg-zinc-900 border border-zinc-700 hover:border-indigo-500 shadow-md hover:shadow-indigo-500/40 group cursor-pointer transition-all duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-hidden md:h-40 h-24 w-full rounded-t-xl">
          <Image
            src={imageSrc}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start px-4 py-3">
        <p className="text-sm md:text-base font-semibold text-white truncate w-full">
          {name}
        </p>
        <p className="text-sm text-emerald-300">${price}</p>
      </CardFooter>
    </Card>
  );
}

interface ProductCardFullProps {
  key?: string;
  name: string;
  price: number;
  imageSrc?: string;
}

export function ProductCardFull({
  name = "Mystic Relic",
  price = 0.0,
  imageSrc = "/next.svg",
}: ProductCardFullProps) {
  return (
    <Card className="w-full h-fit min-h-[80vh] bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden group transition-all duration-500 hover:shadow-lg hover:shadow-indigo-500/30">
      <CardContent className="p-0">
        <div className="relative h-[70vh] w-full overflow-hidden">
          <Image
            src={isValidImageUrl(imageSrc) ? imageSrc : "/next.svg"}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start p-6">
        <p className="text-2xl font-semibold text-white tracking-wide">
          {name}
        </p>
        <p className="text-indigo-300 text-lg">${price}</p>
      </CardFooter>
    </Card>
  );
}
