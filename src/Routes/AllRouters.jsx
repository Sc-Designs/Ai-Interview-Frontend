import React from 'react'
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

const AllRouters = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/test" element={<Test />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpVerification />} />
      
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
