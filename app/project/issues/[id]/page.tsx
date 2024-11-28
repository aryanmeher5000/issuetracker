import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import IssueInfo from "./IssueInfo";

const fetchUser = cache((issueId: number) => {
  return prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      assignedToUser: true,
    },
  });
});

const IssueDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const issueId = parseInt(id, 10);
  const issueDetail = await fetchUser(issueId);

  // If issue not found, return 404.
  if (!issueDetail) {
    return notFound();
  }

  return (
    <IssueInfo
      issueDetail={issueDetail}
      assignedTo={issueDetail.assignedToUser}
    />
  );
};

// Metadata generation for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const issueId = parseInt(id, 10);

  const issue = await fetchUser(issueId);

  return {
    title: issue?.title || "Issue Details",
    description: issue?.description || "Details of the selected issue",
  };
}

export default IssueDetailPage;
