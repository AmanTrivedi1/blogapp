import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.component";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { BiTrendingUp } from "react-icons/bi";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const Homepage = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlog] = useState();
  let [pageState, setPageState] = useState("home");

  let categories = [
    "programing",
    "next js",
    "social media",
    "cooking",
    "reactjs",
    "sonam",
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", {
        page: page,
      })
      .then(async ({ data }) => {
        console.log(data.blogs);
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });
        console.log(formatedData);
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetcBlogByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: {
            tag: pageState,
          },
        });
        setBlogs(formatedData);
        console.log(blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlog = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlog(data.blogs);
        console.log(trendingBlogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlogs(null);
    if (pageState == category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  useEffect(() => {
    activeTabRef.current.click();
    if (pageState == "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetcBlogByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlog();
    }
  }, [pageState]);
  return (
    <>
      <AnimationWrapper>
        <Navbar />
        <section className="h-cover flex justify-center gap-10">
          <div className="w-full">
            <InPageNavigation
              defaultHidden={["trending blogs"]}
              routes={[[pageState], "trending blogs"]}
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
                <LoadMoreDataBtn
                  state={blogs}
                  fetchDataFun={
                    pageState == "home" ? fetchLatestBlogs : fetcBlogByCategory
                  }
                />
              </>

              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No Trending blog founded" />
              )}
            </InPageNavigation>
          </div>
          <div className="min-w-[40%]  right-0  lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
            <div className="flex flex-col gap-10  ">
              <div className="">
                <h1 className="mb-8">Some hot topics</h1>
                <div className="flex gap-3 flex-wrap">
                  {categories.map((category, i) => {
                    return (
                      <button
                        onClick={loadBlogByCategory}
                        className={
                          "tag " +
                          (pageState == category ? "bg-black text-white" : " ")
                        }
                        key={i}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="">
                <h1 className="font-medium flex items-center text-xl mb-8">
                  Treanding
                  <BiTrendingUp className="text-2xl" />
                </h1>
                {trendingBlogs == null ? (
                  <Loader />
                ) : trendingBlogs.length ? (
                  trendingBlogs.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <MinimalBlogPost blog={blog} index={i} />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message="No Trending blog founded" />
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default Homepage;
