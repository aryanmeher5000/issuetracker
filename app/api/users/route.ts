import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "../auth/auth";
import { getProjectId } from "@/app/lib/getProjectId";

export async function GET() {
  const requester = await auth();
  const project = await getProjectId();

  if (!requester || !requester.user?.email)
    return NextResponse.json(
      { error: "You are not authorized, please signin!" },
      { status: 401 }
    );

  const isAdmin = await prisma.project.findUnique({
    where: { id: project, admins: { has: requester.user.email } },
  });
  if (!isAdmin)
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 401 }
    );

  const projecte = await prisma.project.findUnique({
    where: { id: project },
    select: {
      admins: true,
      users: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found!" }, { status: 404 });
  }

  const adminEmails = projecte?.admins || [];
  const userEmails = projecte?.users || [];

  // Fetch details for admins
  const adminsWithDetails = await prisma.user.findMany({
    where: { email: { in: adminEmails } },
    select: {
      email: true,
      name: true,
      image: true,
    },
  });

  // Fetch details for users
  const usersWithDetails = await prisma.user.findMany({
    where: { email: { in: userEmails } },
    select: {
      email: true,
      name: true,
      image: true,
    },
  });

  const result = {
    admins: adminsWithDetails,
    users: usersWithDetails,
  };

  return NextResponse.json(result, { status: 200 });
}
