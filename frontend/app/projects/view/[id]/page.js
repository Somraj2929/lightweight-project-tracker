"use client";

import ViewProject from "@/app/components/viewproject";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { fetchProjectById } from "@/app/helper/apiHelpers";
import withAuth from "@/app/hooks/withAuth";

function View({ user }) {
  const { id } = useParams();

  const [viewProject, setViewProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);

  const memoizedFetchProject = useCallback(async () => {
    if (!loading && user) {
      try {
        const projectData = await fetchProjectById(id); // Fetch project by ID
        setViewProject(projectData);
        setProjectLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setProjectLoading(false);
      }
    }
  }, [loading, user, id]);

  useEffect(() => {
    memoizedFetchProject(); // Trigger the memoized function to fetch project data
  }, [memoizedFetchProject]);

  if (projectLoading) {
    return <p>Loading...</p>;
  }

  if (!viewProject) {
    return <p>Project not found</p>;
  }

  return (
    <>
      <ViewProject project={viewProject} user={user} />
    </>
  );
}

export default withAuth(View);
