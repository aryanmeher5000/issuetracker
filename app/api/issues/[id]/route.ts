import { updateIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Validate and parse the ID
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid issue ID. Please provide a valid number." },
      { status: 400 }
    );
  }

  // Fetch the issue from the database
  const issue = await prisma.issue.findUnique({
    where: { id },
  });

  // If issue is not found, return a 404 response
  if (!issue) {
    return NextResponse.json({ error: "Issue not found." }, { status: 404 });
  }

  // Return the issue in the response
  return NextResponse.json(issue, { status: 200 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } // Correct type for params.id
) {
  const body = await request.json();

  // Check if assigner is admin
  const assigner = await auth();
  if (!assigner || assigner.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 401 }
    );
  }

  // Check if assignee exists
  const assignee = body.userId
    ? await prisma.user.findUnique({
        where: { id: body.userId },
      })
    : null;

  // Parse and validate issue ID
  const issueId = parseInt(params.id);
  if (isNaN(issueId)) {
    return NextResponse.json({ error: "Invalid issue ID!" }, { status: 400 });
  }

  // Assign issue to the user
  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: {
      assignedToUserId: assignee?.id ? assignee?.id : null,
    },
  });
  if (!updatedIssue)
    return NextResponse.json({ error: "Issue not found!" }, { status: 404 });

  return NextResponse.json(
    assignee?.id
      ? "Issue assigned to " + assignee.name
      : "Unassigned the issue.",
    { status: 200 }
  );
}

//Update the details of an issue
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid issue ID!" }, { status: 400 });
  }

  const body = await request.json();
  const valid = updateIssueSchema.safeParse(body);

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

//Delete an issue
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
