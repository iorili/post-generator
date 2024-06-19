import { Dispatch, SetStateAction } from "react";

interface InputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}
export const Input = ({ input, setInput }: InputProps) => {
  return (
    <>
      <div className="w-full">
        <textarea
          maxLength={10000}
          onChange={(e) => setInput(e.target.value)}
          placeholder="模板添加处（可以直接复制您以前的帖子，会自动解析）。"
          className="text-black w-full h-32 p-2 text-s bg-white border border-gray-300 rounded-md shadow-inner md:h-240"
        />
      </div>
      <div className="flex items-center mt-1 text-xs text-gray-700"></div>
      <div className="flex mb-1 items-center space-x-3"></div>
    </>
  );
};
