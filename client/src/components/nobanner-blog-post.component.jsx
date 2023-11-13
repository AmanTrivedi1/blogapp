import React from "react";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimalBlogPost = ({ blog, index }) => {
  let {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;
  return (
    <>
      <Link to={`/blog/${id}`} className="flex gap-5 mb-8">
        <h1 className="blog-index  text-[46px] sm:text-[56px] md:text-[64px] leading-tight">
          {index < 10 ? "0" + (index + 1) : index}
        </h1>
        <div>
          <div className=" flex flex-col gap-y-2">
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
            <h1 className="blog-title line-clamp-1 mt-[-20px]">{title}</h1>
            <hr className="border-b border-grey " />
          </div>
        </div>
      </Link>
    </>
  );
};

export default MinimalBlogPost;
