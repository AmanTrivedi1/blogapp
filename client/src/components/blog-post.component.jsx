import React from "react";
import { getDay } from "../common/date";
import { AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
const BlogPostCard = ({ content, auther }) => {
  let {
    publishedAt,
    tags,
    title,
    des,
    banner,
    activity: { total_likes },
    blog_id: id,
  } = content;
  let { fullname, username, profile_img } = auther;
  return (
    <>
      <Link
        to={`/blog/${id}`}
        className="flex gap-8 items-start border-b border-grey pb-5 mb-5"
      >
        <div className="w-full">
          <div className="flex gap-2 items-center mb-7 ">
            <img
              className="xl:w-8 xl:h-8 h-6 w-6 rounded-full"
              src={profile_img}
              alt="profile image"
            />
            <p className="line-clamp-1">
              {fullname} @{username}
            </p>
            <p className="min-w-fit opacity-70"> {getDay(publishedAt)}</p>
          </div>
          <h1 className="blog-title">{title}</h1>
          <p className="my-3  text-xl  leading-7 max-sm:hidden  line-clamp-2 md:max-[1100px]">
            {des}
          </p>
          <div className="flex gap-4 mt-7 ">
            <span className="btn-light font-gelasio py-1 px-4">{tags[0]}</span>
            <span className="ml-3 flex items-center gap-2 text-dark-grey">
              <AiOutlineHeart className="text-xl" /> {total_likes}
            </span>
          </div>
        </div>
        <div className="h-28 aspect-auto  bg-grey  ">
          <img
            src={banner}
            alt="banner"
            className="w-full h-full rounded-lg aspect-square object-cover"
          />
        </div>
      </Link>
    </>
  );
};

export default BlogPostCard;
