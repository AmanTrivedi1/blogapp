import React from "react";
import AnimationWrapper from "../common/page-animation";
import Pagenotfound from "../imgs/404.png";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <>
      <AnimationWrapper>
        <div className="h-screen  flex flex-col items-center justify-center">
          <h1 className="md:text-[300px] text-center sm:text-[200px]  text-[140px] text-dark font-bold">
            404
          </h1>
          <p className="mt-[-40px] mb-4  text-center text-xl">
            The page are you lookig for does not exists
          </p>
          <Link to="/" className="btn-dark">
            Go home
          </Link>
        </div>
      </AnimationWrapper>
    </>
  );
};

export default NotFound;
