import prisma from "@/prisma/client";
import { Box } from "@radix-ui/themes";
import React from "react";
import IssuesToolbar from "./IssuesToolbar";
import IssuesTable from "../components/IssuesTable";
import Filters from "../components/Filters";
import { Status } from "@prisma/client";
import Pagination from "./_components/Pagination";
import { Metadata } from "next";

const IssuePage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    status: string;
    orderBy: string;
    order: string;
    page: string;
  }>;
}) => {
  // Construct the orderBy object dynamically
  const { status, orderBy, order, page } = await searchParams;
  const pageParsed = parseInt(page) || 1;
  const pageSize = 10;

  const validStatus =
    status && Object.values(Status).includes(status as Status)
      ? (status as Status)
      : undefined;

  const issues = await prisma.issue.findMany({
    where: { status: validStatus },
    orderBy: orderBy
      ? {
          [orderBy]: order || "asc",
        }
      : undefined,
    take: pageSize,
    skip: (pageParsed - 1) * pageSize,
  });
  const count = await prisma.issue.count({
    where: { status: validStatus },
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
