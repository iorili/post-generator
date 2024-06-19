import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import CustomButton from "@/components/CustomButton"; // adjust the import path according to your file structure
import { useSession } from "next-auth/react";
import { rank } from "@/lib/linkedin-algorithm";
import { Toaster, toast } from "react-hot-toast";
import LoadingDots from "@/components/LoadingDots";
import DropDown, { VibeType } from "@/components/DropDown";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Link from "next/link";
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
  const [vibe, setVibe] = useState<VibeType>("故事型");
  const [showPopup, setShowPopup] = useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [tab, setTab] = useState("vibe"); // Default to "vibe" tab
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
    switch (vibe) {
      case "故事型":
        prompt = `使用此提示根据 ${post} 生成帖子。 您是 PostGPT，这是一个为 自媒体 生成病毒式帖子的大型语言模型。正向的促进规则有:

- 在每个帖子中添加 emoji 表情符号
- 句子中最多200个字符
- 每句话从新行开始，在前两行加上数字
- 添加3个标签，其中2个是通用的，一个是非常具体的（在最后）,标签与帖子主题相关
- 在帖子末尾添加一个问题，可以使大家开始讨论。在标签之前
- 前两行需要足够吸引人
- 不添加链接
- 如果在字段中复制的帖子包含一些数字，请保持它们不变。

添加关于可以在帖子末尾添加哪些图像或视觉效果的想法（此文本不算作帖子的一部分）
${post}
---
生成的帖子长度必须超过800-1200个字符
---
每行之间必须有一个空格
---
把所有提到的人都放在里面
---
从类似这样的内容开始第一行：我做了某事，在一年中，我确实厌倦了，有时它只是，一条通往哪里哪里的道路，因为这不是，我一直在挣扎，（根据上下文决定哪种内容更合适）
---
添加 emoji 表情符号（如果合适）
---
这应该是一个故事`;
        break;
      case "简洁型":
        prompt = `使用此提示根据 ${post} 生成帖子。 您是 PostGPT，这是一个为 自媒体 生成病毒式帖子的大型语言模型。 
        你会得到一个帖子的提示，并且必须生成一个比原始帖子更有可能被点赞和转发的帖子。
        自媒体 网站的算法包含基于你所写内容的提升和降级。如果人们选择了这个 ${vibe}，请确保生成的 ${post} 必须符合以下条件，并且简短、简洁和鼓舞人心:
- 帖子长度不得超过500个字符。
- 每句话的长度小于50个字符。
- 第一句话必须以这样的话开头：我花了5个月，10步计划，我在去年1月，今年1月，我在，在过去的10年里，我创建了1000个，如何获得1000个追随者，如何做1000个，10节课，15个原因，5天前，3个令人震惊的步骤，我的2023年战略。（更改数字，生成始终新的数字，生成总是新的开始）。接下来的句子不应该包括数字和这些公式。 
- 如果在字段中复制的帖子包含一些数字，请保持它们不变。
- 接下来的句子应该生成，不应该包含数字。
---
每句话从新行开始
---
在每个摘要之间添加空格。
---
仅显示生成的帖子`;

        break;
      case "列表型":
        prompt = `根据 ${post} 生成可能在 自媒体 上被点赞和转发的帖子。您的帖子应遵循以下条件：
- 帖子长度不得超过一百个字符。
- 每个句子长度不超过两个单词。
- 帖子是事物的列表。
- 第一句话必须以以下内容之一开头：有两种类型，1 个需要避免的大错误，当你......，避免......，5 个快速提示......，大多数公司......，如果你不打算......（用数字替换省略号）。
- 如果复制的帖子包含数字，请保持不变。
- 应该生成下一个句子，并且不应包含数字。`;
        break;
      case "观点型":
        prompt = `使用此提示根据 ${post} 生成帖子。 您是 PostGPT，这是一个为 自媒体 生成病毒式帖子的大型语言模型。 
        你会得到一个帖子的提示，并且必须生成一个比原始帖子更有可能被点赞和转发的帖子。
        媒体 网站的算法包含基于你所写内容的提升和降级。如果人们选择了这个 ${vibe}，请确保生成的 ${post} 必须符合以下条件并针对该主题提出不受欢迎的观点：
        - 帖子长度必须少于 200 个字符。
        - 帖子内容不得超过 3 句话。
        - 第一句话必须以以下内容开头：不太受欢迎的观点：
        ---
        在每个摘要之间添加空格。`;
        break;

      case "案例型":
        prompt = `使用此提示根据 ${post} 生成帖子。 您是 PostGPT，这是一个为 自媒体 生成病毒式帖子的大型语言模型。 
        你会得到一个帖子的提示，并且必须生成一个比原始帖子更有可能被点赞和转发的帖子。
        媒体 网站的算法包含基于你所写内容的提升和降级。如果人们选择了这个 ${vibe}，请确保生成的 ${post} 必须符合以下条件并且充实、严谨并与帖子类型相关：
        - 帖子必须与最初插入的内容相关。
        - 帖子长度不得超过 1000 个字符。
        - 每句长度不超过200个字符。
        - 第一句话必须以类似的东西开头，或类似的文字：专业提示，这些简单的实验，这是我今年最大的收获之一，内心，存在......并不意味着，今年早些时候，这可能是最热门的（使用类似的词语）
        - 如果复制的帖子包含数字，请保持不变。
        - 接下来的句子应该生成，并且包含列表，严格的列表，每个列表点都从表情符号开始。
        ---
        提供图形、图像、方案的想法，这些想法将为括号中的案例研究帖子提供支持
        ---
        在每个摘要之间添加空格`;
        break;

      default:
        prompt = `优化帖子的默认提示`;
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

                  {/* // This is post component*/}

                  <div className="w-full mx-auto pt-6 ">
                    <div className="w-full">
                      <textarea
                        maxLength={2000}
                        onChange={(e) => setPost(e.target.value)}
                        placeholder="在此处输入或复制您的帖子或想法 "
                        className="text-black w-full h-56 p-2 text-s bg-white border border-gray-300 rounded-md shadow-inner md:h-240"
                      />
                    </div>
                  </div>

                  <div className="flex mb-3 items-center space-x-3"></div>
                  <div className="block">
                    <DropDown vibe={vibe} setVibe={setVibe} />
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
                      {!loading && `生成新贴 `}
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
