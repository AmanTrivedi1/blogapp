import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogContent from "../components/blog-content.component";
import RelateBlogCard from "../components/related-blogcomponent";
import CommentsContainer, { fetchComments } from "../components/comments.component";
import toast from "react-hot-toast";

export const blogStructure = {
  title: " ",
  des: "",
  content: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};
export const BlogContext = createContext({});
const BlogPage = () => {
  let { blog_id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [similarBlog, setSimilarBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [islikedbyuser, setIsLikedByUser] = useState();


  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;
  const fetchblog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
      .then(  ({ data: { blog } }) => {
        // blog.comments = await fetchComments({
        //   blog_id: blog._id,
        //   setParentCommentCountFun: setTotalParentCommentsLoaded
        // });
      setBlog(blog)
        console.log(blog)
        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            tag: blog.tags[0],
            limit: 10,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlog(data.blogs);
          });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(err);
      });
  };
  

  useEffect(() => {
    resetStates();
    fetchblog();
  }, [blog_id]);

  const resetStates = () => {
    setBlog(blogStructure);
    setSimilarBlog(null);
    setLoading(true);
    setIsLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  };

  return (
    <>
      <AnimationWrapper>
        {loading ? (
          <Loader />
        ) : (
          <BlogContext.Provider
            value={{
              blog,
              setBlog,
              islikedbyuser,
              setIsLikedByUser,
              commentsWrapper,
              setCommentsWrapper,
              totalParentCommentsLoaded,
              setTotalParentCommentsLoaded,
            }}
          >
            <CommentsContainer />
            <div className="bg-[#212121] min-h-screen">
              <Link
                className=" absolute top-10   p-2 rounded-full text-white/40  mt-5  left-10"
                to="/"
              >
                <FaArrowLeft />
              </Link>
              <div className="max-w-[900px] text-white center py-10 max-lg:px-[5vw] ">
                <img
                  src={banner}
                  className="aspect-video rounded-lg"
                  alt="banner img"
                />
                <div className="mt-12 ">
                  <h1 className="capitalize text-white text-3xl line-clamp-2 ">
                    {title}
                  </h1>
                  <div className="flex max-sm:flex-col justify-between my-8 ">
                    <div className="flex items-center gap-5  ">
                      <img
                        className="w-[40px] h-[40px] rounded-full"
                        src={profile_img}
                        alt="profileimage"
                      />
                      <p className="text-white capitalize line-clamp-1">
                        {fullname}
                      </p>
                      <br />
                      <Link
                        className="text-white/50 underline line-clamp-1 "
                        to={`/user/${author_username}`}
                      >
                        @{author_username}
                      </Link>
                    </div>
                  </div>
                  <p className="text-dark-grey opacity-90  max-sm:mt-6 max-sm:ml-12 max-sm:pl-5 ">
                    Published on {getDay(publishedAt)}
                  </p>
                </div>
                <BlogInteraction />

                <div className="my-12 blog-page-content">
                  {content[0].blocks.map((block, i) => {
                    return (
                      <div className="my-4 md:my-8 " key={i}>
                        <BlogContent block={block} />
                      </div>
                    );
                  })}
                </div>
                {similarBlog != null && similarBlog.length ? (
                  <h1 className="text-3xl font-bold mb-10 mt-20 text-white">
                    Similar Blog's
                  </h1>
                ) : (
                  <></>
                )}
                {similarBlog != null && similarBlog.length ? (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center  ">
                    {similarBlog.map((blog, i) => {
                      let {
                        author: { personal_info },
                      } = blog;
                      return (
                        <AnimationWrapper
                          key={i}
                          transition={{ duration: 1, delay: i * 0.08 }}
                        >
                          <div className="">
                            <RelateBlogCard
                              content={blog}
                              auther={personal_info}
                            />
                          </div>
                        </AnimationWrapper>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
                <BlogInteraction />
              </div>
            </div>
          </BlogContext.Provider>
        )}
      </AnimationWrapper>
    </>
  );
};
export default BlogPage;
