"use client"
import React from 'react'
import { useTheme } from "next-themes";
import { VscColorMode } from 'react-icons/vsc';


const ToggleButton = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <button
            onClick={() => theme == "dark"? setTheme('light'): setTheme("dark")}
            className=' transition-all duration-100 '>
            <VscColorMode className="h-6 w-6" />
        </button>
    )
}

export default ToggleButton