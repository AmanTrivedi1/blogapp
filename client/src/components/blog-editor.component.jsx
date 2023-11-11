import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import { Toaster, toast } from "react-hot-toast";
import Banner from "../imgs/blog banner.png";
import AnimationWrapper from "../common/page-animation";
import { uploadImage } from "../common/aws";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";

const BlogEditor = () => {
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holderId: "textEditor",
        data: "",
        tools: tools,
        placeholder: "Lets write awesom Story",
      })
    );
  }, []);

  console.log(blog);
  const handleBannerUpload = (e) => {
    console.log(e);
    let img = e.target.files[0];
    if (img) {
      let loadingToast = toast.loading("Processing ");
      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded👍");
            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err);
        });
    }
  };
  const handleTitleKeydown = (e) => {
    console.log(e);
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };
  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    img.src = Banner;
  };

  const handlePublishEvent = () => {
    if (!banner?.length) {
      return toast.error("Fill the Blog banner");
    }
    if (!title?.length) {
      return toast.error("Fill the Blog Title");
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data?.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            toast.error("Write Something in your blog");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to="/" className="flex-none w-10 ">
          <img src={logo} alt="Logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title?.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto ">
          <button className="btn-dark py-2  " onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2">Draft</button>
        </div>
      </nav>
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative border-dotted aspect-video rounded-xl hover:opacity-80 bg-white border-4 border-grey/70">
              <label htmlFor="uploadBanner">
                <img
                  src={banner}
                  alt="/banner"
                  className="z-20"
                  onError={handleError}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png , .jpg ,jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
          </div>

          <textarea
            className="text-3xl mt-10 leading-tight placeholder:opacity-60
             font-medium w-full h-20 outline-none resize-none"
            placeholder="Blog Title"
            onKeyDown={handleTitleKeydown}
            onChange={handleTitleChange}
          ></textarea>

          <hr className="w-full opacity-10 my-5" />
          <div id="textEditor" className="font-gelasio "></div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
