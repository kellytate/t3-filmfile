import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { ProfileImage } from "./ProfileImage";
import { PostImage } from "./PostImage";
import { VscHeart, VscHeartFilled } from "react-icons/vsc"
import { useSession } from "next-auth/react";
import { IconHoverEffect } from "./IconHoverEffect";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";

type Post = {
    id: string
    content: string | null
    image: string | null
    createdAt: Date
    likeCount: number;
    likedByMe: boolean;
    user: { id: string; image: string | null; name: string | null };
};

type InfinitePostListProps = {
    isLoading: boolean,
    isError: boolean,
    hasMore: boolean | undefined,
    fetchNewPosts: () => Promise<unknown>
    posts?: Post[]
}

export function InfinitePostList({
    posts, 
    isError, 
    isLoading, 
    hasMore = false, 
    fetchNewPosts }: InfinitePostListProps) {
    if (isLoading) return <LoadingSpinner />
    if (isError) return <h1>Error...</h1>
    if (posts == null || posts.length === 0) {
        return <h2 className="my-4 text-center text-2xl text-gray-500">No Posts</h2>
    }
    return <ul>
        <InfiniteScroll
        className="dark:bg-neutral-950"
        dataLength={posts.length}
        next={fetchNewPosts}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
        >
            {posts.map(post => {
                                // console.log(post)

                return <PostCard key={post.id} {...post} />
            })}
        </InfiniteScroll>
    </ul>
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "short" })

function PostCard({ 
    id,
    user, 
    content,
    image, 
    createdAt, 
    likeCount, 
    likedByMe,
}: Post) {
    const trpcUtils = api.useContext()
    const toggleLike = api.post.toggleLike.useMutation({ 
        onSuccess: ({ addedLike }) => {
            const updateData: Parameters<typeof trpcUtils.post.infiniteFeed.
            setInfiniteData>[1] = (oldData) => {
                if (oldData == null) return

                const countModifier = addedLike ? 1 : -1

                return {
                    ...oldData,
                    pages: oldData.pages.map(page => {
                        return {
                            ...page,
                            posts: page.posts.map(post => {
                                if (post.id === id) {
                                    return {
                                        ...post,
                                        likeCount: post.likeCount + countModifier,
                                        likedByMe: addedLike
                                    }
                                }

                                return post
                            })
                        }
                    })
                }
            }

            trpcUtils.post.infiniteFeed.setInfiniteData({}, updateData);
            trpcUtils.post.infiniteFeed.setInfiniteData({ onlyFollowing: true }, updateData);
            trpcUtils.post.infiniteProfileFeed.setInfiniteData({ userId: user.id }, updateData);
        },
    });

    function handleToggleLike() {
        toggleLike.mutate({ id })
    }

    return (
        <li className={`flex w-full gap-4 border dark:border-stone-800 px-0 py-4 mr-0`}>
            
            <div className="flex flex-col w-full">
                <div className="flex gap-1 px-2 py-4">
                    <Link href={`/profiles/${user.id}`}>
                        <ProfileImage src={user.image} />
                    </Link>
                    <Link
                        href={`/profiles/${user.id}`}
                        className="font-bold hover:underline focus-visible:underline
                        outline-none"
                    >
                        {user.name}
                    </Link>
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-500">{dateTimeFormatter.format(createdAt)}</span>
                </div>
                {/* {content?.startsWith("https://res.cloudinary.com") ? (<div className="flex justify-center px-0"><PostImage src={content} /></div>) : (<p className="whitespace-pre-wrap">{content}</p>)} */}
                { image ? (<div className="flex justify-center">
                    <div className="flex px-0">
                        <PostImage src={image}/>
                    </div>
                </div>) : <div></div> }        
                { content ? (<div className="flex px-2 py-2"><p className="whitespace-pre-wrap">{content}</p></div>) : <div></div>}
                <div className="px-2">
                    <HeartButton onClick={handleToggleLike} isLoading={toggleLike.isLoading} likedByMe={likedByMe} likeCount={likeCount}/>
                </div>
            </div>

        </li>
    );
}

type HeartButtonProps = {
    onClick: () => void,
    isLoading: boolean,
    likedByMe: boolean;
    likeCount: number;
}

function HeartButton({ likedByMe, likeCount, isLoading, onClick }: HeartButtonProps) {

    const session = useSession()
    const HeartIcon = likedByMe ? VscHeartFilled : VscHeart

    if (session.status !== "authenticated") {
        return (
            <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
                <HeartIcon />
                <span>{likeCount}</span>
            </div>
        )
    }
    return (
        <button 
        disabled={isLoading}
        onClick={onClick}
        className={`group -ml-2 flex items-center gap-1 self-start transition-colors
        duration-200 ${
            likedByMe 
            ? "text-red-500"
            : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
        }`}
        >   
            <IconHoverEffect red>
                <HeartIcon className={`transition-colors duration-200 ${
                    likedByMe 
                    ? "fill-red-500"
                    : "group-hover:fill-red-500 fill-gray-500 group-focus-visible:fill-red-500"
                    }`}
                />
            </IconHoverEffect>
            <span>{likeCount}</span>
        </button>
    );
}