import prisma from "@/prisma/client";
import SelectProject from "./SelectProject";
import { auth } from "../api/auth/auth";
import { Metadata } from "next";

const SelectProjectPage = async () => {
  const profile = await auth();
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { users: { has: profile?.user?.email } },
        { admins: { has: profile?.user?.email } },
      ],
    },
  });
  return <SelectProject projects={projects} />;
};

export default SelectProjectPage;
export const metadata: Metadata = {
  title: "Issue Tracker - Select Project",
  description: "Select a project you wnat to work on.",
};
