"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import UserLogin from "@/app/components/userLogin";
import SpinnerCustom from "@/app/components/spinner";

const LoginPage = () => {
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/");
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <>
        <SpinnerCustom />
      </>
    );
  }

  return (
    <>
      <UserLogin />
    </>
  );
};

export default LoginPage;
