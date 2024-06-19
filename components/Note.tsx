import { Dispatch, SetStateAction } from "react";

interface NoteProps {
  note: string;
  setNote: Dispatch<SetStateAction<string>>;
}
export const Note = ({ note, setNote }: NoteProps) => {
  return (
    <>
      <div className="w-full">
        <textarea
          maxLength={10000}
          onChange={(e) => setNote(e.target.value)}
          placeholder="添加您的自定义提示，根据该提示生成新帖子"
          className="text-black w-full h-24 p-2 text-s bg-white border border-gray-300 rounded-md shadow-inner md:h-240"
        />
      </div>
      <div className="flex items-center mt-1 text-xs text-gray-700"></div>
      <div className="flex mb-1 items-center space-x-3"></div>
    </>
  );
};
