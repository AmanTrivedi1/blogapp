import React, { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { IoMdClose } from "react-icons/io";
import CommentField from "./comment-field.component";
import axios from "axios";

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFun,
  comment_array = null,
}) => {
  let res;
  await axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      data.map((comment) => {
        comment.childrenLevel = 0;
      });
      setParentCommentCountFun((preVal = preVal + data.length));
      if (comment_array.length == null) {
        res = { results: data };
      } else {
        res = { results: [...comment_array, ...data] };
      }
    });
};

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
          " duration-700 max-sm:right-0  w-[30%] text-white sm:top-0 min-3-[350px] z-50 h-full bg-[#222222] shadow-2xl  p-8 px-16 overflow-y-auto overflow-x-hidden"
        }
      >
        <div className="relative">
          <h1 className="md:text-2xl text-xl font-medium font-Poppins ">Write what you think</h1>
          <p className="text-lg mt-2 w-[70%] text-white/80 line-clamp-2">
            {title}
          </p>
        
          <button
            onClick={() => setCommentsWrapper((prev) => !prev)}
            className="absolute top-0 right-0 mt-1 flex items-center bg-white/30 backdrop-blur-sm p-2 rounded-full  justify-center "
          > 
            <IoMdClose className="w-6   h-6 text " />
          </button>
          
        </div>
        <hr className="border-black my-8 w-[120%] -ml-10" />
        <CommentField action="comment" />
      </div>
    </>
  );
};

export default CommentsContainer;
