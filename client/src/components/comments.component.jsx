import React, { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { IoMdClose } from "react-icons/io";
import CommentField from "./comment-field.component";

const CommentsContainer = () => {
  let {
    blog: { title },
    commentsWrapper,
    setCommentsWrapper,
  } = useContext(BlogContext);
  return (
    <>
      <div
        className={
          "max-sm:w-full fixed " +
          (commentsWrapper
            ? "top-0 sm:right-0"
            : "top-[100%] sm:right-[-100%]") +
          " duration-700 max-sm:right-0  w-[30%] text-white sm:top-0 min-3-[350px] z-50 h-full bg-[#000000] shadow-2xl  p-8 px-16 overflow-y-auto overflow-x-hidden"
        }
      >
        <div className="relative">
          <h1 className="text-xl font-medium font-Poppins">Comments</h1>
          <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-2">
            {title}
          </p>
          <button
            onClick={() => setCommentsWrapper((prev) => !prev)}
            className="absolute top-0 right-0 mt-1 flex items-center bg-black p-2 rounded-full justify-center "
          >
            <IoMdClose className="w-6 h-6 rounded-full " />
          </button>
        </div>
        <hr className="border-black my-8 w-[120%] -ml-10" />

        <CommentField action="comment" />
      </div>
    </>
  );
};

export default CommentsContainer;
