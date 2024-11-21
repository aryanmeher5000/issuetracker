import { notFound } from "next/navigation";
import React from "react";
import prisma from "@/prisma/client";
import IssueForm from "../../_components/IssueForm";

const UpdateIssuePage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const issueDetails = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issueDetails) notFound();

  return <IssueForm issue={issueDetails} />;
};

export default UpdateIssuePage;
