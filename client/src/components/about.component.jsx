import React from "react";
import { Link } from "react-router-dom";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
  return (
    <>
      <div className={"md:w-[90%] md:mt-7 " + className}>
        <p className="text-xl leading-7 ">
          {bio.length ? bio : "nothing to read here"}
          <div className="flex  gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
            {Object?.keys(social_links)?.map((key) => {
              let link = social_links[key];
              return link ? <Link to={link}>{key}</Link> : " ";
            })}
          </div>
        </p>
      </div>
    </>
  );
};


export default AboutUser;
