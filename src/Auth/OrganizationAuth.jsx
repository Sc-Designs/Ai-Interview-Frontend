import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FillDataFromLoginOrRegister } from "../Store/Reducers/Organization";
import OrgAxios from "../Config/orgAxios";
import {
  initializeSocket,
  resetSocket,
  getSocketInstance,
} from "../socket/socketService";
import { toast } from "react-toastify";

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
        setupSocket(res.data.Org._id);
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
        setupSocket(organization._id);
        setLoading(false);
     }

     return () => {
           const existingSocket = getSocketInstance();
           if (existingSocket) {
             existingSocket.disconnect();
             resetSocket();
           }
          }
  }, [navigate, dispatch]);

  const setupSocket = (orgId) => {
      resetSocket(); 
      const socket = initializeSocket();
  
      socket.emit("join", { role: "org", id: orgId });
  
      socket.off("blocked");
      socket.on("blocked", ({ message }) => {
        toast.error(message || "Blocked by admin");
        localStorage.removeItem("OrgToken");
        navigate("/org-login");
      });
    };
  

  if (loading) return <div>Loading...</div>;
  return <Outlet />;
};

export default OrgAuth;
