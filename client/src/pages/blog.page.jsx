import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";

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
      .then(({ data: { blog } }) => {
        setBlog(blog);
        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            tag: blog.tags[0],
            limit: 10,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlog(data.blogs);
            console.log(data.blogs);
          });

        setLoading(false);
        console.log(blog);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
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
  };

  return (
    <>
      <AnimationWrapper>
        {loading ? (
          <Loader />
        ) : (
          <BlogContext.Provider value={{ blog, setBlog }}>
            <div className="bg-[#212121]">
              <div className="max-w-[900px] text-white center py-10 max-lg:px-[5vw] ">
                <img
                  src={banner}
                  className="aspect-video rounded-lg"
                  alt="banner img"
                />
                <div className="mt-12 ">
                  <h1 className="capitalize text-white text-3xl">{title}</h1>
                  <div className="flex max-sm:flex-col justify-between my-8 ">
                    <div className="flex items-center gap-5  ">
                      <img
                        className="w-[40px] h-[40px] rounded-full"
                        src={profile_img}
                        alt="profileimage"
                      />
                      <p className="text-white capitalize">{fullname}</p>
                      <br />
                      <Link
                        className="text-white/50 underline "
                        to={`/user/${author_username}`}
                      >
                        @{author_username}
                      </Link>
                    </div>
                  </div>
                  <p className="text-dark-grey opacity-90 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5 ">
                    Published on {getDay(publishedAt)}
                  </p>
                </div>
                <BlogInteraction />
                {similarBlog != null && similarBlog.length ? (
                  <>
                    {similarBlog.map((blog, i) => {
                      let {
                        author: { personal_info },
                      } = blog;
                      return (
                        <AnimationWrapper
                          key={i}
                          transition={{ duration: 1, delay: i * 0.08 }}
                        >
                          <BlogPostCard content={blog} auther={personal_info} />
                        </AnimationWrapper>
                      );
                    })}
                  </>
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
