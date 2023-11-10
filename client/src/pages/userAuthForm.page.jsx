import React from "react";
import InputBox from "../components/input.component";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
const UserAuthForm = ({ type }) => {
  return (
    <>
      <AnimationWrapper keyValue={type}>
        <section className=" background   h-cover background  flex items-center justify-center">
          <form className="w-[80%]  hover:shadow-xl hover:shadow-red  border-0 sm:border px-4 py-6  rounded-xl border-black/20 max-w-[400px]">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-24 ">
              {type === "sing-in" ? "Welcome back" : "Join us today"}
            </h1>
            {type != "sing-in" ? (
              <InputBox
                name="FullName"
                type="text"
                placeholder="Full name"
                icon="fi-rr-user"
              />
            ) : (
              ""
            )}
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
            <button type="submit" className="btn-dark w-full center mt-14 ">
              {type.replace("-", " ")}
            </button>
            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold ">
              <hr className="w-1/2 border-black" />
              <hr className="w-1/2 border-black" />
            </div>
            <button className="btn-dark w-full text-center gap-x-2 flex items-center justify-center ">
              Countinue With Google
              <FcGoogle className="text-2xl" />
            </button>
            {type === "sign-in" ? (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Don't have Account
                <Link
                  to="/signup"
                  className="underline text-black text-xl ml-1 "
                >
                  Join Us Today
                </Link>
              </p>
            ) : (
              <p className="mt-6 text-dark-grey text-xl text-center">
                Already a menber ?
                <Link
                  to="/signin"
                  className="underline text-black text-xl ml-1 "
                >
                  Sign in here
                </Link>
              </p>
            )}
          </form>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default UserAuthForm;
