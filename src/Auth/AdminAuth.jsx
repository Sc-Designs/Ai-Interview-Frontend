import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dataFetchFromAuth } from "../Store/Reducers/AdminReducer";
import adminAxios from "../Config/adminAxios"
const AdminAuth = () => {
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const [loading, setLoading] = useState(true);
      const admin = useSelector((state) => state.AdminReducer);

      useEffect(() => {
        const token = localStorage.getItem("AdminToken");

        const fetchAdmin = async () => {
          if (!token) {
            navigate("/admin-login");
            return;
          }

          try {
            const res = await adminAxios.get("/admin/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            dispatch(dataFetchFromAuth(res.data));
            setLoading(false);
          } catch (err) {
            console.log("Auth Error", err);
            localStorage.removeItem("AdminToken");
            navigate("/admin-login");
          }
        };

        if (!admin) {
        fetchAdmin();
        } else {
        setLoading(false);
        }
      }, [navigate, dispatch]);

  if (loading) return <div>Loading...</div>;
    return <Outlet />;
}

export default AdminAuth