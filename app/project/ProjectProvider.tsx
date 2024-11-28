"use client";
import { Project } from "@prisma/client";
import React, { ReactNode, useEffect } from "react";
import useProject from "../store";
import { useSession } from "next-auth/react";

interface Inp {
  children: ReactNode;
  project: Project;
}

const ProjectProvider = ({ children, project }: Inp) => {
  const { data } = useSession();
  const { setProjectInfo } = useProject();

  useEffect(() => {
    if (data?.user?.email) {
      setProjectInfo(data.user.email, project);
    }
  }, [data?.user?.email, project, setProjectInfo]);

  return <div>{children}</div>;
};

export default ProjectProvider;
