import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { UserContext } from '../App';
import axios from 'axios';

const NotificationCommenstField = ({_id , blog_author , index=undefined , replyingTo= undefined , setReplying , notificatio_id , notificationData}) => {
 const [comment , setComment] = useState(' ');
 
 let {_id:user_id} = blog_author;
 let {userAuth:{access_token}} = useContext(UserContext);
 let { notifications ,  notifications:{results} , setNotifications} = notificationData;

 console.log("Hello i am here under the water")
 console.log(notificationData);


const handleComment = () => {
         if(!access_token){
          return toast.error("Please login first");
         }
         if(!comment.length){
          return toast.error("Write something to leave comment...")
         }
         axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/add-comment", {
          _id , blog_author:user_id , comment , replying_to:replyingTo , notificatio_id 
         } , {
          headers:{
            "Authorization" : `Bearer ${access_token}`
          }
         }).then(({data}) =>{
              console.log(data);
         }).catch(err =>{
          console.log(err)
         })
  }

  return (
    <div>
    <Toaster />
      <textarea
        onChange={(e) => setComment(e.target.value)}
        className="input-box bg-black/10 text-black  scrollbar-hide  placeholder:white/80 resize-none
        h-[180px] overflow-auto
         pl-5"
        value={comment}
        placeholder="Leave a thought"
      ></textarea>
        <button disabled onClick={handleComment} className="btn-light px-6 py-2 mt-5 ">
            reply
      </button>
    </div>
  )
}

export default NotificationCommenstField
