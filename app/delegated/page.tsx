import prisma from "@/prisma/client";
import { Box } from "@radix-ui/themes";
import { auth } from "../api/auth/auth";
import IssuesTable from "../components/IssuesTable";
import Filters from "../components/Filters";
import { Status } from "@prisma/client";
import { Metadata } from "next";

const DelegatedIssues = async ({
  searchParams,
}: {
  searchParams: Promise<{ status: string; orderBy: string; order: string }>; // Make it a Promise
}) => {
  // Authenticate the user
  const session = await auth();

  // Resolve the searchParams Promise
  const { status, orderBy, order } = await searchParams;

  const validStatus =
    status && Object.values(Status).includes(status as Status)
      ? (status as Status)
      : undefined;

  const delegatedIssues = await prisma.user.findUnique({
    where: { email: session!.user.email! },
    select: {
      assignedIssues: {
        where: { status: validStatus },
        orderBy: orderBy
          ? {
              [orderBy]: order || "asc",
            }
          : undefined,
      },
    },
  });

  return (
    <Box className="space-y-4">
      <Filters />
      <IssuesTable issues={delegatedIssues!.assignedIssues} />
    </Box>
  );
};

export const metadata: Metadata = {
  title: "Issue Tracker - Delegated",
  description:
    "View the issues delegated to you. Filter them by status and name and date of creation.",
};

export default DelegatedIssues;
