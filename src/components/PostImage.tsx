
import Image from "next/image";

type PostImageProps = {
    src?: string | null
    className?: string
}
export function PostImage({ src }: PostImageProps) {
    return (
    <div className={`relative overflow-hidden w-full`}>
        {src?.startsWith("http") ? (
                <Image src={src} alt="Post Image"
        quality={100} width={900} height={0} sizes="(min-width: 200px) 100vw, (max-width: 768px) 100%, (max-width: 1200px) 50vw, 33vw" className="px-0"/>
        ) : ("")}
    </div>
    );
}