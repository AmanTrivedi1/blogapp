import React, { useContext, useState } from "react";

import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({ action }) => {
  let {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBLogs,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const [comment, setComment] = useState("");
  let {
    userAuth: { access_token, username, fullname, profile_img },
  } = useContext(UserContext);

  const handleComment = () => {
    if (!access_token) {
      return toast.error("Login kar k ao");
    }
    if (!comment.length) {
      return toast.error("Write something to leave a comment ...");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
        {
          _id,
          blog_author,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setComment("");
        data.commented_by = {
          personal_info: { username, profile_img, fullname },
        };

        let newCommentArr;

        data.childrenLevel = 0;

        newCommentArr = [data];

        let parentCommentIncrementval = 1;

        setBLogs({
          ...blog,
          comments: { ...comments, results: newCommentArr },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments:
              total_parent_comments + parentCommentIncrementval,
          },
        });

        setTotalParentCommentsLoaded(
          (prevval) => prevval + setTotalParentCommentsLoaded
        );
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Toaster />
      <textarea
        onChange={(e) => setComment(e.target.value)}
        className="input-box bg-black/10 text-white/80  focus:ehite/60 placeholder:white/80 resize-none
        h-[180px] overflow-auto
         pl-5"
        value={comment}
        placeholder="Leave a thought"
      ></textarea>
      <button onClick={handleComment} className="btn-light px-6 py-2 mt-5 ">
        {action}
      </button>
    </>
  );
};

export default CommentField;
