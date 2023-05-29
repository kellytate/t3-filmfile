import { type ReactNode } from "react"

type IconHoverEffectProps = {
    children: ReactNode
    red?: boolean
}

export function IconHoverEffect ({ children, red = false }: IconHoverEffectProps) {
    const colorClasses = red 
    ? "outline-red-900 hover:bg-red-900 group-hover-bg-red-200 group-focus-visible:bg-red-900 focus-visible:bg-red-900" 
    : "outline-stone-600 hover:bg-stone-600 group-hover-bg-stone-600 group-focus-visible:bg-stone-600 focus-visible:bg-stone-600"
    return <div className={` p-2 transition-colors duration-200 ${colorClasses}`}>{children}</div>
}