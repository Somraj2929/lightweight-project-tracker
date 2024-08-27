"use client";
import { useEffect, useState } from "react";
const { default: AddProject } = require("../../components/addproject");
import withAuth from "@/app/hooks/withAuth";
import { fetchAllUsers } from "@/app/helper/apiHelpers";
import SpinnerCustom from "@/app/components/spinner";

function NewProject({ user }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetchAllUsers();
      setUsers(response);
    };

    fetchUsers();
  }, []);

  if (users.length === 0) {
    return <SpinnerCustom />;
  }

  return (
    <>
      <AddProject user={user} users={users} />
    </>
  );
}

export default withAuth(NewProject);
