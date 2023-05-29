/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useSession } from "next-auth/react";
import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { type FormEvent } from "react";
import { api } from "~/utils/api";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import { CldUploadButton } from 'next-cloudinary';


function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
}

export function NewPostForm() {
    const session = useSession();
    if (session.status !== "authenticated") return null ;
    
    return <Form />
}

function Form() {
    const session = useSession();
    const [inputValue, setInputValue] = useState("");

    const textAreaRef = useRef<HTMLTextAreaElement>();
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => 
    {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea
    }, [])

    const trpcUtils = api.useContext()

    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current);
    }, [inputValue]);

    const createPost = api.post.create.useMutation({ 
        onSuccess: (newPost) => {
        setInputValue("");

        if (session.status !== "authenticated") {
            return
        } 

        trpcUtils.post.infiniteFeed.setInfiniteData({}, (oldData) => {
            if (oldData == null || oldData.pages[0] == null) return

            const newCachePost = {
                ...newPost,
                likeCount: 0,
                likedByMe: false,
                user: {
                    id: session.data.user.id,
                    name: session.data.user.name || null,
                    image: session.data.user.image || null,
                }
            }
            return {
                ...oldData,
                pages: [
                    {
                        ...oldData.pages[0],
                        posts: [newCachePost, ...oldData.pages[0].posts],
                    },
                    ...oldData.pages.slice(1)
                ]
            }
        })
        },
    }); 

    if (session.status !== "authenticated") return null;

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        createPost.mutate({ content: inputValue })
    }

    function handleOnUpload(result: any) {
        
        setInputValue(result?.info?.secure_url)
        createPost.mutate({ content: result?.info?.secure_url })
    }
    

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 border border-stone-800 px-4 py-2">
            <div className="flex gap-4">
            <ProfileImage src={session.data.user.image} />
            <textarea
            ref={inputRef}
            style={{ height: 0 }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="bg-stone-800 flex-grow resize-none overflow-hidden p-4 text-lg outline-none" placeholder="something to share?"/>
        </div>
        <Button className="self-end">Post</Button>
        <div>
            <CldUploadButton onUpload={handleOnUpload} uploadPreset="uploads" />
        </div>
        </form>
    );
}


