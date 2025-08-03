import { Routes, Route } from "react-router-dom";
import Home from '../Pages/Home';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Test from '../Pages/Test';
import Profile from '../Pages/Profile';
import QuestionPage from '../Pages/QuestionPage';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import OtpVerification from '../Pages/OtpVerification';
import UserAuth from '../Auth/UserAuth';
import Result from '../Pages/Result';
import TestMicAndCamera from '../Components/TestMicAndCamera';
import Convergation from '../Pages/Convergation';
import ProfileEdit from '../Pages/ProfileEdit';
import AdminLogin from '../Pages/AdminLogin';
import Admin from '../Pages/Admin';
import OrgLogin from "../Pages/OrgLogin";
import OrgOtpVerification from "../Pages/OrgOtpVerification";
import AdminOtpVerification from "../Pages/AdminOtpVerification";

const AllRouters = () => {
  return (
    <Routes>
      {/* Normal People */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/test" element={<Test />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpVerification />} />

      {/* Admin */}
      <Route path="/admin-profile" element={<Admin />}/>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-otp" element={<AdminOtpVerification />} />


      {/* Organization */}
      <Route path="/org-login" element={<OrgLogin />}/>
      <Route path="/org-otp" element={<OrgOtpVerification />} />

      {/* Normal People protection Page */}
      <Route element={<UserAuth />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
        <Route path="/questions/:id" element={<QuestionPage />} />
        <Route path="/result/:id" element={<Result />} />
      <Route path="/ai" element={<Convergation />} />
      <Route path="/testMicAndCamera/:id" element={<TestMicAndCamera />} />
      </Route>
    </Routes>
  );
}

export default AllRouters
