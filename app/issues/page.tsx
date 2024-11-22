import prisma from "@/prisma/client";
import { Box } from "@radix-ui/themes";
import React from "react";
import delay from "delay";
import IssuesToolbar from "./IssuesToolbar";
import IssuesTable from "../components/IssuesTable";
import Filters from "../components/Filters";

const IssuePage = async () => {
  const issues = await prisma.issue.findMany();
  delay(5000);

  return (
    <Box className="p-4 space-y-4">
      <IssuesToolbar />
      <Filters />
      <IssuesTable issues={issues} />
    </Box>
  );
};

export const dynamic = "force-dynamic";
export default IssuePage;
