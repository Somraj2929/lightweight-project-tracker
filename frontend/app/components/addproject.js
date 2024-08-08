"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Input,
  Select,
  SelectItem,
  SelectSection,
  Textarea,
} from "@nextui-org/react";
import users from "@/public/users";
import Link from "next/link";
import SidePanel from "./sidepanel";
import { useRouter } from "next/navigation";
import Image from "next/image";
//import { getCookie } from "../utils/cookies";

const AddProject = ({ user }) => {
  const router = useRouter();
  const [additionalComments, setAdditionalComments] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    //setToken(getCookie("token"));
    setToken(localStorage.getItem("token"));
  }, []);

  console.log(token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //const token = getCookie("token");
    // const token = localStorage.getItem("token");

    const formData = {
      name: e.target.project_name.value,
      team: e.target.team.value,
      status: e.target.status.value,
      fromUserId: parseInt(e.target.assigned_from.value),
      toUserId: parseInt(e.target.assigned_to.value),
      description: e.target.description.value,
      comments: additionalComments
        ? [
            {
              comment: additionalComments,
              userId: user.id,
            },
          ]
        : [],
    };

    try {
      const response = await fetch(
        `https://somraj-project-tracker-nma47.ondigitalocean.app/projects/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create project.");
      }

      alert("Project created successfully!");
      router.push("/projects");

      console.log("Project saved successfully!");
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  return (
    <div>
      <SidePanel currentUser={user} />
      <div className="bg-custom h-screen md:min-w-[75%] md:left-[25%] absolute">
        <div className="md:px-6 px-4 py-4">
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
              Add Project
            </h1>
            <div className="flex md:p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
              <h3 className="hidden md:block text-lg font-semibold">
                {user.name}
              </h3>
              <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
            </div>
          </div>
          <div className="md:mt-7 pt-2 text-xl font-bold md:p-4 rounded-xl">
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-wrap my-4 md:gap-4 gap-2 md:px-6"
            >
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Project Name"
                name="project_name"
              />
              <div className="flex flex-col md:flex-row w-full justify-between gap-2 md:gap-0">
                <Select
                  isRequired
                  label="Select Team"
                  placeholder="Select a Team"
                  className="max-w-auto"
                  name="team"
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
                  label="Select Status"
                  placeholder="Select project status"
                  className="max-w-auto"
                  variant="flat"
                  name="status"
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
              />
              <div className="flex flex-col md:flex-row w-full justify-between gap-2 md:gap-0">
                <Select
                  items={users}
                  isRequired
                  name="assigned_from"
                  label="Assigned From"
                  className="max-w-auto"
                  variant="flat"
                  //defaultSelectedKeys={[user.id]}
                  selectedKeys={user.id ? [user.id.toString()] : []}
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
                  {(users) => (
                    <SelectItem key={users.id} textValue={users.name}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={users.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={users.avatar}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{users.name}</span>
                          <span className="text-tiny text-default-400">
                            {users.email}
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
                  name="assigned_to"
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
                  {(users) => (
                    <SelectItem key={users.id} textValue={users.name}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={users.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={users.avatar}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{users.name}</span>
                          <span className="text-tiny text-default-400">
                            {users.email}
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
              <div className="flex justify-evenly w-full gap-10">
                <Link href="/projects">
                  <button className="bg-danger text-white px-4 py-2 rounded-lg">
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="bg-success text-white px-4 py-2 rounded-lg"
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

export default AddProject;
