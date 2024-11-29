import prisma from "@/prisma/client";
import { getProjectId } from "../lib/getProjectId";
import AddOrRemoveMembers from "./AddOrRemoveMembers";
import { redirect } from "next/navigation";

const Project = async () => {
  const projectId = await getProjectId();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { admins: true, users: true },
  });

  if (!project) redirect("/selectproject");

  return <AddOrRemoveMembers projectInfo={project} />;
};

export default Project;
