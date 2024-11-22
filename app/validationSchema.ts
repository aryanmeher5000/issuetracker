import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().min(3).max(250, "Title is too long."),
  description: z.string().min(3).max(500, "Description is too long."),
});

export const updateIssueSchema = z.object({
  title: z.string().min(3).max(250, "Title is too long.").optional().nullable(),
  description: z
    .string()
    .min(3)
    .max(500, "Description is too long.")
    .optional()
    .nullable(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional().nullable(),
});
