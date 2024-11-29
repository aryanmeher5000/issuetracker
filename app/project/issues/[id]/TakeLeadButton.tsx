"use client";
import { Button } from "@radix-ui/themes";
import { useAssignIssue } from "./AssignIssue";
import { useSession } from "next-auth/react";
import { Spinner } from "@/app/components";

const TakeLeadButton = ({ id }: { id: number }) => {
  const { mutate, isPending } = useAssignIssue();
  const { data } = useSession();

  if (!data || !data.user?.email) return;

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        mutate({ issueId: id, userId: data?.user?.email || undefined })
      }
    >
      Take Lead{isPending && <Spinner />}
    </Button>
  );
};

export default TakeLeadButton;
