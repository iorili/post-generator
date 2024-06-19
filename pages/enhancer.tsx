import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import CustomButton from "@/components/CustomButton";

import { Ranking } from "@/components/Ranking";
import { rank } from "@/lib/linkedin-algorithm";
import { Toaster, toast } from "react-hot-toast";
import LoadingDots from "@/components/LoadingDots";
import DropDown2, { VibeType2 } from "@/components/DropDown2";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Popup from "@/components/Popup";
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
  const [media, setMedia] = useState<boolean>(false);
  const [vibe2, setVibe2] = useState<VibeType2>("➕ 添加标签");
  const [showPopup, setShowPopup] = useState(false);
  const [tab, setTab] = useState("enhancer"); // Default to "vibe" tab
  const { data: session, status } = useSession();
  const clickCount = useRef(0);

  const handleButtonClick = () => {
    clickCount.current += 1; // Increment clickCount on each click
    if (status !== "authenticated" && clickCount.current >= 3) {
      setTimeout(() => {
        setShowPopup(true);
      }, 3000);
    }
  };

  // const [hasVideo, setHasVideo] = useState<boolean>(false);
  // const [hasCarousel, setHasCarousel] = useState<boolean>(false);

  useEffect(() => {
    const rankResponse = rank(post, media);
    setRanking(rankResponse);
  }, [post, media]);

  // prompt for optimizing post

  // add more vibes as needed
  const handlePrompt = () => {
    let prompt;
    switch (vibe2) {
      case "➕ 添加标签":
        prompt = `通过添加三个热门且相关的主题标签来改造以下 帖子。原始帖子：“${post}”。请记住，您是一个帖子生成器，旨在使用适当的主题标签增强帖子的效果。`;
        break;
      case "➕ 添加表情":
        prompt = `通过添加表情符号来转换以下帖子。原始帖子：“${post}”。请记住，您是一个帖子生成器，旨在使用适当的表情符号增强帖子的效果。`;

        break;
      case "➕ 添加列表":
        prompt = `您是帖子生成器，您的任务是通过合并与帖子主题相符的相关列表来丰富现有的帖子。请考虑以下原始帖子：“${post}”。您的任务是无缝编织适当的列表以提升内容。每行列表的长度不应超过 100 个字符。请记住，您的目标是尽可能少地更改帖子。`;

        break;
      case "➕ 添加统计数据":
        prompt = `您是帖子生成器，您的任务是通过将相关统计数据与帖子主题相符的数字结合起来，丰富现有的帖子。请考虑以下原始帖子：“${post}”。您的任务是无缝地编织适当的数字以提升内容。请记住，您的目标是尽可能少地更改帖子。`;
        break;
      case "➕ 添加问题":
        prompt = `作为帖子生成器，您的任务是通过将一个发人深省的问题整合到以下帖子中来激发参与度：“${post}”。这个问题旨在引发讨论，可以作为帖子的开头或结尾。确保您提出的问题与帖子的背景相符，并有可能使帖子更具吸引力。请记住，您的目标是进行最少的更改，因此请将问题和帖子一起展示。`;
        break;
      default:
        prompt = ``;
        break;
    }
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
          content="像顶级创作者一样使用 AI 生成高质量帖子,是时候让帖子火起来了!"
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
          content="看看你的帖子表现如何，并用AI生成更好的!"
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

                  <div className="flex mb-3 items-center space-x-3"></div>
                  <div className="block">
                    <DropDown2 vibe2={vibe2} setVibe2={setVibe2} />
                  </div>

                  {/* // This is post component*/}

                  <div className="w-full mx-auto pt-6 ">
                    <div className="w-full">
                      <textarea
                        maxLength={2000}
                        onChange={(e) => setPost(e.target.value)}
                        placeholder="在此处输入或复制您的帖子或想法 "
                        className="text-black w-full h-72 p-2 text-s bg-white border border-gray-300 rounded-md shadow-inner md:h-240"
                      />
                    </div>
                  </div>

                  <div className="my-4">
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
                          生成的新贴
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
