import React, { PropsWithChildren } from "react";
import prisma from "@/prisma/client";
import ProjectProvider from "./ProjectProvider";
import dynamic from "next/dynamic";
import { getProjectId } from "../lib/getProjectId";
import { redirect } from "next/navigation";
const NavBar = dynamic(() => import("../NavBar"));

const ProjectLayout = async ({ children }: PropsWithChildren) => {
  const id = await getProjectId();
  if (!id) redirect("/selectproject");

  const projectInfo = await prisma.project.findUnique({
    where: { id: id },
  });

  if (!projectInfo) redirect("/selectproject");

  return (
    <ProjectProvider project={projectInfo}>
      <NavBar />
      {children}
    </ProjectProvider>
  );
};

export default ProjectLayout;
