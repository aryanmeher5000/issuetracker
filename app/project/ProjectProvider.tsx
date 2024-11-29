"use client";
import { Project } from "@prisma/client";
import React, { ReactNode, useEffect } from "react";
import useProject from "../store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface Inp {
  children: ReactNode;
  project: Project;
}

const ProjectProvider = ({ children, project }: Inp) => {
  const { data } = useSession();
  const { setProjectInfo } = useProject();
  const { push } = useRouter();

  useEffect(() => {
    if (data?.user?.email) {
      setProjectInfo(data.user.email, project);
    }
  }, [data?.user?.email, project, setProjectInfo]);

  if (!project) {
    push("/selectproject");
    toast.error("Error loading project!");
    return <Toaster />;
  }

  return <div>{children}</div>;
};

export default ProjectProvider;
