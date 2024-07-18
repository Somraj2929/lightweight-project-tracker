"use client";
import AllProjects from "../components/projects";
import withAuth from "@/app/hooks/withAuth";

function Projects({ user }) {
  return (
    <>
      <AllProjects user={user} />
    </>
  );
}

export default withAuth(Projects);
