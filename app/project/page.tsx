import prisma from "@/prisma/client";
import { getProjectId } from "../lib/getProjectId";
import AddOrRemoveMembers from "./AddOrRemoveMembers";

const Project = async () => {
  const projectId = await getProjectId();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { admins: true, users: true },
  });

  return <AddOrRemoveMembers projectInfo={project} />;
};

export default Project;
