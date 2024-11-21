import { createIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

//Create a new issue
export async function POST(req: NextRequest) {
  const body = await req.json();
  const valid = createIssueSchema.safeParse(body);

  if (!valid.success)
    return NextResponse.json(valid.error.format(), { status: 400 });

  const newIssue = await prisma.issue.create({
    data: { title: body?.title, description: body?.description },
  });

  return NextResponse.json(newIssue, { status: 201 });
}
