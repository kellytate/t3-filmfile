import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";
import ToggleButton from "./ToggleButton";

export function StickyNav () {
    const session = useSession()
    const user = session.data?.user

    return <nav className="sticky bottom-0 px-2 py-4 bg-white dark:bg-neutral-950 justify-center w-full">
        <ul className="flex flex-row justify-center gap-2 whitespace-nowrap">
        <li>
                <IconHoverEffect>
                    <span className="flex items-center gap-4">
                    <ToggleButton />
                    </span>
                </IconHoverEffect>
            </li>    
            <li>
                <Link href="/">
                    <IconHoverEffect>
                        <span className="flex items-center gap-4">
                        <VscHome className="h-6 w-6" />
                        <span className="hidden text-lg md:inline">home</span>
                        </span>
                    </IconHoverEffect>
                </Link>
            </li>
            {user != null && (
            <li>
                <Link href={`/profiles/${user.id}`}>
                    <IconHoverEffect>
                        <span className="flex items-center gap-4">
                            <VscAccount className="h-6 w-6" />
                            <span className="hidden text-lg md:inline">profile</span>
                        </span>
                    </IconHoverEffect>
                </Link>
            </li>
            )}
            {user == null ? (
                <li>
                    <button onClick={() => void signIn()}>
                    <IconHoverEffect>
                        <span className="flex items-center gap-4">
                        <VscSignIn className="h-6 w-6 fill-green-700" />
                        <span className="hidden text-lg md:inline text-green-700">log in</span>
                        </span>
                    </IconHoverEffect>
                    </button>
                </li>
            ) : <li>
            <button onClick={() => void signOut()}><IconHoverEffect>
                        <span className="flex items-center gap-4">
                        <VscSignOut className="h-6 w-6 fill-red-800" />
                        <span className="hidden text-lg md:inline text-red-800">log out</span>
                        </span>
                    </IconHoverEffect></button>
        </li>}
        </ul>
    </nav>;
}  