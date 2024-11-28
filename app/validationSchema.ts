import { z } from "zod";

export const createProjectScehma = z.object({
  name: z.string().min(3).max(50),
  type: z.enum(["PERSONAL", "GROUP", "ORGANIZATION"]),
  admins: z.array(z.string().min(1)),
  members: z.array(z.string()).optional(),
});
export type CreateProject = z.infer<typeof createProjectScehma>;

export const createIssueSchema = z.object({
  title: z.string().min(3).max(250, "Title is too long."),
  description: z.string().min(3).max(500, "Description is too long."),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
});

export const updateIssueSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title is too short")
      .max(250, "Title is too long."),
    description: z
      .string()
      .min(3, "Description is too short")
      .max(500, "Description is too long."),
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
    deadline: z.date().optional(),
  })
  .partial();
