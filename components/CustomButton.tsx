import Link from "next/link";

interface CustomButtonProps {
  currentTab: string | number;
}

const CustomButton = ({ currentTab }: CustomButtonProps) => {
  const buttons = [
    {
      link: "/",
      text: "风格💃",
      tooltip: "使用顶级创建者的风格生成帖子",
      tabName: "vibe",
    },
    {
      link: "/custom",
      text: "自定义 🏗️",
      tooltip: "使用您自定义的提示生成帖子",
      tabName: "custom",
    },
    {
      link: "/template",
      text: "模版 📋",
      tooltip: "根据模版生成帖子",
      tabName: "template",
    },
    {
      link: "/enhancer",
      text: "完善 💫",
      tooltip: "完善你的帖子，让它更短或更长，语法正确",
      tabName: "enhancer",
    },
    {
      link: "/ideas",
      text: "创意💡",
      tooltip: "为你的帖子生成创意",
      tabName: "ideas",
    },
  ];

  return (
    <>
      {buttons.map((button, index) => (
        <Link href={button.link} key={index}>
          <div className="relative group">
            <button
              className={`px-3 py-2 rounded-md text-xs font-medium ${
                currentTab === button.tabName
                  ? "bg-gray-300 text-black"
                  : "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
              }`}
            >
              {button.text}
            </button>
            <span
              className="tooltip-text text-sm bg-gray-100 text-gray-700 p-1 rounded-md absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-300"
              style={{ width: "150px" }}
            >
              {button.tooltip}
            </span>
          </div>
        </Link>
      ))}
    </>
  );
};

export default CustomButton;
