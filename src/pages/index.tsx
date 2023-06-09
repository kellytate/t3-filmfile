import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { InfinitePostList } from "~/components/InfinitePostList";
import { NewPostForm } from "~/components/NewPostForm";
import { api } from "~/utils/api";

const TABS = ["Recent", "Following"] as const

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<(typeof TABS)[number]>("Recent")
  const session = useSession()
  return <>
  
  <header className=" sticky dark:bg-neutral-950 bg-white top-0 z-10 border-b-stone-800 pt-2">
    <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
    {session.status === "authenticated" && (
      <div className="flex">
        {TABS.map((tab) => {
          return (
            <button 
              key={tab} 
              className={`flex-grow p-2 hover:bg-stone-200 dark:hover:bg-stone-800 focus-visible:bg-gray-200 ${
                tab === selectedTab 
                  ? "border-b-4 border-b-yellow-700 font-bold"
                  : ""
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>
    )}  
  </header>
  <NewPostForm />
  {selectedTab === "Recent" ? <RecentPosts /> : <FollowingPosts />}
  </>
};

function RecentPosts() {
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    {}, 
    { getNextPageParam: (lastPage) => lastPage.nextCursor } 
  );

  return (
    <InfinitePostList 
      posts={posts.data?.pages.flatMap((page) => page.posts)} 
      isError={posts.isError}
      isLoading={posts.isLoading}
      hasMore={posts.hasNextPage}
      fetchNewPosts={posts.fetchNextPage}
    />
  );
}

function FollowingPosts() {
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true }, 
    { getNextPageParam: (lastPage) => lastPage.nextCursor } 
  );

  return (
    <InfinitePostList 
      posts={posts.data?.pages.flatMap((page) => page.posts)}
      isError={posts.isError}
      isLoading={posts.isLoading}
      hasMore={posts.hasNextPage}
      fetchNewPosts={posts.fetchNextPage}
    />
  );
}

export default Home;
