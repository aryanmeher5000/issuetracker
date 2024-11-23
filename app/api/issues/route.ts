import { createIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/auth";

//Create a new issue -- USERS
export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await auth();

  //Only logged in users can create
  if (!session || !session.user)
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 401 }
    );

  const valid = createIssueSchema.safeParse(body);
  if (!valid.success)
    return NextResponse.json(valid.error.format(), { status: 400 });

  const newIssue = await prisma.issue.create({ data: body });

  return NextResponse.json(newIssue, { status: 201 });
}
