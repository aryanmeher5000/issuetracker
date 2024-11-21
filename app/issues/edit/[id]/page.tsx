"use client";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import IssueFormLoadingSkeleton from "../../_components/IssueFormLoadingSkeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const IssueForm = dynamic(
  () =>
    import("@/app/issues/_components/IssueForm").then(
      (module) => module.default
    ),
  {
    loading: IssueFormLoadingSkeleton,
  }
);

const UpdateIssuePage = ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id, 10);
  const { data: issueDetails } = useGetIssueDetails(id);
  console.log(issueDetails);

  if (!issueDetails) notFound();

  return <IssueForm issue={issueDetails} />;
};

function useGetIssueDetails(id: number) {
  return useQuery({
    queryKey: ["Issue", id],
    queryFn: async () => {
      const res = await axios.get("/api/issues/" + id);
      return res.data;
    },
    enabled: !!id,
    retry: 2,
    staleTime: 60 * 60 * 1000,
  });
}

export default UpdateIssuePage;
