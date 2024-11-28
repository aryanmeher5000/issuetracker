import { createProjectScehma } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/auth";

//Create a new project
export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await auth();

  //Check auth
  if (!session.user)
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
