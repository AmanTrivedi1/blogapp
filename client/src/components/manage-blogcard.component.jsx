import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';
import { UserContext } from '../App';
import axios from 'axios';


const BlogStats = ({stats}) => {
 
    return (
        <>
        <div className='flex gap-2 max-lg:mb-6 max-lg:border-b pb-4 border-grey '>
            {
                Object.keys(stats).map((info,i) =>{
                    return  !info.includes("parent") ? <div key={i} className={'flex flex-col items-center w-full h-full justify-center p-4 px-6 ' + (i!= 0 ? "border-dark-grey border-l" : " ")} >
                     <h1 className='text-xl lg:text-2xl mb-2'>{stats[info].toLocaleString()}</h1>
                     <p className='max-lg:text-dark-grey capitalize'>{info.split("_")[1]}</p>
                     </div> :" " 
                })
            }
        </div>
        </>
    )
}

export const ManagePublishBlogCard = ({blog}) => {

    const {
        userAuth: { access_token }
      } = useContext(UserContext);

    let { banner , title  , blog_id , publishedAt , activity} = blog;

    let [ showStat , setShowStat] = useState(false);
    console.log(showStat)

  return (
    <>
    <div className='flex    gap-10 border-b mb-6 max-md:px-4 hover border-grey pb-6 items-center'>
        <img  src={banner} className=' w-28 h-28 flex-none rounded-full bg-grey object-cover ' alt="img" />
        <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
          <div className=''>
            <Link  className='blog-title mb-4 hover:underline' to={`/blog/${blog_id}`}>{title}</Link>
            <p className='line-clamp-1 text-sm text-dark-grey'>Published on {getDay(publishedAt)}</p>
            <div className='flex gap-6 mt-3'>
               <Link  className='underline pr-4 py-2'  to={`/editor/${blog_id}`}>Edit</Link>
               <button  className='pr-4 py-2  underline lg:hidden'  onClick={()=> setShowStat(preVal =>!preVal)}>Stats</button>
               <button onClick={(e)=>deleteBlog(blog,access_token , e.target )}  className='pr-4 py-2 underline text-red' >Delete</button>
            </div>
        
          </div>
        </div>

        <div className='max-lg:hidden'>
            <BlogStats stats={activity} />
        </div>
    </div>
          {
            showStat ? <div className='lg:hidden'><BlogStats stats={activity}/></div> : ""
          }
    </>
  )
}

export const ManageDraftBlogPost =({blog  }) =>{

    const {
        userAuth: { access_token }
      } = useContext(UserContext);

  let {title  , des , blog_id , index} = blog;
  index++;
  return (
    <>
    <div className='flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey'>
    <h1 className='blog-index text-center pl-4 mb:pl-6 flex-none'>{index < 10 ? "0" + index: index}</h1>
     <div>
        <h1 className='blog-title mb-3 line-clamp-1'>{title}</h1>
        <p className=''>{des?.length ? des: "No Description provided"}</p>

        <div className='flex gap-6 mt-3'>
           <Link  className='pr-4 py-2 underline' to={`/editor/${blog_id}`}>Edit</Link>
           <button onClick={(e)=>deleteBlog(blog,access_token , e.target )}  className='pr-4 py-2 underline text-red' >Delete</button>
        </div>
     </div>
    </div>
    </>
  )
}

const deleteBlog = ( blog, access_token , target)=>{
    let {index , blog_id , setStateFun} = blog;
    target.setAttribute("disabled", true)
    axios.post(  import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog" ,{blog_id} , {
        headers:{
            "Authorization":`Bearer ${access_token}`
        }
    }).then(({data})=>{
        target.setAttribute("disabled", false);
        setStateFun(preVal => {

            let { deletedDocCount , totalDocs , results  } = preVal ;
            
            results.splice(index , 1 );

            if(!deletedDocCount){
                deletedDocCount =0;

            }

            if(!results.length && totalDocs -1  > 0) {
                return null ; 
            }
         return {...preVal , totalDocs:totalDocs-1 , deletedDocCount:deletedDocCount+1}
        })
    }).catch(err=>{
        console.log(err)
    })
}

export default ManagePublishBlogCard
