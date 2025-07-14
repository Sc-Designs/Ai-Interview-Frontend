import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Axios from "../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { dataFetchFromAuth } from "../Store/Reducers/UserReducer";

const UserAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.UersReducer);


  useEffect(() => {
    const token = localStorage.getItem("UserToken");

    const fetchUser = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await Axios.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(dataFetchFromAuth(res.data));
        setLoading(false);
      } catch (err) {
        console.log("Auth Error", err);
        localStorage.removeItem("UserToken");
        navigate("/login");
      }
    };

    // if (!user) {
      fetchUser();
    // } else {
      // setLoading(false);
    // }
  }, [navigate, dispatch]);

  if (loading) return <div>Loading...</div>;
  return <Outlet />;
};

export default UserAuth;
