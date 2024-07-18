"use client";
import Discussion from "../components/discussion";
import withAuth from "@/app/hooks/withAuth";

function LiveChat({ user }) {
  return (
    <>
      <Discussion user={user} />
    </>
  );
}

export default withAuth(LiveChat);
