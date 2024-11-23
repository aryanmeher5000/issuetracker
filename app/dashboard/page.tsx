import { Flex, Grid } from "@radix-ui/themes";
import React from "react";
import LatestIssues from "./LatestIssues";
import IssueSummary from "./IssueSummary";
import prisma from "@/prisma/client";
import IssueChart from "./IssueChart";
import { Metadata } from "next";

const Dashboard = async () => {
  const open = await prisma.issue.count({ where: { status: "OPEN" } });
  const closed = await prisma.issue.count({ where: { status: "CLOSED" } });
  const inProgress = await prisma.issue.count({
    where: { status: "IN_PROGRESS" },
  });
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5" p="4">
      <Flex direction="column" gap="5" align="center">
        <IssueSummary open={open} closed={closed} inProgress={inProgress} />
        <IssueChart open={open} closed={closed} inProgress={inProgress} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
};
export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description:
    "Viewthe latest issues open, in progress and closed issues in the form of chart.",
};
export default Dashboard;
