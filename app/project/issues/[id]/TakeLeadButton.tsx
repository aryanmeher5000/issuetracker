"use client";
import { Button } from "@radix-ui/themes";
import { useAssignIssue } from "./AssignIssue";
import { useSession } from "next-auth/react";
import { Spinner } from "@/app/components";

const TakeLeadButton = ({ id }: { id: number }) => {
  const { mutate, isPending } = useAssignIssue();
  const { data } = useSession();

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate({ issueId: id, userId: data.user.email })}
    >
      Take Lead{isPending && <Spinner />}
    </Button>
  );
};

export default TakeLeadButton;
