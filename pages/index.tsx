import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import CoptyToClipboard from "@/components/icons/CopyToClipBoard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Check from "@/components/icons/Check";

export default function Home() {
  const [userUrl, setUserUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [response, setResponse] = useState<null | boolean>(null);
  const [isCopied, setIsCopied] = useState(false);

  const resultStyle = useMemo(() => {
    if (response === null) return "";
    if (response) return styles["border-gradient"];
    return styles["border-gradient-fadeOut"];
  }, [response]);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (userUrl.length <= 5) return setIsError(true);
      setIsLoading(true);
      const response = await fetch(`/api/hash`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: userUrl }),
      });
      setIsLoading(false);
      const json = await response.json();

      return setResponse(json.hash);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      notify("error", "There was an error generating your URL!");
    }
  }

  function notify(type: "error" | "success", text: string) {
    if (type === "error")
      return toast.error(text, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    return toast.success(text, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  function handleCopyToClipBoard() {
    if (!navigator.clipboard) {
      notify("error", "Problem on copy!");
      return;
    }
    navigator.clipboard
      .writeText(`${process.env.NEXT_PUBLIC_LOCAL_URL}/${response}`)
      .then(
        function () {
          notify("success", "Copied! 😄");
          setIsCopied(true);
        },
        function (err) {
          notify("error", "Could not copy text");
          console.error("Async: Could not copy text: ", err);
          setIsCopied(false);
        }
      );
  }

  function resetState() {
    setIsCopied(false);
    setIsError(false);
    setIsLoading(false);
    setResponse(false);
    setUserUrl("");
  }

  useEffect(() => {
    if (!response) return;
    resetState();
  }, [userUrl]);

  return (
    <>
      <Head>
        <title>ShortLy</title>
        <meta name="description" content="Short yours URLs with ShortLy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>ShortLy URL</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles["form--title"]}>
            Paste the URL to be shortened
          </h3>
          <div className={styles["form--item"]}>
            <label htmlFor="url">Enter your link</label>
            <input
              type="text"
              name="url"
              id="url"
              className={styles["form--input"]}
              value={userUrl}
              onChange={(e) => setUserUrl(e.target.value)}
            />
          </div>
          <div className={styles["form--submit"]}>
            <button type="submit">
              {isLoading ? <div className={styles.spinner}></div> : "Submit"}
            </button>
          </div>
        </form>

        {response && (
          <div className={resultStyle}>
            <div className={styles.result}>
              <p>
                {process.env.NEXT_PUBLIC_LOCAL_URL}/{response}
              </p>
              <button
                className={styles["copy-to-clipboard"]}
                onClick={handleCopyToClipBoard}
              >
                {!isCopied && <CoptyToClipboard size={20} />}
                {isCopied && <Check size={20} />}
              </button>
            </div>
          </div>
        )}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>
    </>
  );
}
