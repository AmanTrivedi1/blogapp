import React from "react";
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  let {
    personal_info: { fullname, username, profile_img },
  } = user;
  return (
    <>
      <Link
        className="flex hover:bg-grey/50 p-2 mb-3 items-center"
        to={`/user/${username}`}
      >
        <img
          className="w-[50px] mr-1 h-[50px] rounded-full"
          src={profile_img}
          alt="profuileimg"
        />
        <div>
          <h1 className="font-semibold text-xl line-clamp-2">{fullname}</h1>
          <p className="text-dark-grey ">@{username}</p>
        </div>
      </Link>
    </>
  );
};

export default UserCard;
