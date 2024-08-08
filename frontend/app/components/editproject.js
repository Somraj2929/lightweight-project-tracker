import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Input,
  Select,
  SelectItem,
  SelectSection,
  Textarea,
} from "@nextui-org/react";
import users from "@/public/users";
import SidePanel from "./sidepanel";
import { useRouter } from "next/navigation";
import Image from "next/image";
//import { getCookie } from "../utils/cookies";

const EditProject = ({ project, user }) => {
  const [token, setToken] = useState(null);
  const router = useRouter();
  const currentUserId = user.id;
  const [additionalComments, setAdditionalComments] = useState("");

  const getUserDetailsById = (userId) => {
    return users.find((user) => user.id === userId);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);

    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}`; // DD MMM format

    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }); // hh:mm A format

    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    //setToken(getCookie("token"));
    setToken(localStorage.getItem("token"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //const token = getCookie("token"); // Get the token from cookies
    //const token = localStorage.getItem("token");

    const formData = {
      id: project.id,
      name: e.target.project_name.value,
      team: e.target.team.value,
      status: e.target.status.value,
      fromUserId: parseInt(e.target.fromUserId.value),
      toUserId: parseInt(e.target.toUserId.value),
      description: e.target.description.value,
      comments: [
        {
          comment: additionalComments,
          userId: currentUserId,
        },
      ],
    };

    try {
      const response = await fetch(
        `http://localhost:8081/projects/${project.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save project.");
      }

      alert("Project saved successfully!");
      router.push("/projects");

      console.log("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const statusColorMap = {
    open: "primary",
    inprogress: "warning",
    closed: "success",
  };

  return (
    <div className="flex">
      <SidePanel currentUser={user} />
      <div className="bg-custom md:w-[75%] md:left-[25%] absolute">
        <div className="md:px-8 px-2 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="md:hidden block">
              <Image
                src="/images/short-logo.svg"
                alt="logo"
                width={60}
                height={72}
                className="mix-blend-multiply"
              />
            </Link>
            <h1 className="md:text-[35px] text-[24px] font-bold custom-heading">
              Edit Project
            </h1>
            <div className="flex md:p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
              <h3 className="hidden md:block text-lg font-semibold">
                {user.name}
              </h3>
              <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
            </div>
          </div>
          <div className="md:mt-7 pt-2 text-xl font-bold md:p-4 rounded-xl">
            <div className="flex justify-center ">
              <div className="flex bg-slate-200 p-2 rounded-lg m-4">
                Project ID : {project.id}
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-wrap mb-6 md:gap-4 gap-2 md:px-6"
            >
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Project Name"
                name="project_name"
                defaultValue={project.name}
              />
              <div className="flex flex-col md:flex-row w-full justify-between gap-2 md:gap-4">
                <Select
                  isRequired
                  label="Select Team"
                  placeholder="Select a Team"
                  className="max-w-auto"
                  name="team"
                  defaultSelectedKeys={[project.team]}
                >
                  <SelectSection title="All Teams">
                    <SelectItem key="mamaearth">Mamaearth</SelectItem>
                    <SelectItem key="thedermaco">TheDermaCo</SelectItem>
                    <SelectItem key="aqualogica">Aqualogica</SelectItem>
                    <SelectItem key="bblunt">BBlunt</SelectItem>
                    <SelectItem key="staze">Staze</SelectItem>
                  </SelectSection>
                </Select>
                <Select
                  isRequired
                  color={statusColorMap[project.status]}
                  label="Select Status"
                  placeholder="Select project status"
                  className="max-w-auto"
                  variant="flat"
                  name="status"
                  defaultSelectedKeys={[project.status]}
                >
                  <SelectSection>
                    <SelectItem key="open">Open</SelectItem>
                    <SelectItem key="inprogress">InProgress</SelectItem>
                    <SelectItem key="closed">Closed</SelectItem>
                  </SelectSection>
                </Select>
              </div>
              <Textarea
                isRequired
                label="Description"
                variant="flat"
                placeholder="Enter your description"
                name="description"
                defaultValue={project.description}
              />
              <div className="flex flex-col md:flex-row w-full justify-between gap-2 md:gap-4">
                <Select
                  items={users}
                  selectedKeys={
                    project.fromUserId ? [project.fromUserId.toString()] : []
                  }
                  name="fromUserId"
                  label="Assigned From"
                  className="max-w-auto"
                  variant="flat"
                  classNames={{
                    label: "group-data-[filled=true]:-translate-y-5",
                    trigger: "min-h-16",
                  }}
                  renderValue={(items) => {
                    return items.map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <Avatar
                          alt={item.data.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={item.data.avatar}
                        />
                        <div className="flex flex-col">
                          <span>{item.data.name}</span>
                          <span className="text-default-500 text-tiny">
                            {item.data.email}
                          </span>
                        </div>
                      </div>
                    ));
                  }}
                >
                  {(user) => (
                    <SelectItem key={user.id.toString()} textValue={user.name}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={user.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={user.avatar}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{user.name}</span>
                          <span className="text-tiny text-default-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                <Select
                  items={users}
                  isRequired
                  label="Assigned To"
                  name="toUserId"
                  className="max-w-auto"
                  variant="flat"
                  selectedKeys={
                    project.toUserId ? [project.toUserId.toString()] : []
                  }
                  classNames={{
                    label: "group-data-[filled=true]:-translate-y-5",
                    trigger: "min-h-16",
                  }}
                  listboxProps={{
                    itemClasses: {
                      base: [
                        "rounded-md",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "data-[hover=true]:bg-default-100",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[selectable=true]:focus:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    },
                  }}
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "p-0 border-small border-divider bg-background",
                    },
                  }}
                  renderValue={(items) => {
                    return items.map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <Avatar
                          alt={item.data.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={item.data.avatar}
                        />
                        <div className="flex flex-col">
                          <span>{item.data.name}</span>
                          <span className="text-default-500 text-tiny">
                            {item.data.email}
                          </span>
                        </div>
                      </div>
                    ));
                  }}
                >
                  {(user) => (
                    <SelectItem key={user.id.toString()} textValue={user.name}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={user.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={user.avatar}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{user.name}</span>
                          <span className="text-tiny text-default-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              </div>
              <Input
                type="text"
                variant="flat"
                label="Add Additional Comments"
                name="additional_comments"
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
              />
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-4">Comments</h2>
                <div className="bg-pink-200 rounded-lg">
                  <div
                    className="md:p-4 p-2 mx-auto rounded-lg overflow-y-auto"
                    style={{ scrollbarWidth: "none", maxHeight: "300px" }}
                  >
                    {project.comments && project.comments.length > 0 ? (
                      project.comments.map((comment) => {
                        const userDetails = getUserDetailsById(comment.userId);
                        const isCurrentUser = comment.userId === currentUserId;
                        return (
                          <div
                            key={comment.id}
                            className={`flex flex-col mb-2 ${
                              isCurrentUser ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`flex ${
                                isCurrentUser
                                  ? "flex-row-reverse justify-end"
                                  : "justify-start"
                              } gap-2.5`}
                            >
                              <img
                                className="w-8 h-8 rounded-full"
                                src={userDetails.avatar}
                                alt={`${userDetails.name} avatar`}
                              />
                              <div
                                className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl ${
                                  isCurrentUser
                                    ? "rounded-xl rounded-tr-none"
                                    : "rounded-es-xl"
                                } dark:bg-gray-700`}
                              >
                                <div
                                  className={`flex items-center space-x-2 justify-between ${
                                    isCurrentUser ? "rtl:space-x-reverse" : ""
                                  }`}
                                >
                                  <span className="text-sm text-gray-800 dark:text-white">
                                    {userDetails.name}
                                  </span>
                                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    {formatTime(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-md font-normal py-2.5 text-gray-900 dark:text-white">
                                  {comment.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-md font-normal py-2.5 text-gray-900 dark:text-white">
                        No comments yet!
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-evenly w-full gap-10">
                <Link href="/projects">
                  <button className="bg-danger text-white px-8 py-2 rounded-lg">
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="bg-success text-white px-8 py-2 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
