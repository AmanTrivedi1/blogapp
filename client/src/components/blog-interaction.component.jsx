import React, { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { CiHeart } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";
import { FaHeart } from "react-icons/fa6";

import { Link } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    islikedbyuser,
    setIsLikedByUser,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      // make request to server to get like info
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user",
          {
            _id,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data: { result } }) => {
          console.log(result);
          setIsLikedByUser(Boolean(result));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handeLikes = () => {
    if (access_token) {
      setIsLikedByUser((prev) => !prev);

      !islikedbyuser ? total_likes++ : total_likes--;
      setBlog({ ...blog, activity: { ...activity, total_likes } });
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",
          {
            _id,
            islikedbyuser,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Login kar k tab ao");
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey/10 my-2" />
      <div className="flex  gap-6 justify-between ">
        <div className="flex gap-3 items-center">
          {access_token ? (
            <>
              <button
                onClick={handeLikes}
                className={
                  "rounded-full flex  h-8 w-8 items-center justify-center " +
                  (islikedbyuser
                    ? "text-red  bg-red/20"
                    : "text-white bg-black ")
                }
              >
                {islikedbyuser ? (
                  <FaHeart className="text-xl" />
                ) : (
                  <CiHeart className="text-xl" />
                )}
              </button>
              <p className="text-base ">{total_likes}</p>
            </>
          ) : (
            <>
              <Link
                to="/sign"
                className="rounded-full flex   h-8 w-8 items-center justify-center"
              >
                <CiHeart className="text-xl " />
                <span className="ml-1"> {total_likes}</span>
              </Link>
            </>
          )}
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
