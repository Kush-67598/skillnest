"use client";
import ProfilePage from "@/Components/Profile";
import { useEffect, useState } from "react";

export default function Profile(params) {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    if (!token) return;
    setToken(token);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchdata = async () => {
      const fetch_userProfile = await fetch(`${process.env.NEXT_PUBLIC_API}/api/User`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await fetch_userProfile.json();
      setUserData(res);
    };
    fetchdata();
  }, [token]);
  if (!userData) return <div>Loading...</div>;
  return <ProfilePage user={userData} />;
}
