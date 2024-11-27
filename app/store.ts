import { Project } from "@prisma/client";
import { create } from "zustand";

interface ProjectStore {
  isAdmin: boolean;
  project: { id: number; name: string; type: string };
  setProjectInfo: (userEmail: string, data: Project) => void;
}

const useProject = create<ProjectStore>((set) => ({
  isAdmin: false,
  project: undefined,
  setProjectInfo: (userEmail: string, data: Project) => {
    if (data.admins.includes(userEmail)) set({ isAdmin: true });
    set({ project: { id: data.id, name: data.name, type: data.type } });
  },
}));

export default useProject;
