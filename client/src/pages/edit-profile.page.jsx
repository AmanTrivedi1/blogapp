import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios'
import { FaRegUser } from "react-icons/fa";
import { profileDataStructure } from './profile.page';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import toast, { Toaster } from 'react-hot-toast';
import InputBox from '../components/input.component';
import { uploadImage } from '../common/aws';
import { storeInSession } from '../common/session';

const EditProfile = () => {

    let bioLimit=140;
    let profileImgEle = useRef();
    const [profile , setProfile] = useState(profileDataStructure);
    const [loading , setLoading] = useState(true);
    const [charactersLeft , setCharactersLeft] = useState(bioLimit);
    const [updatedProfileImg , setUpdatedProfileImg] = useState(null);
   

    let { personal_info :{fullname , username:profile_username  , profile_img , email , bio} , social_links} = profile;

    let {  userAuth , userAuth:{access_token } , setUserAuth} = useContext(UserContext)
    useEffect(()=>{
        if(access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/get-profile", {username:userAuth.username}).then(({data})=>{
                setProfile(data);
                setLoading(false);
            }).catch(err =>{
                console.log(err)
            })
        }
    },[access_token])

    const handleCharacterChange =(e) => {
        setCharactersLeft(bioLimit - e.target.value.length)
    }

    const handleImagePreview = (e) =>{
      
        let img = e.target.files[0]
        profileImgEle.current.src=URL.createObjectURL(img);
        setUpdatedProfileImg(img);
    }

    const handleImgUpload = (e) =>{
        e.preventDefault();
        if(updatedProfileImg) {
            let loadingToast = toast.loading("Uploading...")
            e.target.setAttribute("disabled", true); 
            uploadImage(updatedProfileImg).then(url => {
                if(url) {
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN+ "/update-profile-img" , {url} , {
                        headers:{
                            "Authorization":`Bearer ${access_token}`
                        }
                    }).then (({data}) => {
                        let newUserAuth = {...userAuth , profile_img:data.profile_img}
                         storeInSession("user", JSON.stringify(newUserAuth));
                         setUserAuth(newUserAuth);

                         setUpdatedProfileImg(null);
                         toast.dismiss(loadingToast);
                         e.target.setAttribute("disabled", false); 
                         toast.success("Uloaded succefully")

                    }).catch(({response}) =>{
                        toast.dismiss(loadingToast);
                        e.target.setAttribute("disabled", false); 
                        toast.error(response.data.error)
                    })
                }
            }).catch(err =>{
                console.log(err)
            })
        }
    }
  return (
    <>
    <Toaster/>
    <AnimationWrapper>
        {
            loading ? <Loader/> : 
            <form>
                  <h1 className='max-md:hidden'>Edit Profile</h1>  
                   <div className='flex flex-col lg:row items-start py-10 gap-10'>
                        <div className='max-lg:centre mb-5'>
                            <label htmlFor="uploadImg" id="profileImgLable" className='relative block w-48 h-48 bg-grey rounded-full  border-black/30 border-2 hover:border-0 overflow-hidden' >
                                <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer'>Upload Img</div>
                                <img ref={profileImgEle} src={profile_img} alt="Profile Img"/>
                                <div className=''> </div>
                            </label>
                            <input type="file" id="uploadImg" accept=".jpeg , .png , .jpg" hidden onChange=  {handleImagePreview}/>
                            <button onClick={handleImgUpload} className='btn-light mt-5 max-lg:center lg:w-full px-14'>Upload</button>
                        </div>
                  </div>

                  <div className='w-full'>
                     <div className='grid grid-col-1 md:grid-cols-2 md:gap-5'>
                           <div>
                              <InputBox name="fullname" type="text" value={fullname}
                               placeholder="FullName"  icon="fi-rr-user"  disable="true"/>
                           </div>
                           <div>
                              <InputBox name="email" type="email" value={email}
                               placeholder="FullName"  icon="fi-rr-envelope"  disable="true"/>
                           </div>
                     </div>
                     <InputBox  icon="fi-rr-at" type="text" name="username" value={profile_username}            placeholder="username"/>
                         <p className='text-dark-grey -mt-3'>Username will use to search user or visible to all the user</p>
                           <textarea name="bio"  onChange={handleCharacterChange} defaultValue={bio} className='input-box h-64     leading-7   mt-5 pl-5 lg:h-40 resize-none' maxLength={bioLimit}  >
                            </textarea>
                                <p className='mt-1 text-dark-grey'>{charactersLeft} character left</p>
                                <p className='my-6 text-dark-grey'>Add your social handles below</p>
                               <div className='md:grid md:grid-cols-2 gap-x-6'>
                                  {
                                     Object.keys(social_links).map((key, i) => {
                                     let link = social_links[key];
                                     <i className={"fi "+ (key!= "website" ?  "fi-brands-"+ key : "fi-rr-globe")+    "text-2xl hover:text-black"}></i>
                                      return <InputBox key={i} icon={"fi "+ (key!= "website" ?  "fi-brands-"+ key : "fi-rr-globe")} name={key} type="text" value={link} placeholder="https://itsmeaman.vercel.app"/>
                                  })
                                 }
                              </div>
                              <button className='btn-dark mb-4 w-full sm:w-auto'>Update</button>
                     </div> 
            </form>
        }
    </AnimationWrapper>
    </>
  )
}

export default EditProfile
