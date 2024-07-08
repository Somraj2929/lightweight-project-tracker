"use client";
import AllProjects from "../components/projects";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Projects = () => {
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
      <AllProjects user={user} />
    </>
  );
};

export default Projects;
