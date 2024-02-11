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
        <div className=" border rounded-lg border-white/10">
          <div className="max-w-xs  hover:shadow-lg  h-96 ">
            <p className="border  bg-black/40 border-black/40 inline-block px-2 w-24 py-1 absolute text-white rounded-lg truncate">
              {tags}
            </p>
            <img
              className="max-w-xs rounded-lg aspect-video max-h-44"
              src={banner}
              alt="banner"
            />
            <div className="p-2 ">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/60 text-[10px]">
                  Written by <span className="text-white text-[12px]"> {fullname}</span>
                </p>

                <p className="text-white/50 text-[12px]"> {getDay(publishedAt)}</p>
              </div>

              <div className="flex items-center gap-x-2">
                <img
                  src={profile_img}
                  className="w-[25px] rounded-full h-[25px]"
                  alt="profileimg"
                />
                <p className="text-white/60 text-[12px]">@{username}</p>
              </div>
              <div className="flex items-center p-1justify-between">
                <p className="text-2xl font-white line-clamp-2 mt-2">{title}</p>

                <p className="flex items-center gap-x-1 ">
                  <AiOutlineHeart className="text-xl" /> {total_likes}
                </p>
              </div>
              <p className="  line-clamp-3 text-white/60">{des}</p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default RelatedBlogCard;
