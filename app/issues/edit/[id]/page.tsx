import prisma from "@/prisma/client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import IssueFormLoadingSkeleton from "../../_components/IssueFormLoadingSkeleton";

const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  loading: () => <IssueFormLoadingSkeleton />,
});

const UpdateIssuePage = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) notFound();

  let issueDetails;
  try {
    issueDetails = await prisma.issue.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Database error:", error);
    notFound();
  }

  if (!issueDetails) notFound();

  const issueData = JSON.parse(JSON.stringify(issueDetails));
  return <IssueForm issue={issueData} />;
};

export default UpdateIssuePage;
