"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("USER_TOKEN");

    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  return <>{children}</>;
}
