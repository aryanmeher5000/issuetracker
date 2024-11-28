import prisma from "@/prisma/client";
import { Box } from "@radix-ui/themes";
import { auth } from "../../api/auth/auth";
import IssuesTable from "../../components/IssuesTable";
import Filters from "../../components/Filters";
import { Priority, Status } from "@prisma/client";
import { Metadata } from "next";
import { getProjectId } from "@/app/lib/getProjectId";
import Pagination from "../issues/_components/Pagination";

const UserIssues = async ({
  searchParams,
}: {
  searchParams: Promise<{
    status: string;
    orderBy: string;
    order: string;
    priority: string;
    page: string;
  }>;
}) => {
  const session = await auth();
  const projectId = await getProjectId();

  // Resolve the searchParams Promise
  const { status, priority, orderBy, order, page } = await searchParams;
  const pageParsed = parseInt(page) || 1;
  const pageSize = 10;

  // Validate status and priority values
  const validStatus =
    status && Object.values(Status).includes(status as Status)
      ? (status as Status)
      : undefined;
  const validPriority =
    priority && Object.values(Priority).includes(priority as Priority)
      ? (priority as Priority)
      : undefined;

  // Fetch delegated issues for the user
  const delegatedIssues = await prisma.user.findUnique({
    where: { email: session!.user.email! },
    select: {
      assignedIssues: {
        where: {
          projectId: projectId,
          status: validStatus,
          priority: validPriority,
        },
        orderBy: orderBy
          ? {
              [orderBy]: order || "asc",
            }
          : undefined,
        take: pageSize,
        skip: (pageParsed - 1) * pageSize,
      },
    },
  });

  // Count the total number of delegated issues with projectId, status, and priority
  const count = await prisma.issue.count({
    where: {
      assignedToUserId: session.user.email,
      projectId: projectId,
      status: validStatus,
      priority: validPriority,
    },
  });

  return (
    <Box className="space-y-4">
      <Filters />
      <IssuesTable issues={delegatedIssues?.assignedIssues} />
      <Pagination
        itemCount={count}
        pageSize={pageSize}
        currentPage={pageParsed}
      />
    </Box>
  );
};

export const metadata: Metadata = {
  title: "Issue Tracker - Delegated",
  description:
    "View the issues delegated to you. Filter them by status and name and date of creation.",
};

export default UserIssues;
