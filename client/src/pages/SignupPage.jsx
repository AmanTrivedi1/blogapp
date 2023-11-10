import React, { useRef } from "react";
import InputBox from "../components/input.component";
import { FcGoogle } from "react-icons/fc";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";

const SignupPage = () => {
  const authForm = useRef();
  const userAuthThroughServer = (formData) => {
    console.log(import.meta.env.VITE_SERVER_DOMAIN + "/signup", formData);
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/signup", formData)
      .then(({ data }) => {
        console.log(data);
        toast.success("Singup  successful");
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    let form = new FormData(authForm.current);
    const formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { fullname, email, password } = formData;

    if (fullname) {
      if (fullname?.length < 3) {
        return toast.error("Name must be > 3 letters ");
      }
    }
    if (!email?.length) {
      return toast.error("Enter Email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 char long with numeric , 1 lowercase letter  & 1 Uppercase letter "
      );
    }
    userAuthThroughServer(formData);
    console.log(formData);
  };
  return (
    <>
      <AnimationWrapper>
        <section className=" background   h-cover background  flex items-center justify-center">
          <Toaster />
          <form
            ref={authForm}
            className="w-[80%]  sm:hover:shadow-xl   border-0 sm:border px-4 py-6  rounded-xl border-black/20 max-w-[400px]"
          >
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24 ">
              Join us today
            </h1>

            <InputBox
              name="fullname"
              type="text"
              placeholder="Full name"
              icon="fi-rr-user"
            />

            <InputBox
              name="email"
              type="text"
              placeholder="Email"
              icon="fi-rr-envelope"
            />
            <InputBox
              name="password"
              type="password"
              placeholder="Password"
              icon="fi-rr-key"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn-dark w-full center mt-14 "
            >
              Signup
            </button>

            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold ">
              <hr className="w-1/2 border-black" />
              <hr className="w-1/2 border-black" />
            </div>
            <button className="btn-dark w-full text-center gap-x-2 flex items-center justify-center ">
              Countinue With Google
              <FcGoogle className="text-2xl" />
            </button>
          </form>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default SignupPage;
