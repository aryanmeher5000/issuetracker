import prisma from "@/prisma/client";
import { Box } from "@radix-ui/themes";
import React from "react";
import IssuesToolbar from "./IssuesToolbar";
import IssuesTable from "../components/IssuesTable";
import Filters from "../components/Filters";
import { Status } from "@prisma/client";
import Pagination from "./_components/Pagination";

const IssuePage = async ({
  searchParams,
}: {
  searchParams: { status: string; orderBy: string; order: string };
}) => {
  // Construct the orderBy object dynamically
  const { status, orderBy, order } = await searchParams;

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
  });

  return (
    <Box className="p-4 space-y-4">
      <IssuesToolbar />
      <Filters />
      <IssuesTable issues={issues} />
      <Pagination />
    </Box>
  );
};

export const dynamic = "force-dynamic";
export default IssuePage;
