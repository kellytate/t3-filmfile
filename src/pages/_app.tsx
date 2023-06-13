import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { StickyNav } from "~/components/StickyNav";
import { NewPostForm } from "~/components/NewPostForm"
import { ThemeProvider } from "next-themes";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
      <Head>
        <title>Filmfile</title>
        <meta name="description" content="This is a social app"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex flex-col">
        <div className="container">
          <div className="min-h-screen w-full flex-grow border dark:border-stone-800">
            <Component {...pageProps} />
          </div>
        </div>
        <StickyNav />
      </div>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
