import React, { useContext } from "react";
import InputBox from "../components/input.component";
import { FcGoogle } from "react-icons/fc";
import { Toaster, toast } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const LoginPage = () => {
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);
  console.log(access_token);
  const userAuthThroughServer = (formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/signin", formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
        toast.success("Login successful");
      })
      .catch(({ response }) => {
        toast.error("Incorrect Credentials");
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    let form = new FormData(formElement);
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

  const handleGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {
        let formData = {
          access_token: user.accessToken,
        };
        userAuthThroughServer("/google-auth", formData);
      })
      .catch((err) => {
        toast.error("Some Error occurred in googlelogin");
        return console.log(err);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper>
      <section className=" background   h-cover background  flex items-center justify-center">
        <Toaster />
        <form
          id="formElement"
          className="w-[80%]  sm:hover:shadow-xl   border-0 sm:border px-4 py-6  rounded-xl border-black/20 max-w-[400px]"
        >
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24 ">
            Welcome Back
          </h1>

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
            Login
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold ">
            <hr className="w-1/2 border-black" />
            <hr className="w-1/2 border-black" />
          </div>
          <button
            onClick={handleGoogleAuth}
            className="btn-dark w-full text-center gap-x-2 flex items-center justify-center "
          >
            Countinue With Google
            <FcGoogle className="text-2xl" />
          </button>

          <p className="mt-4 flex gap-x-2 justify-center items-center ">
            NewUser
            <Link className="text underline" to="/signup">
              Sing up here
            </Link>
          </p>
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default LoginPage;
