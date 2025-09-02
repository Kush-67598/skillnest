"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

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
    if(!userToken)
    // If token missing and not a public route → redirect
    if (!userToken && !creatorToken && !publicRoutes.includes(pathname)) {
      // Redirect based on route type
      router.push(isCreatorRoute ? "/Creator/CreatorLogin" : "/auth/signup");
    }
  }, [router, pathname]);

  return <>{children}</>;
}
