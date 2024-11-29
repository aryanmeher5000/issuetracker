import { updateIssueSchema } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/auth";
import { getProjectId } from "@/app/lib/getProjectId";

// Assign issue to a user -- Only ADMIN
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Authenticate user
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  // Extract and validate project
  const projectId = await getProjectId(); // Replace with your implementation
  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is missing or invalid." },
      { status: 400 }
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) {
    return NextResponse.json(
      { error: "Project not found. Please select a valid project!" },
      { status: 404 }
    );
  }

  // Check admin authorization
  if (!project.admins.includes(session.user.email)) {
    return NextResponse.json(
      { error: "Authorization denied! Only admins can perform this action." },
      { status: 403 }
    );
  }

  // Parse and validate issue ID
  const { id: issueIdParam } = await context.params;
  const issueId = parseInt(issueIdParam, 10);
  if (isNaN(issueId)) {
    return NextResponse.json(
      { error: "Invalid issue ID. It must be a valid number." },
      { status: 400 }
    );
  }

  // Parse request body
  const body = await request.json();
  const assigneeEmail = body.userId;
  let assignee = null;
  if (assigneeEmail !== "unassign") {
    assignee = await prisma.user.findUnique({
      where: { email: assigneeEmail },
    });
    if (!assignee) {
      return NextResponse.json(
        { error: "Assignee not found. Please provide a valid email." },
        { status: 404 }
      );
    }
  }

  // Update issue assignment
  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: { assignedToUserId: assignee ? assigneeEmail : null },
  });

  // Success response
  return NextResponse.json(
    {
      message:
        assigneeEmail !== "unassign"
          ? `Issue successfully assigned to ${assignee!.name}.`
          : "Issue successfully unassigned.",
      issue: updatedIssue,
    },
    { status: 200 }
  );
}

// Update details of an issue
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Authenticate the user
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "User not authenticated!" },
      { status: 401 }
    );
  }

  // Verify the project exists
  const projectId = await getProjectId(); // Replace with your actual implementation
  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is missing or invalid." },
      { status: 400 }
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found!" }, { status: 404 });
  }

  // Verify the issue exists
  const { id: issueIdParam } = await context.params;
  const issueId = parseInt(issueIdParam, 10);
  if (isNaN(issueId)) {
    return NextResponse.json(
      { error: "Invalid issue ID. It must be a number." },
      { status: 400 }
    );
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  if (!issue) {
    return NextResponse.json({ error: "Issue not found!" }, { status: 404 });
  }

  // Check if the user has permissions (admin or regular user of the project)
  if (
    !project.admins.includes(session.user.email) &&
    !project.users.includes(session.user.email)
  ) {
    return NextResponse.json(
      { error: "You are not authorized to perform this action!" },
      { status: 403 }
    );
  }

  // Parse and validate the request body
  const body = await request.json();
  if (body.deadline) {
    body.deadline = new Date(body.deadline);
  }

  const validationResult = updateIssueSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: "The form does not satisfy the required constraints." },
      { status: 400 }
    );
  }

  // Update the issue
  const currDate = new Date(); // Current date for IN_PROGRESS

  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: {
      ...validationResult.data, // Include other validated fields
      inProgression:
        validationResult.data?.status === "OPEN"
          ? null // Set to null if status is OPEN
          : validationResult.data?.status === "IN_PROGRESS"
          ? currDate // Set to current date if status is IN_PROGRESS
          : undefined, // No update if status is CLOSED or unchanged
    },
  });

  // Respond with the updated issue
  return NextResponse.json(
    { message: "Issue updated successfully.", issue: updatedIssue },
    { status: 200 }
  );
}

// Delete an issue -- Only if ADMIN
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Ensure `params` is a Promise
) {
  //Check issueid
  const { id } = await context.params;
  const issueId = parseInt(id, 10);
  if (isNaN(issueId)) {
    return NextResponse.json({ error: "Invalid issue ID!" }, { status: 400 });
  }
  //Check auth
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 403 }
    );
  }

  //chekc if project exists and isadmin
  const projectId = await getProjectId();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project || !project.admins.includes(session.user.email))
    return NextResponse.json(
      { error: "Project not found please select a valid project!" },
      { status: 404 }
    );

  //Check if issue exists
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
