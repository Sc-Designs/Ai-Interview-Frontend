import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FillDataFromLoginOrRegister } from "../Store/Reducers/Organization";
import OrgAxios from "../Config/orgAxios";
import { initializeSocket } from "../socket/socketService";

const OrgAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const organization = useSelector((state) => state.OrganizationReducer);

  useEffect(() => {
    const token = localStorage.getItem("OrgToken");

    const fetchorganization = async () => {
      if (!token) {
        navigate("/org-login");
        return;
      }

      try {
        const res = await OrgAxios.get("/orgs/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(FillDataFromLoginOrRegister(res.data.Org));
        const socket = initializeSocket();
        socket.emit("join", { role: "org", id: res.data.Org._id });
        setLoading(false);
      } catch (err) {
        console.log("Auth Error", err);
        localStorage.removeItem("OrgToken");
        navigate("/org-login");
      }
    };

     if (!organization || !organization._id) {
       fetchorganization();
     } else {
       const socket = initializeSocket();
       socket.emit("join", { role: "org", id: organization._id });
       setLoading(false);
     }
  }, [navigate, dispatch]);

  if (loading) return <div>Loading...</div>;
  return <Outlet />;
};

export default OrgAuth;
