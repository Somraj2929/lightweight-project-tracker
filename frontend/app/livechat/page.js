"use client";
import Discussion from "../components/discussion";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LiveChat = () => {
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
      <Discussion currentUser={user} />
    </>
  );
};

export default LiveChat;
