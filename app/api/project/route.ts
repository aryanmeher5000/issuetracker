import { createProjectScehma } from "@/app/validationSchema";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

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
