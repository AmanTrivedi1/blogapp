import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from './navbar.component'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { IoDocumentsOutline } from "react-icons/io5";
import { HiOutlineBars3CenterLeft } from "react-icons/hi2"
import { GoPencil } from "react-icons/go";
import { MdPassword } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { UserContext } from '../App'

const SideNav = () => {

    let { userAuth:{access_token}} =  useContext(UserContext);

    let page = location.pathname.split("/")[2];

    let [pageState , setPageState] = useState(page.replace('-',''));

    let [showSideNav , setShowSidenav] = useState(false);

    let activeTabLine = useRef();
    let sideBarIconTab  = useRef();
    let pageStateTab= useRef();


    const changePageState = (e) =>{
        
        let {offsetWidth , offsetLeft} = e.target; 
        activeTabLine.current.style.width=offsetWidth+"px";
        activeTabLine.current.style.left=offsetLeft+"px";

        if(e.target == sideBarIconTab.current){
           setShowSidenav(true) 
        } else{
            setShowSidenav(false);
        }
    }
    useEffect(()=>{
      setShowSidenav(false);
      pageStateTab.current.click();
    },[pageState])


  return (
    access_token ===  null ? <Navigate to="/signin"  /> :  
    <>
    <Navbar/>
      <section className='relative flex gap-10 py-0   m-0 max-md:flex-col'>
       <div className='sticky top-[80px] z-30 '>
        <div className=' md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto '>
            <button onClick={changePageState} ref={sideBarIconTab} className='p-5 capitalize'>
              <HiOutlineBars3CenterLeft className='pointer-events-none text-2xl '/>
            </button>
            <button onClick={changePageState} ref={pageStateTab} className='p-5 capitalize'>
              {pageState}
            </button>
            <hr ref={activeTabLine}  className='absolute bottom-0 duration-500 ' />
        </div>

         <div className={"min-w-[200px] h-[calc(100vh-80px-60px)]  md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0  md:border-grey md:border-r absolute  max-md:top-[64px]  bg-white max-md:w-[calc(100%+80px)] max-md:px-16   max-md:-ml-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto" )  }
          >
             <h1 className='text-xl text-dark-grey mb-3'>Dashboard</h1>
             <hr className='border-grey -ml-6 mb-8 mr-6'/>
              
               <NavLink className="sidebar-link" to="/dashboard/blogs" onClick={(e) => setPageState(e.target.innerText)}>
                <IoDocumentsOutline/>Blogs
              </NavLink>

              <NavLink className="sidebar-link" to="/dashboard/notification" onClick={(e) => setPageState(e.target.innerText)}>
              <IoIosNotificationsOutline/>  Notification
              </NavLink>

              <NavLink className="sidebar-link" to="/editor" onClick={(e) => setPageState(e.target.innerText)}>
                 <GoPencil/> Write
              </NavLink>


             <h1 className='text-xl text-dark-grey mt-20  mb-3'>Settings</h1>
             <hr className='border-grey -ml-6 mb-8 mr-6'/>


              <NavLink className="sidebar-link" to="/settings/edit-profile" onClick={(e) => setPageState(e.target.innerText)}>
                 <CiEdit/> Edit Profile
              </NavLink>
              <NavLink className="sidebar-link" to="/settings/change-password" onClick={(e) => setPageState(e.target.innerText)}>
                 <MdPassword/> Change Password
              </NavLink>


         </div>
       </div>
       <div className='max-md:-mt-8 mt-5 w-full'>
        <Outlet/>
      </div>
      </section>
      
   
    </>
  )
}

export default SideNav
