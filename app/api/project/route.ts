import { createProjectScehma } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/auth";
import { getProjectId } from "@/app/lib/getProjectId";

//Create a new project
export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await auth();

  //Check auth
  if (!session || !session.user?.email)
    return NextResponse.json(
      { error: "Please login to create project!" },
      { status: 403 }
    );

  //Validate body
  const validProj = createProjectScehma.safeParse(body);
  if (!validProj.success)
    return NextResponse.json(
      "Someproject fields did not meet required criteria!",
      { status: 400 }
    );

  //Create new project
  const newProj = await prisma.project.create({ data: body });

  return NextResponse.json(
    { message: "Project created successfylly", body: newProj },
    { status: 200 }
  );
}

//Add/Remove member/ Leave
export async function PUT(req: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );
  }

  // Check project existence
  const projectId = await getProjectId();
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return NextResponse.json({ error: "Project not found!" }, { status: 404 });
  }

  // Check admin privileges
  if (!project.admins.includes(session.user.email)) {
    return NextResponse.json(
      { error: "You are not authorized to perform this action!" },
      { status: 403 }
    );
  }

  // Parse request body
  const { userEmail, type, action } = await req.json();

  // Validate type
  if (type !== "admins" && type !== "users") {
    return NextResponse.json(
      { error: "Invalid action type." },
      { status: 400 }
    );
  }

  // Add a member
  if (action === "add") {
    if (type === "admins" && project.admins.includes(userEmail)) {
      return NextResponse.json(
        { error: `${userEmail} is already an admin.` },
        { status: 400 }
      );
    }
    if (type === "users" && project.users.includes(userEmail)) {
      return NextResponse.json(
        { error: `${userEmail} is already a session.user.` },
        { status: 400 }
      );
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        [type]: {
          push: userEmail,
        },
      },
    });

    return NextResponse.json(
      { message: `${userEmail} added to ${type}.` },
      { status: 200 }
    );
  }

  // Remove a member or leave the project
  if (action === "remove" || action === "leave") {
    const isAdmin = project.admins.includes(userEmail);
    const isUser = project.users.includes(userEmail);

    if (!isAdmin && !isUser) {
      return NextResponse.json(
        { error: `${userEmail} is not part of this project.` },
        { status: 404 }
      );
    }

    if (isAdmin) {
      const updatedAdmins = project.admins.filter(
        (email) => email !== userEmail
      );
      await prisma.project.update({
        where: { id: projectId },
        data: { admins: { set: updatedAdmins } },
      });
    } else if (isUser) {
      const updatedUsers = project.users.filter((email) => email !== userEmail);
      await prisma.project.update({
        where: { id: projectId },
        data: { users: { set: updatedUsers } },
      });
    }

    return NextResponse.json(
      {
        message:
          action === "remove"
            ? `${userEmail} removed from the project.`
            : `You left the project ${project.name}.`,
      },
      { status: 200 }
    );
  }

  // Invalid action
  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}

//Delete Project
export async function DELETE() {
  //Check authentication
  const session = await auth();
  if (!session || !session.user?.email)
    return NextResponse.json(
      { error: "You are not authenticated!" },
      { status: 401 }
    );

  //Check if project exists
  const projectId = await getProjectId();
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project)
    return NextResponse.json({ error: "Project not found!" }, { status: 404 });

  //Check if admin previlages
  if (!project.admins.includes(session.user.email))
    return NextResponse.json(
      {
        error: "You are not authorized to perform this action!",
      },
      { status: 403 }
    );

  const deletedProj = await prisma.project.delete({ where: { id: projectId } });

  return NextResponse.json(
    { message: "Projected deleted sccessfully", body: deletedProj },
    { status: 200 }
  );
}
