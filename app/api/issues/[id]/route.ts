import { updateIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/auth";

// Assign issue to a user -- Only ADMIN
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  // Check if assigner is admin
  const assigner = await auth();
  if (!assigner || assigner.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 403 } // Use 403 Forbidden for insufficient permissions
    );
  }

  // Check if assignee exists
  const assignee = body.userId
    ? await prisma.user.findUnique({
        where: { id: body.userId },
      })
    : null;

  if (!assignee) {
    return NextResponse.json({ error: "Assignee not found!" }, { status: 404 });
  }

  // Parse and validate issue ID
  const issueId = parseInt(params.id);
  if (isNaN(issueId)) {
    return NextResponse.json({ error: "Invalid issue ID!" }, { status: 400 });
  }

  // Assign issue to the user
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      assignedToUserId: assignee.id,
    },
  });

  return NextResponse.json(
    {
      message: assignee.id
        ? `Issue assigned to ${assignee.name}`
        : "Unassigned the issue.",
    },
    { status: 200 }
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const session = await auth();
  const issueId = parseInt(params.id); // Simplified destructuring
  const valid = updateIssueSchema.safeParse(body);
  console.log(body);

  // Check if issue exists
  const issueEx = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  if (!issueEx)
    return NextResponse.json({ error: "Issue not found!" }, { status: 404 });

  // Check if ADMIN or specified user
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "User not authenticated!" },
      { status: 401 }
    );
  }

  const reqster = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (
    !reqster ||
    (reqster.role !== "ADMIN" && reqster.id !== issueEx.assignedToUserId)
  ) {
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 403 } // Forbidden
    );
  }

  // Verify updated details
  if (!valid.success) {
    const errors = valid.error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    return NextResponse.json(errors, { status: 400 });
  }

  // Update the issue with validated data (ensure only the updated fields are passed)
  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: body, // Use validated data (not the raw body)
  });

  return NextResponse.json(updatedIssue);
}

// Delete an issue -- Only if ADMIN
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const issueExists = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  const session = await auth();
  if (session?.user.role !== "ADMIN")
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 403 } // Use 403 for Forbidden access
    );

  if (!issueExists)
    return NextResponse.json({ error: "Invalid Issue!" }, { status: 404 });

  const dltdIssue = await prisma.issue.delete({
    where: { id: parseInt(params.id) },
  });

  return NextResponse.json(
    { message: "Issue deleted successfully.", body: dltdIssue },
    { status: 200 }
  );
}
