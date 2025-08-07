import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Axios from "../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { dataFetchFromAuth } from "../Store/Reducers/UserReducer";
import {
  initializeSocket,
  resetSocket,
  getSocketInstance,
} from "../socket/socketService";
import { toast } from "react-toastify";

const UserAuth = () => {
  console.log("UserAuth Call");
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
        dispatch(dataFetchFromAuth(res.data.user));
        setupSocket(res.data.user._id);
        setLoading(false);
      } catch (err) {
        console.log("Auth Error", err);
        localStorage.removeItem("UserToken");
        navigate("/login");
      }
    };

    if (!user || !user._id) {
      fetchUser();
    } else {
      setupSocket(user._id);
      setLoading(false);
    }

    return () => {
      const existingSocket = getSocketInstance();
      if (existingSocket) {
        existingSocket.disconnect();
        resetSocket();
      }
    };
  }, [navigate, dispatch]);

  const setupSocket = (userId) => {
    resetSocket(); 
    const socket = initializeSocket();

    socket.emit("join", { role: "user", id: userId });

    socket.off("blocked");
    socket.on("blocked", ({ message }) => {
      toast.error(message || "Blocked by admin");
      localStorage.removeItem("UserToken");
      navigate("/login");
    });
  };

  if (loading) return <div>Loading...</div>;
  return <Outlet />;
};

export default UserAuth;
