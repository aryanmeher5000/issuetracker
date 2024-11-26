import { updateIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/auth";

// Utility to safely parse and validate `id` parameters
const parseIssueId = (id: string | undefined): number | null => {
  const issueId = id ? parseInt(id, 10) : NaN;
  return isNaN(issueId) ? null : issueId;
};

// Assign issue to a user -- Only ADMIN
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Ensure `params` is a Promise
) {
  const body = await request.json();
  const { id } = await context.params;

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
      return NextResponse.json({ error: `User not found.` }, { status: 404 });
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
}

// Update details of an issue
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const issueId = parseIssueId(id);
  if (!issueId) {
    return NextResponse.json(
      { error: "Invalid issue ID. It must be a number." },
      { status: 400 }
    );
  }

  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "User not authenticated!" },
      { status: 401 }
    );
  }

  const issue = await prisma.issue.findUnique({ where: { id: issueId } });
  if (!issue) {
    return NextResponse.json({ error: "Issue not found!" }, { status: 404 });
  }

  if (
    session.user.role !== "ADMIN" &&
    session.user.id !== issue.assignedToUserId
  ) {
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 403 }
    );
  }

  const body = await request.json();
  if (body.deadline) {
    body.deadline = new Date(body.deadline);
  }

  const valid = updateIssueSchema.safeParse(body);
  if (!valid.success) {
    return NextResponse.json(
      { error: "The form does not satisfy the required constraints!" },
      { status: 400 }
    );
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: valid.data,
  });

  return NextResponse.json(
    { message: "Issue updated.", issue: updatedIssue },
    { status: 200 }
  );
}

// Delete an issue -- Only if ADMIN
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Ensure `params` is a Promise
) {
  const { id } = await context.params; // Await the Promise for `params`

  const issueId = parseInt(id, 10);
  if (isNaN(issueId)) {
    return NextResponse.json(
      { error: "Invalid issue ID. It must be a number." },
      { status: 400 }
    );
  }

  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 403 }
    );
  }

  const issueExists = await prisma.issue.findUnique({ where: { id: issueId } });
  if (!issueExists) {
    return NextResponse.json({ error: "Issue not found." }, { status: 404 });
  }

  const deletedIssue = await prisma.issue.delete({ where: { id: issueId } });

  return NextResponse.json(
    { message: "Issue deleted successfully.", issue: deletedIssue },
    { status: 200 }
  );
}
