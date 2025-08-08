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
import OrgProfile from "../Pages/OrgProfile";
import Sets from "../Pages/Sets";
import SetBuilder from '../Pages/SetBuilder';
import OrgAuth from "../Auth/OrganizationAuth";
import AdminAuth from '../Auth/AdminAuth';
import ScrollTop from "../Utils/ScrollTop";
import ForgetPassword from "../Pages/ForgetPassword";
import OrgProfileEdit from "../Pages/OrgProfileEdit";
const AllRouters = () => {
  return (
    <>
    <ScrollTop />
    <Routes>
      {/* Normal People */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/test" element={<Test />} />
      <Route path="/user-forget-pass" element={<ForgetPassword />} />


      {/* Admin */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-otp" element={<AdminOtpVerification />} />
      <Route element={<AdminAuth />}>
      <Route path="/admin-profile" element={<Admin />} />
      </Route>

      {/* Organization */}
      <Route path="/org-login" element={<OrgLogin />} />
      <Route path="/org-otp" element={<OrgOtpVerification />} />
      <Route element={<OrgAuth />}>
        <Route path="/org-profile" element={<OrgProfile />} />
        <Route path="/sets" element={<Sets />} />
        <Route path="/set-builder" element={<SetBuilder />} />
        <Route path="/org-profile-edit" element={<OrgProfileEdit />} />
      </Route>

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
    </>
  );
}

export default AllRouters
