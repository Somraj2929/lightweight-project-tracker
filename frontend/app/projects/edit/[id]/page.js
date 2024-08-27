"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import EditProject from "@/app/components/editproject";
import { fetchProjectById, fetchAllUsers } from "@/app/helper/apiHelpers";
import withAuth from "@/app/hooks/withAuth";
import SpinnerCustom from "@/app/components/spinner";

function Edit({ user }) {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [editProject, setEditProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);

  const memoizedFetchProject = useCallback(async () => {
    if (user) {
      try {
        const projectData = await fetchProjectById(id); // Fetch project by ID
        setEditProject(projectData);
        setProjectLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setProjectLoading(false);
      }
    }
  }, [user, id]);

  useEffect(() => {
    memoizedFetchProject(); // Trigger the memoized function to fetch project data
  }, [memoizedFetchProject]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetchAllUsers();
      setUsers(response);
    };

    fetchUsers();
  }, []);

  if (projectLoading || users.length === 0) {
    return <SpinnerCustom />;
  }

  if (!editProject) {
    return <p>Project not found</p>;
  }

  return (
    <>
      <EditProject project={editProject} user={user} users={users} />
    </>
  );
}

export default withAuth(Edit);
