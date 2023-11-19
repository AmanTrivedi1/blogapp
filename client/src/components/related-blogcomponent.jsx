import React from "react";

import { getDay } from "../common/date";
import { AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";

const RelatedBlogCard = ({ content, auther }) => {
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
      <Link to={`/blog/${id}`}>
        <div className="border border-white/10 rounded-lg  ]">
          <div className="max-w-xs  hover:shadow-lg p-1 h-96 ">
            <p className="border  bg-black/40 border-black/40 inline-block px-2 w-24 py-1 absolute text-white rounded-lg truncate">
              {tags}
            </p>
            <img
              className="max-w-xs rounded-lg aspect-video max-h-44"
              src={banner}
              alt="banner"
            />
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/60">
                Written by <span className="text-white"> {fullname}</span>
              </p>

              <p className="text-white/50"> {getDay(publishedAt)}</p>
            </div>

            <div className="flex items-center gap-x-2">
              <img
                src={profile_img}
                className="w-[25px] rounded-full h-[25px]"
                alt="profileimg"
              />
              <p className="text-white/60">@{username}</p>
            </div>
            <div className="flex items-center  justify-between">
              <p className="text-2xl font-white line-clamp-1 mt-2">{title}</p>

              <p className="flex items-center gap-x-1 ">
                <AiOutlineHeart className="text-xl" /> {total_likes}
              </p>
            </div>

            <p className="line-clamp-3 text-white/60">{des}</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default RelatedBlogCard;
