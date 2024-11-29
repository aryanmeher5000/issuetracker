import { Metadata } from "next";
import CreateProjectFxn from "./CreateProject";
import { auth } from "../api/auth/auth";
import { redirect } from "next/navigation";

const CreateNewProject = async () => {
  const profile = await auth();
  if (!profile) redirect("/api/auth/signin");

  return <CreateProjectFxn />;
};

export default CreateNewProject;
export const metadata: Metadata = {
  title: "Issue Tracker - Create Project",
  description:
    "Create a personal, group or organizational project in quick easy steps.",
};
