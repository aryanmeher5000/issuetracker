import { Button } from "@radix-ui/themes";
import { useAssignIssue } from "./AssignIssue";
import { Spinner } from "@/app/components";

const LeaveLeadButton = ({ id }: { id: number }) => {
  const { mutate, isPending } = useAssignIssue();

  return (
    <Button
      disabled={isPending}
      color="red"
      onClick={() => mutate({ issueId: id, userId: "unassign" })}
    >
      Leave Lead{isPending && <Spinner />}
    </Button>
  );
};

export default LeaveLeadButton;
