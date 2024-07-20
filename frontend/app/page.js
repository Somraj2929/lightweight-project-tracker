"use client";

import DashBoard from "./components/dashboard";
import withAuth from "./hooks/withAuth";

function Home({ user }) {
  return (
    <>
      <DashBoard user={user} />
    </>
  );
}

export default withAuth(Home);
