import React, { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

import { Link } from "react-router-dom";
import { UserContext } from "../App";

const BlogInteraction = () => {
  let {
    blog: {
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
  } = useContext(BlogContext);

  let {
    userAuth: { username },
  } = useContext(UserContext);

  return (
    <>
      <hr className="border-grey/10 my-2" />
      <div className="flex  gap-6 justify-between ">
        <div className="flex gap-3 items-center">
          <button className="rounded-full flex  h-8 w-8 items-center justify-center ">
            <CiHeart className="text-xl" />
          </button>
          <p className="text-base ">{total_likes}</p>

          <button className="rounded-full flex  h-8 w-8 items-center justify-center ">
            <FaRegCommentDots className="text-xl" />
          </button>
          <p className="text-base ">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username == author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-twitter"
            >
              Edit
            </Link>
          ) : (
            ""
          )}
          <Link
            to={`https://twitter.com/intent/tweet?text=Readmyblog ${title}&url=${location.href}`}
            className="flex text-twitter   items-center gap-1 px-4 py-2 "
          >
            <FaXTwitter />
          </Link>
        </div>
      </div>
      <hr className="border-grey/10 my-2" />
    </>
  );
};

export default BlogInteraction;
