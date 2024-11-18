import { z } from "zod";

export const createIssueScehma = z.object({
  title: z.string().min(3).max(250),
  description: z.string().min(3).max(500),
});
