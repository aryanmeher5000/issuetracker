import { create } from "zustand";

interface Project {
  isAdmin: boolean;
  name: string | undefined;
  type: "personal" | "group" | "admin-user" | undefined;
  setProjectInfo: (data: Project) => void;
}

const useGetProjectDetails = create<Project>((set) => ({
  isAdmin: false,
  name: undefined,
  type: undefined,
  setProjectInfo: (data: Project) => set(data),
}));

export default useGetProjectDetails;
