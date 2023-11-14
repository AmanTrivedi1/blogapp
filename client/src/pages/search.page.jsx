import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.component";
import { useParams } from "react-router-dom";
import Loader from "../components/loader.component";
import InPageNavigation from "../components/inpage-navigation.component";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import UserCard from "../components/usercard.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";

const SeacrhPage = () => {
  let { query } = useParams();
  let [blogs, setBlog] = useState(null);
  let [user, setUser] = useState(null);
  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });

        setBlog(formatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUsers = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
      .then(({ data: { users } }) => {
        setUser(users);
        console.log(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlog(null);
    setUser(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {user == null ? (
          <Loader />
        ) : user.length ? (
          user.map((use, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={use} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No User Found" />
        )}
      </>
    );
  };

  return (
    <>
      <Navbar />
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full ">
          <InPageNavigation
            routes={[`Results "${query}"`, "Accounts"]}
            defaultHidden={["Accounts"]}
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
              <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />
            </>
            <UserCardWrapper />
          </InPageNavigation>
        </div>
        <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hodden">
          <h1 className="font-medium text-xl mb-8">User Realted to search</h1>
          <UserCardWrapper />
        </div>
      </section>
    </>
  );
};

export default SeacrhPage;
