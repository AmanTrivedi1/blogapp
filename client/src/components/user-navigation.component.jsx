import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
  const {
    userAuth: { username },
    setUserAuth,
  } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };
  return (
    <>
      <AnimationWrapper
        className="absolute right-0 z-50 "
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white absolute right-0 border rounded-xl border-black/10 w-60  duration-200">
          <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
            <p>Write</p>
          </Link>
          <Link className="link pl-8 py-4 " to={`/user/${username}`}>
            Profile
          </Link>
          <Link className="link pl-8 py-4 " to="/dashboard/blogs">
            Dashboard
          </Link>
          <Link className="link pl-8 py-4 " to="/settings/edit-profile">
            Settings
          </Link>
          <span className="absolute border-t border-grey  w-[100%]"></span>
          <button
            onClick={signOutUser}
            className="text-left p-4  hover:bg-red/30  w-full pl-8 py-4"
          >
            <h1 className="font-bold text-xl mg-1 ">SignOut</h1>
            <p className="line-clamp-1 text-dark-grey">@{username}</p>
          </button>
        </div>
      </AnimationWrapper>
    </>
  );
};

export default UserNavigationPanel;
