import prisma from "@/prisma/client";
import { Box } from "@radix-ui/themes";
import React from "react";
import IssuesToolbar from "./IssuesToolbar";
import IssuesTable from "../../components/IssuesTable";
import Filters from "../../components/Filters";
import { Priority, Status } from "@prisma/client";
import Pagination from "./_components/Pagination";
import { Metadata } from "next";
import { getProjectId } from "@/app/lib/getProjectId";

const IssuePage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    status: string;
    priority: string;
    orderBy: string;
    order: string;
    page: string;
  }>;
}) => {
  // Construct the orderBy object dynamically
  const { status, priority, orderBy, order, page } = await searchParams;
  const pageParsed = parseInt(page) || 1;
  const projectId = await getProjectId();
  const pageSize = 10;

  const validStatus =
    status && Object.values(Status).includes(status as Status)
      ? (status as Status)
      : undefined;
  const validPriority =
    priority && Object.values(Priority).includes(priority as Priority)
      ? (priority as Priority)
      : undefined;

  const issues = await prisma.issue.findMany({
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
  });
  const count = await prisma.issue.count({
    where: { status: validStatus, priority: validPriority },
  });

  return (
    <Box className="p-4 space-y-4">
      <IssuesToolbar />
      <Filters />
      <IssuesTable issues={issues} />
      <Pagination
        itemCount={count}
        pageSize={pageSize}
        currentPage={pageParsed}
      />
    </Box>
  );
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Issue Tracker - Issues List",
  description:
    "List of issues. Filter them by the status of issue, date of creation and also name of issues.",
};
export default IssuePage;
