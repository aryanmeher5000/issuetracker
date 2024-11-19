import { issueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid issue ID!" }, { status: 400 });
  }

  const body = await request.json();
  const valid = issueSchema.safeParse(body);

  if (!valid.success) {
    const errors = valid.error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    return NextResponse.json({ errors }, { status: 400 });
  }

  const updatedIssue = await prisma.issue.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(updatedIssue);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const issueExists = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issueExists)
    return NextResponse.json({ error: "Invalid Issue!" }, { status: 404 });

  const dltdIssue = await prisma.issue.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(
    { message: "Issue delted successfully.", body: dltdIssue },
    { status: 200 }
  );
}
