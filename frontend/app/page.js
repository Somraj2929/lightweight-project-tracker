"use client";
import DashBoard from "./components/dashboard";
import SidePanel from "./components/sidepanel";
//import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <>
      <SidePanel />
      <DashBoard />
    </>
  );
}
