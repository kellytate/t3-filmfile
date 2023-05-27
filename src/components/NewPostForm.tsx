import { useSession } from "next-auth/react";
import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { type FormEvent } from "react";
import { api } from "~/utils/api";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
    if (textArea == null) return
    textArea.style.height = "0"
    textArea.style.height = `${textArea.scrollHeight}px`
}

export function NewPostForm() {
    const session = useSession();
    if (session.status !== "authenticated") return null;
    
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

    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current);
    }, [inputValue]);

    const createPost = api.post.create.useMutation({ onSuccess:
    newPost => {
        setInputValue("");
        },
    }); 

    if (session.status !== "authenticated") return null;

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        createPost.mutate({ content: inputValue })
    }
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b px-4 py-2">
            <div className="flex gap-4">
            <ProfileImage src={session.data.user.image} />
            <textarea
            ref={inputRef}
            style={{ height: 0 }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none" placeholder="something to share?"/>
        </div>
        <Button className="self-end">Post</Button>
        </form>
    );
}
