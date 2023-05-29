import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
    small?: boolean
    gray?: boolean
    className?: string
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function Button({
    small = false, 
    gray = false, 
    className="", 
    ...props
}: ButtonProps) {
    const sizeClasses = small ? "px-2 py-1" : "px-4 py-2"
    const colorClasses = gray 
        ? "bg-zinc-400 hover:bg-gray-300 focus-visible:bg-gray-300"
        : "hover:border-stone-400";

    return <button className={` border border-stone-800 transition-colors duration-200 
    disabled:cursor-not-allowed disabled:opacity-50 dark:text-white ${sizeClasses} 
    ${colorClasses} ${className}`} {...props}></button>;
}