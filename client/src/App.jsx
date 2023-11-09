import Navbar from "./components/navbar.component";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signin" element={<UserAuthForm type="sing-in" />} />
          <Route path="/signup" element={<UserAuthForm type="sing-up" />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
