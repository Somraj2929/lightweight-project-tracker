"use client";
import SidePanel from "@/app/components/sidepanel";
import ViewProject from "@/app/components/viewproject";
import { useParams } from "next/navigation";
import { projects } from "@/public/allprojectdata";

// const displayProjectData = (projectId) => {
//   const project = projects.find((p) => p.id === projectId);

//   if (!project) {
//     console.log("Project not found");
//     return;
//   }

//   console.log(project);

//   // Rest of your code here
// };

// displayProjectData(2);

const View = () => {
  const params = useParams();

  const { id } = params;
  if (!id) {
    return <div>Loading...</div>;
  }

  const viewproject = projects.find((p) => p.id === parseInt(id));

  return (
    <>
      <SidePanel />
      <ViewProject project={viewproject} />
    </>
  );
};

export default View;
