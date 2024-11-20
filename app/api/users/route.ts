import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "../auth/auth";

export async function GET() {
  const requester = await auth();
  if (requester?.user.role !== "ADMIN")
    return NextResponse.json(
      { error: "Authorization denied!" },
      { status: 401 }
    );

  const users = await prisma.user.findMany();
  if (!users)
    return NextResponse.json(
      { error: "Internal server error!" },
      { status: 500 }
    );
  return NextResponse.json(users, { status: 200 });
}
