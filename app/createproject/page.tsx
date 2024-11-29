import { Metadata } from "next";
import CreateProjectFxn from "./CreateProject";

const CreateNewProject = () => {
  return <CreateProjectFxn />;
};

export default CreateNewProject;
export const metadata: Metadata = {
  title: "Issue Tracker - Create Project",
  description:
    "Create a personal, group or organizational project in quick easy steps.",
};
