"use client";
const { default: AddProject } = require("../../components/addproject");
import withAuth from "@/app/hooks/withAuth";

function NewProject({ user }) {
  return (
    <>
      <AddProject user={user} />
    </>
  );
}

export default withAuth(NewProject);
