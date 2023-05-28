
import Image from "next/image";
import { VscAccount } from "react-icons/vsc";

type PostImageProps = {
    src?: string | null
    className?: string
}
export function PostImage({ src, className = ""}: PostImageProps) {
    return (
    <div className={`relative h-200 w-500 overflow-hidden
    ${className}`}>
        {src?.startsWith("http") ? (
                <Image src={src} alt="Post Image"
        quality={100} width="768" height="200" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
        ) : ("")}
    </div>
    );
}