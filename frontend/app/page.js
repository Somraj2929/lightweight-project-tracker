"use client";

import DashBoard from "./components/dashboard";
import SidePanel from "./components/sidepanel";
import { useRouter } from "next/navigation";
import useAuth from "./hooks/useAuth";
import { useEffect } from "react";

export default function Home() {
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/users/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <DashBoard user={user} />
    </>
  );
}
