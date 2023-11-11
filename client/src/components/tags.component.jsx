import React, { useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { EditorContext } from "../pages/editor.pages";
const Tag = ({ tag, tagIndex }) => {
  let {
    blog,
    blog: { tags },
    setBlog,
  } = useContext(EditorContext);
  const handleDeletingTag = () => {
    tags = tags.filter((t) => t != tag);
    setBlog({ ...blog, tags });
  };
  const handleTagEdit = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      let currentTag = e.target.innerText;
      tags[tagIndex] = currentTag;
      setBlog({ ...blog, tags });
      e.target.setAttribute("contentEditable", false);
    }
  };
  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };
  return (
    <>
      <div className=" relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:opacity-50 pr-8">
        <p
          className="outline-none"
          onKeyDown={handleTagEdit}
          onClick={addEditable}
        >
          {tag}
        </p>
        <button
          onClick={handleDeletingTag}
          className="mt-[2px] rounded-full absolute right-2 top-1/2 -translate-y-1/2"
        >
          <AiOutlineClose className="pointer-events-none " />
        </button>
      </div>
    </>
  );
};

export default Tag;
