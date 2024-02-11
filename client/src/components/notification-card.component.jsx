import { comment } from 'postcss';
import { FaRegEye } from "react-icons/fa6";
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';
import NotificationCommenstField from './notification-comment-field.component';
import axios from 'axios';
import { UserContext } from '../App';

const NotificationCard = ({data , index, notificationState }) => {

    let {userAuth:{access_token}} = useContext(UserContext);
    let[isReplying , setReplying ] = useState(false);

    let { seen, type , createdAt , comment, replied_on_comment, user ,user: { personal_info : {fullname , username ,profile_img}} , blog: {  _id ,blog_id , title} , _id:notificatio_id} = data;

    let { notifications, notifications: {results , totalDocs } , setNotifications} = notificationState;

    const handleReplyClick = ()  => {
         setReplying(preVal => !preVal)
    }

    const handelDelete = (comment_id , type , target) => {
        
        target.setAttribute("disabled" , true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN+ "/delete-comment" , {_id:comment_id} , {
            headers: {
                "Authorization":`Bearer ${access_token}`
            }
        }).then(() => {
            if(type == "comment"){
            results.splice(index , 1);
            }else  {
                delete results[index].reply;
                target.setAttribute("disabled" , false);
                setNotifications({...notifications , results , totalDocs:totalDocs-1 , deleteDocCount:notifications.deleteDocCount+1})
            }
        }).catch(err => {
            console.log(err)
        }) 
    }

  return (
    <>
      <div className={'backdrop backdrop-blur-sm  relative mb-4 bg-white/30 bg-opacity-10 p-6 border-b  border-grey border-l-black ' + (!seen ? "border-l-2 " : "" )}>
            <div className='flex gap-5  mb-3  '> 
            {
                seen ? <FaRegEye className='absolute text-dark-grey top-4 right-4'/> : " "
            }
                <img  className='w-14 border h-14 flex-none rounded-full '  src={profile_img}  alt="img" />
                <div className='w-full'>
                    <h1 className='font-medium  text-xl text-dark-grey'> 
                        <span className='lg:inline-block hidden capitalize'>{fullname}</span>
                        <Link className='mx-1 text-black underline' to={`/user/${username}`}>@{username}</Link>
                        <span className='font-normal'>
                            {
                                type == "like" ? "Liked your blog" : 
                                type== "comment" ? "commented on" : 
                                "replied on"
                            }
                        </span>
                    </h1>
                    {
                        type=="reply" ? 
                        <div className='p-4 mt-2 rounded-md bg-grey'>
                            <p>{replied_on_comment.comment}</p>
                        </div> 
                        :  
                        <Link to={`/blog/${blog_id}`} className='font-medium text-dark-grey hover:underline line-clamp-1'>{`"${title}"`}</Link>
                    }

                     
                     {
                        type!= 'like' ? 
                        <p className=' font-gelasio text-xl my-5'>{comment?.comment}</p>
                        : " "
                     }
                     <div className='  text-dark-grey flex gap-8'>
                        <p>{getDay(createdAt)}</p>  
                         {
                            type !="like" ? 
                            <>
                            <button  onClick={handleReplyClick} className='underline hover:text-black '>Reply</button>
                            <button  onClick={(e) => handelDelete(comment._id , "comment" , e.target)}  className='underline hover:text-red'>Delete</button>
                            </> : ""
                         }
                     </div>
                </div>
            </div>
         {
            isReplying ? 
            <div className='mt-8 '>
                   <NotificationCommenstField _id={_id} blog_author={user}  index={index} replyingTo={comment._id}
                    setReplying={setReplying} notificatio_id={notificatio_id}
                    notificationData={notificationState}
                    />
            </div> : " "
         }
      </div> 
    </>
  )
}

export default NotificationCard
