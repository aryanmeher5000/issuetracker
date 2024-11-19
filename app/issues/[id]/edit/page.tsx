"use client";
import prisma from "@/prisma/client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import IssueFormLoadingSkeleton from "../../_components/IssueFormLoadingSkeleton";
const IssueForm = dynamic(() => import("@/app/issues/_components/IssueForm"), {
  ssr: false,
  loading: IssueFormLoadingSkeleton,
});

interface Props {
  params: { id: string };
}

const page = async ({ params }: Props) => {
  const issueDetails = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issueDetails) notFound();

  return <IssueForm issue={issueDetails} />;
};

export default page;
