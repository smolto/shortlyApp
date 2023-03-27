import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "@/styles/Redirect.module.css";

export default function Home() {
  const router = useRouter();

  const { query } = router;

  const fetchData = async () => {
    try {
      const data = await fetch(`/api/hash/${query.hash}`);
      const json = await data.json();

      return json;
    } catch (error) {
      router.replace("/");
    }
  };

  async function handleUseEffect() {
    const res = await fetchData();
    if (res.error) return router.replace("/");
    window.location.assign(res.data.originalUrl);
  }

  useEffect(() => {
    if (!query.hash) return;
    handleUseEffect();
  }, [query, router]);

  return (
    <>
      <Head>
        <title>ShortLy</title>
        <meta name="description" content="Short yours URLs with ShortLy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@700&family=Roboto+Slab&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className={styles.content}>
        <div className={styles.centerElement}>
          <span className={styles.span}>Redirecting ...</span>
        </div>
      </main>
    </>
  );
}
