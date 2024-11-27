import React from "react";
import NavBar from "../NavBar";
import prisma from "@/prisma/client";
import ProjectProvider from "./ProjectProvider";

const ProjectLayout = async ({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params;
  const projectInfo = await prisma.project.findUnique({
    where: { id: parseInt(id) },
  });

  return (
    <ProjectProvider project={projectInfo}>
      <NavBar />
      {children}
    </ProjectProvider>
  );
};

export default ProjectLayout;
