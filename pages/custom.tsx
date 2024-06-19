import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Note } from "@/components/Note";
import { Post } from "@/components/Post";
import { Ranking } from "@/components/Ranking";
import { rank } from "@/lib/linkedin-algorithm";
import { Toaster, toast } from "react-hot-toast";
import LoadingDots from "@/components/LoadingDots";
import DropDown, { VibeType } from "@/components/DropDown";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Link from "next/link";
import Popup from "@/components/Popup";
import CustomButton from "@/components/CustomButton";

import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaDev,
  FaFacebook,
  FaReddit,
} from "react-icons/fa";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [optimizedPost, setOptimizedPost] = useState<string>("");
  const [ranking, setRanking] = useState<RankResponse>({
    score: 0,
    validations: [],
  });
  const [post, setPost] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [media, setMedia] = useState<boolean>(false);
  const [vibe, setVibe] = useState<VibeType>("故事型");
  const [showPopup, setShowPopup] = useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [tab, setTab] = useState("custom");

  const handleButtonClick = () => {
    setTimeout(() => {
      setShowPopup(true);
    }, 3000);
  };

  // const [hasVideo, setHasVideo] = useState<boolean>(false);
  // const [hasCarousel, setHasCarousel] = useState<boolean>(false);

  useEffect(() => {
    const rankResponse = rank(post, media);
    setRanking(rankResponse);
  }, [post, media]);

  // prompt for optimizing post

  const handlePrompt = () => {
    // Ensure both "post" and "note" have values before proceeding
    if (!post || !note) {
      return; // Or handle this case differently, based on your needs
    }

    // Now you can use both variables to construct your prompt
    const prompt = `根据这些规则生成新的帖子${note}，并基于此处的主题${post}。您是 PostGPT，这是一个为 自媒体 生成病毒式帖子的大型语言模型。

  - 帖子必须与最初插入的内容相关。`;

    return prompt;
  };

  // function to send post to OpenAI and get response
  const optimizePost = async (e: any) => {
    e.preventDefault();
    setOptimizedPost("");
    setLoading(true);
    const prompt = handlePrompt();

    // Show the popup right before the API call
    handleButtonClick();

    const response = await fetch("/api/optimize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      const formattedChunk = chunkValue.replace(/\n/g, "<br>");
      setOptimizedPost((prev) => prev + formattedChunk);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>爆帖</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="👩‍💼" />
        <meta
          name="description"
          content="使用我们的 AI 生成器提升您的帖子。根据算法测试帖子表现并提高表现度。"
        />
        <meta property="og:site_name" content="#1 帖子生成器 🚀  " />
        <meta
          property="og:description"
          content="看看你的帖子表现如何，并用AI生成更好的!"
        />
        <meta property="og:title" content="Post Generator with AI" />
        <meta name="linkedin:card" content="summary_large_image" />
        <meta name="linkedin:title" content="Post Generator" />
        <meta
          name="linkedin:description"
          content="使用我们的 AI 生成器提升您的帖子。根据算法测试帖子表现并提高表现度。"
        />
        {/*<meta*/}
        {/*  property="og:image"*/}
        {/*  content="https://postgenerator.app/cover.png"*/}
        {/*/>*/}
        {/*<meta*/}
        {/*  name="linked:image"*/}
        {/*  content="https://postgenerator.app/cover.png"*/}
        {/*/>*/}
      </Head>

      <main>
        <Nav />

        <section className="py-10 lg:py-20 ">
          {/* bg-[url('/image1.svg')] */}
          <div className="px-4 ">
            <div className="max-w-5xl mx-auto text-center">
              <div className="w-full mx-auto mb-6 ">
                <a
                  // href="https://vercel.fyi/roomGPT"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-gray-700 rounded-lg py-2 px-4 text-gray-400 text-sm mb-8 transition duration-300 ease-in-out"
                >
                  生成了 40000 条精彩帖子 💫
                  {/* {" "}
                  <span className="text-blue-600">Vercel</span> */}
                </a>
              </div>

              <h1 className="text-6xl text-center font-bold pb-1 text-slate-900  ">
                爆帖生成器 🚀
              </h1>
              <p className="mt-3 mb-10 text-center">
                看看你的帖子表现如何，并用AI生成更好的。
                是时候让帖子火起来了! <br />
              </p>

              {/* <div className="mt-4 mb-4 flex justify-center space-x-4">
                  <Link href="/index/twitter">
                    <button className="bg-blue-400 text-white flex items-center space-x-2 p-2 rounded">
                      <FaTwitter />
                      <span>Twitter</span>
                    </button>
                  </Link>

                  <Link href="/index/linkedin">
                    <button className="bg-blue-700 text-white flex items-center space-x-2 p-2 rounded">
                      <FaLinkedin />
                      <span>LinkedIn</span>
                    </button>
                  </Link>
                  <Link href="/index/instagram">
                    <button className="bg-pink-500 text-white flex items-center space-x-2 p-2 rounded">
                      <FaInstagram />
                      <span>Instagram</span>
                    </button>
                  </Link>
                  <Link href="/index/devto">
                    <button className="bg-black text-white flex items-center space-x-2 p-2 rounded">
                      <FaDev />
                      <span>Dev.to</span>
                    </button>
                  </Link>
                  <Link href="/index/facebook">
                    <button className="bg-blue-600 text-white flex items-center space-x-2 p-2 rounded">
                      <FaFacebook />
                      <span>Facebook</span>
                    </button>
                  </Link>
                  <Link href="/index/reddit">
                    <button className="bg-orange-500 text-white flex items-center space-x-2 p-2 rounded">
                      <FaReddit />
                      <span>Reddit</span>
                    </button>
                  </Link>
                </div> */}

              <div className="flex flex-col md:flex-row w-full md:space-x-20">
                <div className="flex md:w-1/2 flex-col">
                  <div className="flex space-x-1">
                    <CustomButton currentTab={tab} />
                    <style jsx>{`
                      button:hover .tooltip-text {
                        display: block;
                      }
                    `}</style>
                  </div>

                  <div className="w-full mx-auto pt-6 ">
                    <div className="w-full">
                      <textarea
                        maxLength={7000}
                        onChange={(e) => setPost(e.target.value)}
                        placeholder="在此处输入或复制您的帖子或想法"
                        className="text-black w-full h-48 p-2 text-s bg-white border border-gray-300 rounded-md shadow-inner md:h-240"
                      />
                    </div>
                    <Note note={note} setNote={setNote} />
                  </div>

                  <div className="">
                    <button
                      disabled={loading}
                      onClick={(e) => {
                        optimizePost(e);
                        handleButtonClick();
                      }}
                      className="bg-blue-700 font-medium rounded-md w-full text-white px-4 py-2 hover:bg-blue-600 disabled:bg-blue-800"
                    >
                      {loading && <LoadingDots color="white" style="large" />}
                      {!loading && `生成新贴`}
                    </button>

                    <Popup show={showPopup} setShowPopup={setShowPopup} />
                  </div>
                </div>
                <div className="flex md:w-1/2 md:flex-col">
                  <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{ duration: 2000 }}
                  />
                  {optimizedPost && (
                    <div className="my-1">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-300">
                        <h2 className="text-xl font-bold">
                          Your Generated Post
                        </h2>
                      </div>
                      <div className="max-w-2xl my-4 mx-auto">
                        <div
                          className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                          onClick={() => {
                            navigator.clipboard.write([
                              new ClipboardItem({
                                "text/html": new Blob([optimizedPost], {
                                  type: "text/html",
                                }),
                              }),
                            ]);
                            toast("帖子已复制", {
                              icon: "📋",
                            });
                          }}
                          key={optimizedPost}
                        >
                          <p
                            className="text-black-700 text-left"
                            dangerouslySetInnerHTML={{
                              __html: optimizedPost,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-5xl mx-auto">
          <Footer />
        </div>
      </main>
    </>
  );
}
