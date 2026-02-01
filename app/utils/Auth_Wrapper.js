"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check tokens for users and creators
    const userToken = localStorage.getItem("USER_TOKEN");
    const creatorToken = localStorage.getItem("Token");

    // Define public routes
    const publicRoutes = [
      "/auth/login",
      "/auth/signup",
      "/ResetPassword",
      "/Creator/CreatorLogin",
      "/Creator/CreatorSignup",
    ];

    // Determine if current path is a creator route
    const isCreatorRoute = pathname.startsWith("/Creator");
    // if (!userToken && !creatorToken && !publicRoutes.includes(pathname)) {
    //   router.push(isCreatorRoute ? "/Creator/CreatorLogin" : "/auth/signup");
    //   toast.warning("Unauthorized.Please Login First", {
    //     hideProgressBar: true,
    //     pauseOnHover: false,
    //     autoClose: 1000,
    //   });
    // }
  }, [router, pathname]);

  return <>{children}</>;
}
