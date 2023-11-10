import React from "react";

const storeInSession = (key, value) => {
  sessionStorage.setItem(key, value);

  return (
    <>
      <div>storeInSession</div>
    </>
  );
};

const lookInSession = (key) => {
  return sessionStorage.getItem(key);
};

const removeFromSession = (key) => {
  return sessionStorage.removeItem(key);
};

const logOutUser = () => {
  sessionStorage.clear();
};

export { storeInSession, lookInSession, removeFromSession, logOutUser };
