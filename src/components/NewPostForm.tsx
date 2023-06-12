/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useSession } from "next-auth/react";
import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { type FormEvent } from "react";
import { api } from "~/utils/api";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import Image from "next/image"
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
    const [imageValue, setImageValue] = useState("");
    const ImagePreview = () => {
        return (
            <Image
            src={imageValue}
            alt="image to be uploaded"
            width={50}
            height={50}
            ></Image>
        )
    }
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
        setImageValue("");

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

        createPost.mutate({ content: inputValue, image: imageValue})
    }

    function handleOnUpload(result: any) {
        
        setImageValue(result?.info?.secure_url)

        // createPost.mutate({ image: imageValue })
    }
    

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 border dark:border-stone-800 pt-6 pb-4 px-4 py-2">
            <div className="flex gap-4">
            <ProfileImage src={session.data.user.image} />
            <textarea
            ref={inputRef}
            style={{ height: 0 }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className=" flex-grow resize-none overflow-hidden p-4 mb-4 text-lg outline-none dark:placeholder:text-stone-100 dark:bg-neutral-800" placeholder="say something..."/>
        </div>
        <div className="gap-4 flex justify-end items-center">
        {imageValue ? (<div className="flex justify-center px-0"><ImagePreview/></div>) : (
        <span className="border border-stone-800 p-2 hover:border-stone-400">
            <CldUploadButton onUpload={handleOnUpload} uploadPreset="uploads"  />
        </span>)}
        <Button className="self-end">Post</Button>
        </div>
        </form>
    );
}


