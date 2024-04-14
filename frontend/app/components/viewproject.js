import React from "react";
import { Avatar } from "@nextui-org/react";
import { projects } from "@/public/allprojectdata";

const ViewProject = ({ project }) => {
  if (!project) {
    return (
      <div className="flex">
        <div className="bg-custom w-[75%] left-[25%] absolute">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-[35px] font-bold custom-heading">
                project Details
              </h1>
              <div className="flex p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
                <h3 className="text-lg font-semibold">Somraj Bishnoi</h3>
                <Avatar
                  isBordered
                  radius="sm"
                  src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                  size="sm"
                />
              </div>
            </div>
            <div className="bg-blue-200 mt-7 pt-2">No project found --</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Show Page */}
      <div className="bg-custom w-[75%] left-[25%] absolute">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[35px] font-bold custom-heading">
              project Details
            </h1>
            <div className="flex p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
              <h3 className="text-lg font-semibold">Somraj Bishnoi</h3>
              <Avatar
                isBordered
                radius="sm"
                src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                size="sm"
              />
            </div>
          </div>
          <div className="bg-blue-200 mt-7 pt-2">
            <div className="p-8 max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
              <p className="text-gray-600 mb-4">ID: {project.id}</p>
              <p className="text-gray-600 mb-4">
                Description: {project.description}
              </p>
              <p className="text-gray-600 mb-4">Team: {project.team}</p>
              <p className="text-gray-600 mb-4">Status: {project.status}</p>
              <p className="text-gray-600 mb-4">
                Created at: {project.createdAt}
              </p>
              <p className="text-gray-600 mb-4">
                Updated at: {project.updatedAt}
              </p>
              <p className="text-gray-600 mb-4">
                Assigned from: {project.assignedFrom}
              </p>
              <p className="text-gray-600 mb-4">
                Assigned to: {project.assignedTo}
              </p>

              <h2 className="text-2xl font-bold mb-4">Comments</h2>
              {/* <ul className="list-disc list-inside">
        {comments.map((comment) => (
          <li key={comment.id} className="mb-2">
            <p className="text-gray-600">{comment.body}</p>
            <p className="text-gray-500 text-sm">
              {comment.author.username} - {comment.createdAt}
            </p>
          </li>
        ))}
      </ul> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
