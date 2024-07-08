"use client";
import React from "react";
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

const AddProject = ({ user }) => {
  return (
    <div>
      <SidePanel />
      <div className="bg-custom h-screen w-[75%] left-[25%] absolute">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[35px] font-bold custom-heading">
              Add Project
            </h1>
            <div className="flex p-2 rounded-lg gap-2 justify-center items-center bg-slate-400">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <Avatar isBordered radius="sm" src={user.avatar} size="sm" />
            </div>
          </div>
          <div className=" mt-7 pt-2 text-xl font-bold p-4  rounded-xl">
            <form
              action="https://send.pageclip.co/xdvSeQsikzoNQNna7lOQ0FUofEN9RgBp"
              method="post"
              className="flex w-full flex-wrap mb-6 gap-4 px-6"
            >
              <Input
                isRequired
                type="text"
                variant="flat"
                label="Project Name"
                name="project_name"
              />
              <div className="flex w-full justify-between">
                <Select
                  isRequired
                  label="Select Team"
                  placeholder="Select a Team"
                  className="max-w-sm"
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
                  className="max-w-sm"
                  selectedKeys={["open"]}
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
              <div className="flex w-full justify-between">
                <Select
                  items={users}
                  selectedKeys={["1"]}
                  name="assigned_from"
                  label="Assigned From"
                  className="max-w-sm"
                  variant="flat"
                  classNames={{
                    label: "group-data-[filled=true]:-translate-y-5",
                    trigger: "min-h-16",
                    // listboxWrapper: "max-h-[400px]",
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
                    <SelectItem key={user.id} textValue={user.name}>
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
                  name="assigned_to"
                  className="max-w-sm"
                  variant="flat"
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
                    <SelectItem key={user.id} textValue={user.name}>
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
