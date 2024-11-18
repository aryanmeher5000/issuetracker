import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createIssueScehma = z.object({
  title: z.string().min(3).max(250),
  description: z.string().min(3).max(500),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const valid = createIssueScehma.safeParse(body);

  if (!valid.success)
    return NextResponse.json(valid.error.errors, { status: 400 });

  const newIssue = await prisma.issue.create({
    data: { title: body?.title, description: body?.description },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
