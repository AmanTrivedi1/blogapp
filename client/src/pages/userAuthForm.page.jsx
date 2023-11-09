import React from "react";
import InputBox from "../components/input.component";
import { AiOutlineUserAdd } from "react-icons/ai";
const UserAuthForm = ({ type }) => {
  return (
    <>
      <section className="h-cover flex items-center justify-center">
        <form className="w-[80%] max-w-[400px]">
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
        </form>
      </section>
    </>
  );
};

export default UserAuthForm;
