import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import { SideNav } from "~/components/SideNav";
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
      
      <div className="container mx-auto flex items-start sm:pr-4">
        <SideNav />
        <div className="min-h-screen flex-grow border border-zinc-800">
          <Component {...pageProps} />
        </div>
      </div>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
