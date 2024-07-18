"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "./useAuth";
import SpinnerCustom from "../components/spinner";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/users/login");
      }
    }, [loading, user, router]);

    if (loading || !user) {
      return <SpinnerCustom />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

export default withAuth;
