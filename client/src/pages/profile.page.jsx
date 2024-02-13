import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import Navbar from "../components/navbar.component";
import { CiFacebook } from "react-icons/ci";
import { FaGithubAlt } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { MdBlurLinear } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import InPageNavigation from "../components/inpage-navigation.component";
import { UserContext } from "../App";
import { getFullDay } from "../common/date";
import { filterPaginationData } from "../common/filter-pagination-data";
import BlogPostCard from "../components/blog-post.component";
import LoadMoreDataBtn from "../components/load-more.component";
import NoDataMessage from "../components/nodata.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NotFound from "./404.page";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_blogs: 0,
  },
  social_links: {
    facebook: " ",
    github: "",
    instgram: "",
    twitter: "",
    website: "",
    youtube: "",
  },
  joinedAt: "",
};

const ProfilePage = () => {
  const { id: profileId } = useParams();
  let [profile, setProfile] = useState(profileDataStructure);
  let [loading, setLoading] = useState(true);
  let [blogs, setBlogs] = useState(null);
  let [profileloaded, setProfileLoaded] = useState("");

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads, social_links },
    joinedAt,
    social_links: { facebook, github, instagram, website, youtube, twitter },
  } = profile;

  let {
    userAuth: { username },
  } = useContext(UserContext);
  const fetchUserProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        if (user != null) {
          setProfile(user);
        }
        setProfileLoaded(profileId);
        getBlogs({ user_id: user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });
        formatedData.user_id = user_id;
        console.log(formatedData);
        setBlogs(formatedData);
      });
  };

  useEffect(() => {
    if (profileId != profileloaded) {
      setBlogs(null);
    }
    if (blogs == null) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setBlogs(null);
    setLoading(false);
    setProfileLoaded("");
  };

  const MobileUSer = () => {
    return (
      <>
        <div className="md:w-[90%] md:mt-7 flex  items-center  flex-col justify-center md:justify-start md:items-start  ">
          <div className="flex gap-2 mt-2 mb-2">
            {facebook ? (
              <Link to={facebook} target="_blank">
                <CiFacebook className="text-3xl text-[#3b5998]" />
              </Link>
            ) : (
              <></>
            )}
            {github ? (
              <Link to={github} target="_blank">
                <FaGithubAlt className="text-3xl text-[#24292e]" />
              </Link>
            ) : (
              <></>
            )}
            {instagram ? (
              <Link to={instagram} target="_blank">
                <FaInstagram className="text-3xl text-[#d62976]" />
              </Link>
            ) : (
              <></>
            )}
            {website ? (
              <Link to={website} target="_blank">
                <MdBlurLinear className="text-3xl text-[#000000]" />
              </Link>
            ) : (
              <></>
            )}
            {twitter ? (
              <Link to={twitter} target="_blank">
                <FaXTwitter className="text-3xl text-[#00acee]" />
              </Link>
            ) : (
              <></>
            )}

            {youtube ? (
              <Link to={youtube} target="_blank">
                <FaYoutube className="text-3xl text-[#CD201F] " />
              </Link>
            ) : (
              <></>
            )}
          </div>
          <div className="text-xl text-bold left-7 text-dark-grey">
            Joined on {getFullDay(joinedAt)}
          </div>
        </div>
    
      </>
    );
  };

  const AboutUser = () => {
    return (
      <>
        <div className="  ">
          <div className="flex gap-2 mt-2 mb-2">
            {facebook ? (
              <Link to={facebook} target="_blank">
                <CiFacebook className="text-3xl " />
              </Link>
            ) : (
              <></>
            )}
            {github ? (
              <Link to={github} target="_blank">
                <FaGithubAlt className="text-3xl " />
              </Link>
            ) : (
              <></>
            )}
            {instagram ? (
              <Link to={instagram} target="_blank">
                <FaInstagram className="text-3xl " />
              </Link>
            ) : (
              <></>
            )}
            {website ? (
              <Link to={website} target="_blank">
                <MdBlurLinear className="text-3xl " />
              </Link>
            ) : (
              <></>
            )}
            {twitter ? (
              <Link to={twitter} target="_blank">
                <FaXTwitter className="text-3xl " />
              </Link>
            ) : (
              <></>
            )}

            {youtube ? (
              <Link to={youtube} target="_blank">
                <FaYoutube className="text-3xl  " />
              </Link>
            ) : (
              <></>
            )}
          </div>
          <div className="text-xl left-7 text-dark-grey">
            Joined on {getFullDay(joinedAt)}
          </div>
        </div>
      
      </>
    );
  };

  return (
    <>
      <Navbar />
      <AnimationWrapper>
        {loading ? (
          <Loader />
        ) : profile_username.length ? (
          <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
            <div className="flex flex-col   min-w-[250px] md:w-[50%] md:pl-8  md:border-l border-grey md:sticky md:-[100px] md:py-10">
              <div className="flex items-center gap-x-20 ">
                <div>
                  <img
                  src={profile_img}
                  alt="profileimf"
                  className="w-20 h-20 rounded-full "
                 />
                </div>
                <div className="flex gap-x-20">
                  <div className=" flex flex-col justify-center items-center">
                    <p>{total_posts?.toLocaleString()}</p>
                    <p>TotalBlogs</p>
                  </div>
                 <div className="flex flex-col justify-center items-center">
                   <p>{total_reads?.toLocaleString()} </p> 
                   <p>TotalReads</p>
                 </div>
                </div>
              </div>
              <p className="text-xl mt-4 capitalize ">{fullname}</p>
              <h1 className=" text-lg mb-1 font-medium">@{profile_username}</h1>
              <p className="text-lg"> {bio.length ? bio : "nothing to read here"}</p>
              <AboutUser />
            </div>
            <div className="max-md:mt-12 w-full">
              <InPageNavigation
                defaultHidden={["About"]}
                routes={["Blogs Published", "About"]}
              >
                <>
                  {blogs == null ? (
                    <Loader />
                  ) : blogs?.results?.length ? (
                    blogs?.results?.map((blog, i) => {
                      return (
                        <AnimationWrapper
                          transition={{ duration: 1, delay: i * 0.1 }}
                          key={i}
                        >
                          <BlogPostCard
                            content={blog}
                            auther={blog?.author?.personal_info}
                          />
                        </AnimationWrapper>
                      );
                    })
                  ) : (
                    <NoDataMessage message="No Blog Published" />
                  )}
                  <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} />
                </>
                <MobileUSer />
              </InPageNavigation>
            </div>
          </section>
        ) : (
          <NotFound />
        )}
      </AnimationWrapper>
    </>
  );
};

export default ProfilePage;
