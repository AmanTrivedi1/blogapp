import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { AiOutlineCloseCircle } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";

const PublishForm = () => {
  const charValue = 120;
  let { blog_id } = useParams();
  console.log("I am published form id ", blog_id);

  let {
    blog,
    blog: { banner, title, tags, des, content, draft },
    setEditorState,
    setBlog,
  } = useContext(EditorContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let navigate = useNavigate();

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogDescChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, des: input.value });
  };
  const handleBlogTitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };
  const handleTitleKeydown = (e) => {
    console.log(e);
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };
  const taglimit = 10;
  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let tag = e.target.value;
      if (tags?.length < taglimit) {
        if (!tags?.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add max ${taglimit} tags`);
      }
      e.target.value = "";
    }
  };

  const publishBlog = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title?.length) {
      return toast.error("Write Blog title to publish");
    }
    if (!des?.length || des?.length > charValue) {
      return toast.error(
        `Write description about your blog within ${charValue} this limit to publish `
      );
    }
    if (!tags?.length || tags?.length > taglimit) {
      return toast.error(`PLease add atleast 1 tag out of ${taglimit}  `);
    }
    let loadingToast = toast.loading("Magic is happening...");
    e.target.classList.add("disable");

    let blogObj = {
      title,
      banner,
      des,
      content,
      tags,
      draft: false,
    };

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
        { ...blogObj, id: blog_id },
        {
          headers: {
            Authorization: `Bearer ${access_token} `,
          },
        }
      )
      .then(() => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        toast.success("Wo hooo blog is Published 👍");

        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);

        return toast.error(response.data.error);
      });
  };

  return (
    <>
      <AnimationWrapper>
        <section className="  bg-black/10 w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
          <Toaster />
          <button
            onClick={handleCloseEvent}
            className="w-12  h-12 absolute right-[5vw] z-10  top-[5%] lg:top-[10%] "
          >
            <AiOutlineCloseCircle className="text-2xl" />
          </button>
          <div className="max-w-[550px] center">
            <p className="text-dark-grey text-2xl">Preview</p>
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-grey mt-4">
              <img className="" src={banner} alt="banner" />
            </div>
            <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
              {title}
            </h1>
            <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
              {des}
            </p>
          </div>
          <div className=" border-grey  lg:border-1 lg:pl-8 ">
            <p className="text-dar-grey mb-2 mt-9">Blog Title</p>
            <input
              onChange={handleBlogTitleChange}
              className="input-box pl-4"
              type="text"
              placeholder="blog title"
              defaultValue={title}
            />

            <p className="text-dar-grey mb-2 mt-9">
              Short Description about your blog
            </p>
            <textarea
              className="h-40 resize-none leading-7 input-box  pl-4 "
              maxLength={charValue}
              defaultValue={des}
              type="text"
              placeholder="blog title"
              onChange={handleBlogDescChange}
              onKeyDown={handleTitleKeydown}
            ></textarea>
            <p className="mt-1 text-dark-grey text-sm text-right">
              {charValue - des?.length} out of 160 left
            </p>
            <p className="mt-2 text-dark-grey text-sm text-left">
              Topics- (Helps in searching and ranking the blog post)
            </p>
            <div className="relative input-box pl-2 py-2 pb-4">
              <input
                className="sticky input-box focus:bg-white bg-white top-0 left0 pl-4 mb-3"
                type="text"
                placeholder="react JS "
                onKeyDown={handleKeyDown}
              />

              {tags.map((tag, index) => {
                return <Tag tag={tag} tagIndex={index} key={index} />;
              })}
            </div>
            <p className="mt-2 mb-4 text-sm text-dark-grey text-right">
              {" "}
              {taglimit - tags?.length} Out of 10 tags Left{" "}
            </p>

            <button
              onClick={publishBlog}
              className="btn-dark   s w-full sm:w-auto px-8"
            >
              Publish
            </button>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default PublishForm;
