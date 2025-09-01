"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");
    const publicRoutes = ["/auth/login", "/auth/signup", "/ResetPassword"];
    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/auth/signup");
    }
  }, [router]);

  return <>{children}</>;
}
