import React, { useState } from "react";

const CommentField = ({ action }) => {
  const [comment, setComment] = useState("");
  return (
    <>
      <textarea
        onChange={(e) => setComment(e.target.value)}
        className="input-box bg-black/10 text-white/50  focus:bg-black/20 placeholder:white resize-none
        h-[150px] overflow-auto
         pl-5"
        value={comment}
        placeholder="leave a comment"
      ></textarea>

      <button className="btn-light px-6 py-2 mt-5 ">{action}</button>
    </>
  );
};

export default CommentField;
