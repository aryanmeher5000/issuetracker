import { updateIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/auth";

// Assign issue to a user -- Only ADMIN
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    // Parse and validate issue ID
    const issueId = parseInt(id, 10);
    if (isNaN(issueId)) {
      return NextResponse.json(
        { error: "Invalid issue ID. It must be a number." },
        { status: 400 }
      );
    }

    // Check if assigner is an admin
    const assigner = await auth();
    if (!assigner || assigner.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Authorization denied! Only admins can perform this action." },
        { status: 403 }
      );
    }

    // Validate userId from the body (if provided)
    const userId = body.userId || null;
    let assignee = null;
    if (userId) {
      assignee = await prisma.user.findUnique({ where: { id: userId } });
      if (!assignee) {
        return NextResponse.json(
          { error: `User with ID ${userId} not found.` },
          { status: 404 }
        );
      }
    }

    // Assign or unassign the issue
    const updatedIssue = await prisma.issue.update({
      where: { id: issueId },
      data: { assignedToUserId: assignee?.id || null },
    });

    // Respond with success
    return NextResponse.json(
      {
        message: assignee
          ? `Issue successfully assigned to ${assignee.name}.`
          : "Issue successfully unassigned.",
        issue: updatedIssue, // Optionally include the updated issue
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning issue:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const session = await auth();
  const { id } = await params;
  const issueId = parseInt(id);

  // Check if issue exists
  const issueEx = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  if (!issueEx)
    return NextResponse.json({ error: "Issue not found!" }, { status: 404 });

  // Check if ADMIN or specified user
  if (!session || !session?.user?.email) {
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
    reqster.role !== "ADMIN" ||
    reqster.id !== issueEx.assignedToUserId
  ) {
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 403 } // Forbidden
    );
  }

  // Verify updated details
  const valid = updateIssueSchema.safeParse(body);
  if (!valid.success) {
    return NextResponse.json(
      { error: "The form dosent satisfy the required constraints!" },
      { status: 400 }
    );
  }

  // Update the issue with validated data (ensure only the updated fields are passed)
  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: body, // Use validated data (not the raw body)
  });

  return NextResponse.json(updatedIssue, { status: 200 });
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
  if (!session || session?.user.role !== "ADMIN")
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
