import React from "react";
import Image from "next/image";
import { Avatar, Chip, User } from "@nextui-org/react";

const statusColorMap = {
  open: "primary",
  inprogress: "warning",
  closed: "success",
};

const ViewProject = ({ project }) => {
  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthAbbreviation = monthNames[date.getMonth()];

    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${monthAbbreviation} ${day}, ${year}`;

    return formattedDate;
  }

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
            <div className=" mt-7 pt-2 text-xl font-bold h-screen">
              No Project Found
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Show Page */}
      <div className=" w-[75%] left-[25%] absolute">
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
          <div className="bg-pink-100 rounded-lg mt-7 pt-2">
            <div className="p-6 max-w-3xl mx-auto text-lg">
              <p className="text-gray-700 mb-2 italic text-sm">
                Project ID: {project.id}
              </p>
              <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
              <p className="">Description:</p>
              <div className="text-slate-900 border-1 bg-[#f4f4f5] font-medium  p-2 rounded border-black mb-4">
                {project.description}
              </div>
              <div className=" mb-4 flex">
                Team:
                <p className="capitalize font-semibold ml-2">{project.team}</p>
              </div>
              <div className=" mb-4">
                Status:{" "}
                <Chip
                  className="uppercase font-bold p-4 ml-2"
                  color={statusColorMap[project.status]}
                  size="sm"
                  fontWeight="bold"
                  variant="shadow"
                >
                  {project.status}
                </Chip>
              </div>
              <div className="flex mb-4">
                Created at:
                <p className="font-semibold ml-2">
                  {formatDate(project.createdAt)}
                </p>
              </div>
              <div className="flex mb-4">
                Updated at:
                <p className="font-semibold ml-2">
                  {formatDate(project.updatedAt)}
                </p>
              </div>
              <div className="flex items-center mb-4">
                Assigned from:
                <User
                  className="ml-2 bg-green-200 p-1 font-semibold"
                  avatarProps={{
                    radius: "sm",
                    src: project.fromAvatar,
                    size: "sm",
                  }}
                  name={project.assignedFrom}
                >
                  {project.assignedFrom}
                </User>
              </div>
              <div className="flex items-center mb-4">
                Assigned to:
                <User
                  className="ml-2 bg-green-200 p-1 font-semibold"
                  avatarProps={{
                    radius: "sm",
                    src: project.fromAvatar,
                    size: "sm",
                  }}
                  name={project.assignedFrom}
                >
                  {project.assignedFrom}
                </User>
              </div>

              <h2 className="text-2xl font-bold mb-4">Comments</h2>
              <div class="border-1 border-black p-3 mx-auto rounded-lg bg-[#f4f4f5]">
                <div class="space-y-4">
                  <div class="flex items-center justify-start">
                    <img
                      src={project.toAvatar}
                      alt="User 1 Avatar"
                      class="w-8 h-8 rounded-full mr-2"
                    />
                    <div class="bg-blue-100 rounded-lg p-2">
                      <p class="text-gray-800">Hi there!</p>
                    </div>
                  </div>

                  <div class="flex items-center  justify-start">
                    <img
                      src={project.toAvatar}
                      alt="User 1 Avatar"
                      class="w-8 h-8 rounded-full mr-2"
                    />
                    <div class="bg-blue-100 rounded-lg p-2">
                      <p class="text-gray-800">Hi there!</p>
                    </div>
                  </div>

                  <div class="flex items-center  justify-start">
                    <img
                      src={project.toAvatar}
                      alt="User 1 Avatar"
                      class="w-8 h-8 rounded-full mr-2"
                    />
                    <div class="bg-blue-100 rounded-lg p-2">
                      <p class="text-gray-800">
                        I'm looking for some information on regarding the
                        project update. Can you provide the same
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
