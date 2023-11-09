import React, { useState } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
  const [passwordtype, setShowPassword] = useState(false);
  return (
    <>
      <div className="relative  w-[100%] mb-4 ">
        <input
          type={
            type == "password" ? (passwordtype ? "text" : "password") : type
          }
          className="input-box"
          name={name}
          placeholder={placeholder}
          defaultValue={value}
          id={id}
        />
        <i className={"fi " + icon + " input-icon"}></i>
        {type == "password" ? (
          <i
            className="fi fi-rr-eye input-icon left-[auto] cursor-pointer right-4"
            onClick={() => setShowPassword((currentValue) => !currentValue)}
          ></i>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default InputBox;
