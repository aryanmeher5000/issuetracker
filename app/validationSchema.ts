import { z } from "zod";

export const createIssueScehma = z.object({
  title: z.string().min(3).max(250, "Title is too long."),
  description: z.string().min(3).max(500, "Description is too long."),
});
