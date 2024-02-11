import Navbar from "./components/navbar.component";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import Homepage from "./pages/home.page";
import SeacrhPage from "./pages/search.page";
import NotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNav from "./components/sidenavbar.component";
import ChnagePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";
import Notifications from "./pages/notifications.page";

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
            <Route path="/editor/:blog_id" element={<Editor />} />
            <Route path="/" element={<Navbar />} />
            <Route index element={<Homepage />} />
            <Route path="dashboard" element={<SideNav/>}>
                   <Route path="notifications" element={<Notifications/>} />
            </Route>
            <Route path="settings" element={<SideNav/>}>
                   <Route path="edit-profile" element={<EditProfile/>} />
                   <Route path="change-password" element={<ChnagePassword/>} />
            </Route>
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="search/:query" element={<SeacrhPage />} />
            <Route path="user/:id" element={<ProfilePage />} />
            <Route path="blog/:blog_id" element={<BlogPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
};

export default App;
