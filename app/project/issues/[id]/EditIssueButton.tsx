"use client";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
  const { push } = useRouter();
  return (
    <Button onClick={() => push(`/project/issues/edit/${issueId}`)}>
      <FiEdit />
      Edit Issue
    </Button>
  );
};

export default EditIssueButton;
