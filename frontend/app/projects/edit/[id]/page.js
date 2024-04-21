"use client";
import SidePanel from "@/app/components/sidepanel";

import { useParams } from "next/navigation";
import { projects } from "@/public/allprojectdata";
import EditProject from "@/app/components/editproject";

const View = () => {
  const params = useParams();

  const { id } = params;

  const editproject = projects.find((p) => p.id === parseInt(id));

  return (
    <>
      <SidePanel />
      <EditProject project={editproject} />
    </>
  );
};

export default View;
