import { type ReactNode } from "react"

type IconHoverEffectProps = {
    children: ReactNode
    red?: boolean
}

export function IconHoverEffect ({ children, red = false }: IconHoverEffectProps) {
    const colorClasses = red 
    ? "outline-red-900 hover:bg-red-900 rounded-full" 
    : "hover:text-stone-400 hover:outline outline-1"
    return <div className={`p-2 transition-colors duration-200 mx-1 ${colorClasses}`}>{children}</div>
}