"use client";
import SidePanel from "@/app/components/sidepanel";
import ViewProject from "@/app/components/viewproject";
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
      {/* <ViewProject project={viewproject} /> */}
      <EditProject project={editproject} />
    </>
  );
};

export default View;
