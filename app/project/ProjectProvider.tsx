import { Project } from "@prisma/client";
import React, { ReactNode } from "react";
import useProject from "../store";
import { useSession } from "next-auth/react";

interface Inp {
  children: ReactNode;
  project: Project;
}

const ProjectProvider = ({ children, project }: Inp) => {
  const { data } = useSession();
  const { setProjectInfo } = useProject();
  setProjectInfo(data?.user?.email, project);
  return <div>{children}</div>;
};

export default ProjectProvider;
