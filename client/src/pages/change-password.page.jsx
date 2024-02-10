import React, { useContext, useRef } from 'react'
import AnimationWrapper from "../common/page-animation"
import InputBox from "../components/input.component"
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { UserContext } from '../App';
const ChnagePassword = () => {

    let {userAuth :  {access_token}} = useContext(UserContext);

    let changePasswordForm = useRef();

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const handleSubmit =(e) =>{
         e.preventDefault();

         let form = new FormData(changePasswordForm.current)

         let formData = {};

         for(let [key , value] of form.entries()){
            formData[key] = value
         }

         let { currentPassword , newPassword} = formData;

         if(!currentPassword.length || !newPassword.length){
            return toast.error("Fill all the inputs😡")
         }

         if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("Password should be 6 to 20 char long with a numeric , 1 lowercase and 1 upercase")
         }

         e.target.setAttribute("disabled", true);

         let loadingToast =  toast.loading("Updating...");

         axios.post(import.meta.env.VITE_SERVER_DOMAIN+ "/change-password" , formData , {
            headers:{
                'Authorization':`Bearer ${access_token}`
            }
         }).then(()=>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.success("Password updated")
         }).catch(({response}) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.error(response.data.error)
         })
    }


  return (
    <>
    <Toaster/>
        <AnimationWrapper>
            <form ref={changePasswordForm}>
                <h1 className='max-md:hidden '>Chnage Password</h1>
                <div className='py-10 w-full md:max-w-[400px]'>
                    <InputBox name="currentPassword" type="password" className="profile-edit-input" placeholder="Current Password"/> 
                    <InputBox name="newPassword" type="password" className="profile-edit-input" placeholder="New Password"/>
                    <button   onClick={handleSubmit} className='btn-dark px-10 ' type="submit">Change Password</button>
                </div>
            </form>
        </AnimationWrapper>
    </>
  )
}

export default ChnagePassword
