"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import EditProject from "@/app/components/editproject";
import { fetchProjectById } from "@/app/helper/apiHelpers";
import withAuth from "@/app/hooks/withAuth";

function Edit({ user }) {
  const { id } = useParams();

  const [editProject, setEditProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);

  const memoizedFetchProject = useCallback(async () => {
    if (!loading && user) {
      try {
        const projectData = await fetchProjectById(id); // Fetch project by ID
        setEditProject(projectData);
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

  if (!editProject) {
    return <p>Project not found</p>;
  }

  return (
    <>
      <EditProject project={editProject} user={user} />
    </>
  );
}

export default withAuth(Edit);
