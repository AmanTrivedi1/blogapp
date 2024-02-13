import React from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <>
      <AnimationWrapper>
        <div className="flex p-2 mt-20 flex-col h-full items-center justify-center">
           <div className="flex items-center justify-center flex-col">
            <img className="max-w-sm animate-bounce " src="https://res.cloudinary.com/dmlts9lbk/image/upload/v1705598420/empty_u3jzi3.png" alt="notfound" />
             <h1 className="md:text-[300px]   sm:text-[200px] text-[160px] -mt-[160px]  font-bold ">
                404
             </h1>
           </div>
          <Link to="/" className="btn-dark md:-mt-[80px] -mt-[40px]">
            Go home
          </Link>
        </div>
      </AnimationWrapper>
    </>
  );
};

export default NotFound;
