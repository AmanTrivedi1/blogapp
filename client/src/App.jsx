import Navbar from "./components/navbar.component";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import Homepage from "./pages/home.page";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});
  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({
          access_token: null,
        });
  }, []);
  return (
    <>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Router>
          <Routes>
            <Route path="/editor" element={<Editor />} />
            <Route path="/" element={<Navbar />} />
            <Route index element={<Homepage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
};

export default App;
